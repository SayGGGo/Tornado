import html
import json
import re
from secrets import compare_digest, token_urlsafe

from flask import jsonify, request, session
from sqlalchemy import case, func, or_
from sqlalchemy.exc import IntegrityError

from models import Chat, ChatParticipant, Message, User, db
from models.chat import ChatJoinRequest
from models.message import MessageReaction
from .events import notify_chat_users, notify_user
from .services import ChatService, EncryptionService, FileService
from .permissions import RIGHTS, has_right
from models.public_handle import CHAT_HANDLE_KINDS, CollectibleHandle, PublicHandle, reserve_handle

EMOJI = ("👍", "🌚", "🔥", "😢", "🏆", "😡", "❤️", "👏", "😂", "🤔", "🎉", "👎")


def chat_fields(chat):
    handles = (db.session.query(PublicHandle.name, CollectibleHandle.name.isnot(None))
               .outerjoin(CollectibleHandle, CollectibleHandle.name == PublicHandle.name)
               .filter(PublicHandle.owner_id == chat.id, PublicHandle.kind.in_(CHAT_HANDLE_KINDS))
               .order_by(case((PublicHandle.kind == "chat", 0), (PublicHandle.kind == "chat_collect", 1), else_=2)).all()
               if chat.visibility == "public" else [])
    return dict(name=chat.name, avatar=chat.avatar, description=chat.description or "", alias=chat.alias or "",
                usernames=[dict(name=name, collectible=collectible) for name, collectible in handles],
                visibility=chat.visibility or "public", approval_required=bool(chat.approval_required),
                protected=bool(chat.protected), discussion_chat_id=chat.discussion_chat_id,
                reactions_mode=chat.reactions_mode or "all", reaction_limit=chat.reaction_limit or 11,
                allowed_reactions=json.loads(chat.allowed_reactions or "[]"))


def join_managed_chat(chat_id, user_id, token):
    chat = db.session.get(Chat, chat_id)
    if not chat or chat.personal:
        return {"error": "Чат не найден"}
    membership = ChatParticipant.query.filter_by(chat_id=chat_id, user_id=user_id).first()
    if membership:
        return {"error": "Доступ ограничен"} if membership.blocked else {"success": True}
    if chat.visibility == "private" and (
        not isinstance(token, str) or not token.isascii() or not chat.invite_token or
        not compare_digest(chat.invite_token, token)
    ):
        return {"error": "Нужна действующая ссылка-приглашение"}
    if chat.approval_required:
        if not db.session.get(ChatJoinRequest, (chat_id, user_id)):
            db.session.add(ChatJoinRequest(chat_id=chat_id, user_id=user_id))
            db.session.commit()
            notify_chat_users(chat_id)
        return {"success": True, "pending": True}
    db.session.add(ChatParticipant(chat_id=chat_id, user_id=user_id))
    db.session.commit()
    notify_chat_users(chat_id)
    return {"success": True}


def register_chat_management(app):
    def owner_chat(chat_id):
        return Chat.query.filter_by(id=chat_id, owner_id=session.get("user_id"), personal=False).first() if session.get("user_id") else None

    def permitted_chat(chat_id, privilege):
        chat = db.session.get(Chat, chat_id)
        return chat if chat and not chat.personal and has_right(chat, session.get("user_id"), privilege) else None

    @app.get("/api/chats/by-alias/<alias>")
    def resolve_chat_alias(alias):
        if not session.get("user_id"):
            return jsonify(error="Требуется вход"), 401
        handle = db.session.get(PublicHandle, alias.lower())
        chat = (Chat.query.filter_by(id=handle.owner_id, visibility="public", personal=False).first()
                if handle and handle.kind in CHAT_HANDLE_KINDS else None)
        if not chat:
            return jsonify(error="Публичная ссылка недоступна"), 404
        return jsonify(id=chat.id, name=chat.name, avatar=chat.avatar, description=chat.description or "")

    @app.put("/api/chats/<int:chat_id>/administrators/<int:user_id>")
    def set_chat_admin(chat_id, user_id):
        chat = owner_chat(chat_id)
        if not chat or user_id == chat.owner_id:
            return jsonify(error="Назначать администраторов может владелец"), 403
        member = ChatParticipant.query.filter_by(chat_id=chat_id, user_id=user_id, blocked=False).first()
        if not member:
            return jsonify(error="Участник не найден"), 404
        payload = request.get_json(silent=True)
        privileges = payload.get("permissions") if isinstance(payload, dict) else None
        if not isinstance(privileges, list) or any(permission not in RIGHTS for permission in privileges):
            return jsonify(error="Некорректный набор прав"), 400
        member.role = "admin" if privileges else "member"
        member.permissions = json.dumps(list(dict.fromkeys(privileges)))
        db.session.commit()
        notify_chat_users(chat_id)
        return jsonify(success=True)

    @app.get("/api/search")
    def search_tornado():
        user_id = session.get("user_id")
        user = db.session.get(User, user_id) if user_id else None
        if not user:
            return jsonify(error="Требуется вход"), 401
        query = request.args.get("q", "").strip()[:100]
        if len(query) < 2:
            return jsonify(users=[], channels=[], messages=[], next_cursor=None)
        kind = request.args.get("kind", "all")
        cursor = request.args.get("cursor", type=int)
        items = []
        people = ChatService().search_users(query, user_id) if kind in ("all", "users", "bots") and not cursor else []
        if kind == "bots":
            ids = [item["id"] for item in people]
            bots = {row.id for row in User.query.filter(User.id.in_(ids), User.is_bot.is_(True))}
            people = [item for item in people if item["id"] in bots]
        channels = []
        if kind in ("all", "channels") and not cursor:
            matching_handles = db.session.query(PublicHandle.owner_id).filter(
                PublicHandle.kind.in_(CHAT_HANDLE_KINDS), PublicHandle.name.icontains(query.lstrip("@"), autoescape=True)
            )
            matched = Chat.query.filter(
                Chat.personal.is_(False), Chat.chat_type == "channel", Chat.visibility == "public",
                or_(Chat.name.icontains(query, autoescape=True), Chat.description.icontains(query, autoescape=True), Chat.id.in_(matching_handles)),
            ).order_by(Chat.name).limit(20)
            channels = [dict(id=item.id, name=item.name, avatar=item.avatar, description=item.description) for item in matched]
        if kind in ("users", "bots", "channels"):
            return jsonify(users=people, channels=channels, messages=[], next_cursor=None)
        rows = (db.session.query(Message, Chat.name, Chat.personal, Chat.avatar, Chat.chat_type, User.login)
                .join(Chat, Chat.id == Message.chat_id)
                .join(ChatParticipant, ChatParticipant.chat_id == Message.chat_id)
                .join(User, User.id == Message.user_id)
                .filter(ChatParticipant.user_id == user_id, ChatParticipant.blocked.is_(False),
                        Message.id > func.coalesce(ChatParticipant.history_after_id, 0),
                        Message.is_deleted.is_(False), Message.msg_type != "bot_callback"))
        if kind == "posts":
            rows = rows.filter(Chat.chat_type == "channel")
        if kind == "media":
            rows = rows.filter(Message.file_url.isnot(None))
        if cursor:
            rows = rows.filter(Message.id < cursor)
        rows = rows.order_by(Message.id.desc()).limit(200).all()
        needle = query.casefold()
        crypto = EncryptionService()
        scanned = 0
        for message, name, personal, avatar, chat_type, author in rows:
            scanned += 1
            text = html.unescape(crypto.decrypt_for_user(message.content, user.private_key, message.user_id != user_id))
            if needle not in text.casefold() and needle not in (message.file_name or "").casefold():
                continue
            if kind == "links" and not re.search(r"https?://", text, re.IGNORECASE):
                continue
            start = max(0, text.casefold().find(needle) - 45)
            items.append(dict(id=message.id, chat_id=message.chat_id, name=None if personal else name,
                              avatar=avatar, author=author, text=text[start:start+200] or message.file_name,
                              at=message.timestamp.isoformat() + "Z"))
            if len(items) == 20:
                break
        next_cursor = rows[scanned-1][0].id if scanned and (scanned < len(rows) or len(rows) == 200) else None
        return jsonify(users=people, channels=channels, messages=items, next_cursor=next_cursor)

    @app.put("/api/chats/<int:chat_id>/settings")
    def update_chat_settings(chat_id):
        chat = permitted_chat(chat_id, "manage")
        if not chat:
            return jsonify(error="Настройки доступны владельцу"), 403
        data = request.get_json(silent=True) or {}
        if not isinstance(data, dict):
            return jsonify(error="Некорректные настройки"), 400
        for field, maximum in (("name", 150), ("description", 250)):
            if field in data:
                value = data[field]
                if not isinstance(value, str) or len(value.strip()) > maximum or (field == "name" and not value.strip()):
                    message = "Введите название от 1 до 150 символов." if field == "name" else "Сократите описание до 250 символов."
                    return jsonify(error=message, field=field), 400
                setattr(chat, field, value.strip())
        for field, allowed in (("visibility", ("public", "private")), ("reactions_mode", ("all", "selected", "none"))):
            if field in data:
                if data[field] not in allowed:
                    return jsonify(error="Недопустимый режим"), 400
                setattr(chat, field, data[field])
        for field in ("approval_required", "protected"):
            if field in data:
                if type(data[field]) is not bool:
                    return jsonify(error="Некорректное значение"), 400
                setattr(chat, field, data[field])
        if "reaction_limit" in data:
            limit = data["reaction_limit"]
            if type(limit) is not int or not 1 <= limit <= len(EMOJI):
                return jsonify(error="Недопустимый лимит реакций"), 400
            chat.reaction_limit = limit
        if "allowed_reactions" in data:
            allowed = data["allowed_reactions"]
            if not isinstance(allowed, list) or any(emoji not in EMOJI for emoji in allowed):
                return jsonify(error="Недопустимая реакция"), 400
            chat.allowed_reactions = json.dumps(list(dict.fromkeys(allowed)), ensure_ascii=False)
        collectible_alias = chat.alias and db.session.get(CollectibleHandle, chat.alias)
        if "alias" in data:
            alias = data["alias"]
            if not isinstance(alias, str):
                return jsonify(error="Введите короткое имя.", field="alias"), 400
            alias = alias.strip().lower().lstrip("@")
            if collectible_alias and alias != chat.alias:
                return jsonify(error="Коллекционное имя закреплено за каналом.", field="alias"), 400
            if alias and not re.fullmatch(r"[a-z][a-z0-9_]{2,31}", alias):
                return jsonify(error="Введите от 3 до 32 символов, начиная с латинской буквы. Допустимы буквы, цифры и подчёркивания.", field="alias"), 400
            chat.alias = alias or None
        if chat.visibility != "public" and not collectible_alias:
            chat.alias = None
        if "discussion_chat_id" in data:
            target_id = data["discussion_chat_id"]
            if target_id is not None and (type(target_id) is not int or not Chat.query.filter_by(
                id=target_id, owner_id=session.get("user_id"), personal=False, chat_type="group"
            ).first()):
                return jsonify(error="Выберите свою группу для обсуждения"), 400
            if chat.chat_type != "channel":
                return jsonify(error="Обсуждение доступно для каналов"), 400
            chat.discussion_chat_id = target_id
        try:
            reserve_handle("chat", chat.id, chat.alias)
            db.session.commit()
        except (IntegrityError, ValueError):
            db.session.rollback()
            return jsonify(error="Это короткое имя уже занято. Выберите другое.", field="alias"), 409
        notify_chat_users(chat_id)
        return jsonify(success=True, **chat_fields(chat))

    @app.post("/api/chats/<int:chat_id>/avatar")
    def update_chat_avatar(chat_id):
        chat = permitted_chat(chat_id, "manage")
        if not chat:
            return jsonify(error="Изменять фото может владелец"), 403
        image = request.files.get("avatar")
        if not image or image.mimetype not in ("image/png", "image/jpeg", "image/webp", "image/gif"):
            return jsonify(error="Выберите фото JPEG, PNG, WebP или GIF.", field="avatar"), 400
        image.stream.seek(0, 2)
        size = image.stream.tell()
        image.stream.seek(0)
        if not size or size > 10 * 1024 * 1024:
            return jsonify(error="Выберите фото размером до 10 МБ.", field="avatar"), 400
        from PIL import Image
        try:
            with Image.open(image.stream) as raster:
                if raster.format not in ("PNG", "JPEG", "WEBP", "GIF") or raster.width * raster.height > 30_000_000:
                    return jsonify(error="Не удалось прочитать фото. Выберите другой файл.", field="avatar"), 400
                raster.verify()
        except (OSError, ValueError, Image.DecompressionBombError):
            return jsonify(error="Не удалось прочитать фото. Выберите другой файл.", field="avatar"), 400
        image.stream.seek(0)
        stored = FileService.save_file(image)
        if not stored:
            return jsonify(error="Не удалось сохранить фото"), 400
        chat.avatar = stored["url"]
        db.session.commit()
        notify_chat_users(chat_id)
        return jsonify(success=True, avatar=chat.avatar)

    @app.post("/api/chats/<int:chat_id>/invite-link")
    def reset_chat_invite(chat_id):
        chat = permitted_chat(chat_id, "invite")
        if not chat:
            return jsonify(error="Ссылка доступна владельцу"), 403
        chat.invite_token = token_urlsafe(24)
        db.session.commit()
        return jsonify(token=chat.invite_token)

    @app.route("/api/chats/<int:chat_id>/requests", methods=["GET", "POST"])
    def manage_join_requests(chat_id):
        chat = permitted_chat(chat_id, "invite")
        if not chat:
            return jsonify(error="Заявки доступны владельцу"), 403
        if request.method == "GET":
            users = User.query.join(ChatJoinRequest, User.id == ChatJoinRequest.user_id).filter(ChatJoinRequest.chat_id == chat_id)
            return jsonify([dict(id=user.id, name=user.fio, login=user.login, avatar=user.avatar) for user in users])
        data = request.get_json(silent=True) or {}
        target_id = data.get("user_id")
        if type(target_id) is not int or type(data.get("accept")) is not bool:
            return jsonify(error="Некорректная заявка"), 400
        pending = db.session.get(ChatJoinRequest, (chat_id, target_id))
        if pending:
            if data["accept"] and not ChatParticipant.query.filter_by(chat_id=chat_id, user_id=target_id).first():
                db.session.add(ChatParticipant(chat_id=chat_id, user_id=target_id))
            db.session.delete(pending)
            db.session.commit()
            notify_chat_users(chat_id)
        return jsonify(success=True)

    @app.put("/api/messages/<int:message_id>/reaction")
    def set_message_reaction(message_id):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify(error="Требуется вход"), 401
        message = db.session.get(Message, message_id)
        if not message or message.is_deleted:
            return jsonify(error="Сообщение недоступно"), 404
        member = ChatParticipant.query.filter_by(chat_id=message.chat_id, user_id=user_id, blocked=False).first()
        if not member:
            return jsonify(error="Сообщение недоступно"), 404
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict) or "emoji" not in payload:
            return jsonify(error="Укажите реакцию"), 400
        emoji = payload["emoji"]
        existing = db.session.get(MessageReaction, (message_id, user_id))
        if emoji is None:
            if existing:
                db.session.delete(existing)
        else:
            chat = message.chat
            mode = chat.reactions_mode or "all"
            choices = EMOJI if mode == "all" else json.loads(chat.allowed_reactions or "[]") if mode == "selected" else ()
            if emoji not in choices:
                return jsonify(error="Эта реакция отключена"), 400
            current = db.session.query(MessageReaction.emoji).filter(
                MessageReaction.message_id == message_id, MessageReaction.user_id != user_id
            ).distinct()
            distinct = {row.emoji for row in current}
            if emoji not in distinct and len(distinct) >= (chat.reaction_limit or 11):
                return jsonify(error="Достигнут лимит реакций"), 400
            if existing:
                existing.emoji = emoji
            else:
                db.session.add(MessageReaction(message_id=message_id, user_id=user_id, emoji=emoji))
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return jsonify(error="Реакция уже меняется"), 409
        notify_chat_users(message.chat_id)
        return jsonify(success=True, reactions=message_reactions([message_id], user_id).get(message_id, []))


def message_reactions(ids, user_id):
    if not ids:
        return {}
    rows = (db.session.query(MessageReaction.message_id, MessageReaction.emoji,
            func.count(MessageReaction.user_id), func.sum(case((MessageReaction.user_id == user_id, 1), else_=0)))
            .filter(MessageReaction.message_id.in_(ids))
            .group_by(MessageReaction.message_id, MessageReaction.emoji))
    result = {}
    for message_id, emoji, count, own in rows:
        result.setdefault(message_id, []).append(dict(emoji=emoji, count=count, own=bool(own)))
    return result
