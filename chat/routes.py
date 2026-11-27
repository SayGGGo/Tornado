import os
import hashlib
from functools import lru_cache
import re
import json
import threading
from urllib.parse import urlsplit
from datetime import datetime, timedelta
from flask import render_template, jsonify, session, request, redirect, url_for, send_from_directory, abort, make_response
from models import db, User, Chat, ChatParticipant, Message, PublicHandle
from models.public_handle import reserve_handle
from .services import ChatService, AgoraService, FileService, EncryptionService, flood_control
from config import Config
import uuid

from .events import epoch, notify_chat_users, notify_user, wait_for_revision
from .permissions import member_rights
from .management import chat_fields, join_managed_chat, message_reactions, register_chat_management

CHAT_PART_SIZE = 24000


@lru_cache(maxsize=2)
def chat_bundle_info(path, version):
    with open(path, "rb") as source:
        bundle = source.read()
    return {
        "count": (len(bundle) + CHAT_PART_SIZE - 1) // CHAT_PART_SIZE,
        "sha256": hashlib.sha256(bundle).hexdigest(),
    }

try:
    from pywebpush import webpush, WebPushException
    _WEBPUSH_OK = True
except ImportError:
    _WEBPUSH_OK = False


def _send_push_background(subscriptions):
    if not _WEBPUSH_OK or not Config.VAPID_PRIVATE_KEY:
        return
    for sub, payload in subscriptions:
        try:
            webpush(
                subscription_info=sub,
                data=json.dumps(payload).encode(),
                vapid_private_key=Config.VAPID_PRIVATE_KEY,
                vapid_claims={"sub": Config.VAPID_CLAIMS_EMAIL},
            )
        except WebPushException:
            pass
        except Exception:
            pass


def send_push_to_chat_members(chat_id, sender_id, sender_name, message_text, sender_avatar):
    from models.push import PushSubscription
    subs = (PushSubscription.query
            .join(ChatParticipant, ChatParticipant.user_id == PushSubscription.user_id)
            .filter(ChatParticipant.chat_id == chat_id, ChatParticipant.blocked.is_(False), PushSubscription.user_id != sender_id)
            .all())
    if not subs:
        return
    body = message_text or 'Новое сообщение'
    if body.startswith('__CALL_INVOKE__') or body.startswith('__CALL_INVITE__'):
        body = '📞 Входящий видеозвонок'
    elif body.startswith('__CHATLINK__'):
        body = '📩 Приглашение в чат'
    payload = {
        "title": sender_name,
        "body": body[:120],
        "icon": sender_avatar or '/static/icons/logo.svg',
        "tag": f"tornado-chat-{chat_id}",
        "chatId": chat_id,
        "url": "/chat",
    }
    chat = db.session.get(Chat, chat_id)
    kind = "personal" if chat and chat.personal else "channel" if chat and chat.chat_type == "channel" else "group"
    deliveries = []
    for sub in subs:
        settings = json.loads(sub.settings or "{}")
        override = settings.get("overrides", {}).get(str(chat_id))
        if override is False or (override is None and settings.get("kinds", {}).get(kind) is False):
            continue
        safe_payload = dict(payload)
        if settings.get("previews", {}).get(kind) is False:
            safe_payload["body"] = "Новое сообщение"
        deliveries.append(({"endpoint": sub.endpoint, "keys": {"p256dh": sub.p256dh, "auth": sub.auth}}, safe_payload))
    if deliveries:
        threading.Thread(target=_send_push_background, args=(deliveries,), daemon=True).start()

def _profile_avatar(user):
    return user.avatar or f"https://ui-avatars.com/api/?name={user.login}&background=315745&color=fff"


def _can_forward(user_id, message_id):
    if message_id is None:
        return True
    try:
        message_id = int(message_id)
    except (TypeError, ValueError):
        return False
    return (db.session.query(Message.id).join(Chat, Chat.id == Message.chat_id)
            .join(ChatParticipant, ChatParticipant.chat_id == Message.chat_id)
            .filter(Message.id == message_id, Message.is_deleted.is_(False),
                    ChatParticipant.user_id == user_id, ChatParticipant.blocked.is_(False),
                    Chat.protected.is_not(True)).first() is not None)


def public_name(user):
    row = PublicHandle.query.filter_by(kind="user", owner_id=user.id).first()
    return row.name if row else user.login


def register_chat(app):
    chat_service = ChatService()
    register_chat_management(app)

    @app.get("/static/chat-parts/<int:version>/<int:part>.js")
    def chat_bundle_part(version, part):
        bundle = os.path.join(app.static_folder, "chat-web", "tornado.js")
        if os.getenv("TORNADO_CHUNKED_CLIENT") != "1" or not os.path.isfile(bundle) or int(os.path.getmtime(bundle)) != version:
            abort(404)
        if part >= chat_bundle_info(bundle, version)["count"]:
            abort(404)
        with open(bundle, "rb") as source:
            source.seek(part * CHAT_PART_SIZE)
            data = source.read(CHAT_PART_SIZE)
        if not data:
            abort(404)
        return app.response_class(data, mimetype="application/javascript")

    @app.get("/t/<handle>")
    def public_link(handle):
        if not session.get("user_id"):
            return redirect(url_for("login", next=request.script_root + request.full_path.rstrip("?")))
        token = request.args.get("token")
        if handle.startswith("join-") and handle[5:].isascii() and handle[5:].isdecimal():
            return redirect(url_for("chat", join=int(handle[5:]), invite=token or ""))
        if handle.startswith("chat-") and handle[5:].isascii() and handle[5:].isdecimal():
            chat = db.session.get(Chat, int(handle[5:]))
        else:
            entry = db.session.get(PublicHandle, handle.lower())
            if entry and entry.kind == "user" and db.session.get(User, entry.owner_id):
                return redirect(url_for("chat", start_peer=entry.owner_id))
            chat = db.session.get(Chat, entry.owner_id) if entry and entry.kind == "chat" else None
        if chat and not chat.personal and chat.visibility == "public":
            member = ChatParticipant.query.filter_by(chat_id=chat.id, user_id=session["user_id"], blocked=False).first()
            return redirect(url_for("chat", chat=chat.id) if member else url_for("chat", join=chat.id))
        abort(404)

    @app.get("/t/u/<username>")
    def public_user_link(username):
        if not session.get("user_id"):
            return redirect(url_for("login", next=request.script_root + request.path))
        from sqlalchemy import func
        user = User.query.filter_by(login=username).first()
        if not user:
            matches = User.query.filter(func.lower(User.login) == username.lower()).limit(2).all()
            if len(matches) != 1:
                abort(404)
            user = matches[0]
        return redirect(url_for("chat", peer=user.id))

    @app.get("/t/c/<alias>")
    @app.get("/c/<alias>")
    def public_chat_link(alias):
        if alias.isdecimal():
            return redirect(url_for("chat", join=int(alias)))
        return redirect(url_for("chat", channel=alias.lower()))

    @app.get("/t/i/<int:chat_id>")
    def invite_chat_link(chat_id):
        return redirect(url_for("chat", join=chat_id, invite=request.args.get("token", "")))

    @app.route("/chat/classic", endpoint="chat_classic")
    @app.route("/chat")
    def chat():
        if "user_id" not in session:
            return redirect(url_for("login", next=request.script_root + request.full_path.rstrip("?")))

        user = db.session.get(User, session["user_id"])
        if not user:
            session.pop("user_id", None)
            return redirect(url_for("login"))

        if not user.public_key or not user.private_key:
            crypto = EncryptionService()
            priv, pub = crypto.generate_keys()
            user.private_key = priv
            user.public_key = pub
            db.session.commit()

        user.last_seen = datetime.utcnow()

        if user.avatar and (user.avatar.startswith("data:image/") or user.avatar.startswith("data:video/")):
            try:
                import base64 as _b64
                header, b64body = user.avatar.split(",", 1)
                mime = header.split(":")[1].split(";")[0]
                ext_map = {
                    "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif",
                    "image/webp": "webp", "video/mp4": "mp4", "video/webm": "webm"
                }
                ext = ext_map.get(mime, "jpg")
                raw = _b64.b64decode(b64body)
                safe_name = f"{uuid.uuid4().hex}.{ext}"
                os.makedirs(FileService.UPLOAD_DIR, exist_ok=True)
                fpath = os.path.join(FileService.UPLOAD_DIR, safe_name)
                with open(fpath, "wb") as fout:
                    fout.write(raw)
                sig = FileService.sign_filename(safe_name)
                user.avatar = f"/api/files/{safe_name}?sig={sig}"
            except Exception:
                user.avatar = None

        db.session.commit()

        folders = [{"name": "Все", "count": 0, "active": True}]
        msg_data = {}

        from models.server import Settings
        srv_settings = Settings.query.first()
        premium_only = srv_settings.premium_only_messaging if srv_settings else False

        if request.endpoint == "chat":
            account = dict(id=user.id, login=user.login, name=user.fio, bio=user.bio or "",
                           avatar=_profile_avatar(user), premium=bool(user.premium),
                           handle=public_name(user),
                           show_bio=user.show_bio is not False, show_last_seen=user.show_last_seen is not False,
                           can_message=not premium_only or bool(user.premium))
            bundle = os.path.join(app.static_folder, "chat-web", "tornado.js")
            asset_version = int(os.path.getmtime(bundle)) if os.path.isfile(bundle) else 0
            parts = None
            if asset_version and os.getenv("TORNADO_CHUNKED_CLIENT") == "1":
                parts = chat_bundle_info(bundle, asset_version)
            response = make_response(render_template("chat_web.html", account=account, asset_version=asset_version, chat_parts=parts))
            response.headers["Cache-Control"] = "no-store"
            return response

        resp = make_response(render_template("chat.html", current_user=user, msg_data=msg_data, folders=folders, premium_only_messaging=premium_only))
        resp.headers['Cache-Control'] = 'no-store'
        return resp

    @app.get("/api/user/<int:target_user_id>/qr")
    def profile_qr(target_user_id):
        if not session.get("user_id"):
            abort(401)
        target = db.session.get(User, target_user_id)
        if not target:
            abort(404)
        return public_qr(public_name(target))

    @app.get("/api/chats/<int:chat_id>/qr")
    def chat_qr(chat_id):
        if not session.get("user_id"):
            abort(401)
        chat = db.session.get(Chat, chat_id)
        if not chat or chat.personal or chat.visibility != "public":
            abort(404)
        return public_qr(chat.alias or f"chat-{chat.id}")

    def public_qr(handle):
        from io import BytesIO
        import qrcode
        from qrcode.image.styledpil import StyledPilImage
        from qrcode.image.styles.moduledrawers.pil import RoundedModuleDrawer
        from PIL import ImageDraw
        from flask import send_file
        qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=9, border=4)
        qr.add_data(url_for("public_link", handle=handle, _external=True))
        qr.make(fit=True)
        image = qr.make_image(image_factory=StyledPilImage, module_drawer=RoundedModuleDrawer()).get_image().convert("RGB")
        draw = ImageDraw.Draw(image)
        center = image.width // 2
        radius = image.width * 8 // 100
        draw.rounded_rectangle((center-radius-4, center-radius-4, center+radius+4, center+radius+4),
                               radius=max(8, radius//2), fill="white")
        draw.rounded_rectangle((center-radius, center-radius, center+radius, center+radius),
                               radius=max(6, radius//2), fill="#244736")
        scale = radius * 1.45 / 1032
        left, top = center - 566 * scale, center - 321 * scale
        draw.polygon([(left+x*scale, top+y*scale) for x,y in (
            (442.5,592),(687.8,384.7),(687.8,235.8),(811.9,235.8),
            (1082,50),(334.1,50),(50,235.8),(442.5,235.8)
        )], fill="white")
        output = BytesIO()
        image.save(output, format="PNG")
        output.seek(0)
        return send_file(output, mimetype="image/png", max_age=0)

    @app.route("/api/user/update_status", methods=["POST"])
    def update_status():
        if "user_id" not in session:
            return jsonify({"ok": False}), 401
        user = db.session.get(User, session["user_id"])
        if user:
            user.last_seen = datetime.utcnow()
            db.session.commit()
            return jsonify({"ok": True})
        return jsonify({"ok": False}), 404

    @app.route("/api/chat/typing", methods=["POST"])
    def update_typing():
        if "user_id" not in session:
            return jsonify({"ok": False}), 401
        chat_id = request.json.get("chat_id")
        if not chat_id:
            return jsonify({"ok": False}), 400

        part = ChatParticipant.query.filter_by(user_id=session["user_id"], chat_id=chat_id).first()
        if part:
            part.last_typing = datetime.utcnow()
            db.session.commit()
            return jsonify({"ok": True})
        return jsonify({"ok": False}), 403

    @app.route("/api/user/<int:target_user_id>", methods=["GET"])
    def get_user_info(target_user_id):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        user = db.session.get(User, target_user_id)
        if not user:
            return jsonify({"error": "Not found"}), 404

        may_see_presence = user.id == session["user_id"] or user.show_last_seen is not False
        is_online = may_see_presence and user.last_seen and (datetime.utcnow() - user.last_seen) < timedelta(minutes=2)
        avatar = user.avatar if getattr(user, 'avatar', None) else f"https://ui-avatars.com/api/?name={user.login}&background=random&color=fff&rounded=true&bold=true"
        return jsonify({
            "id": user.id,
            "login": user.login,
            "fio": user.fio,
            "handle": public_name(user),
            "verified": bool(user.is_verified),
            "avatar": avatar,
            "bio": (user.bio or "") if user.id == session["user_id"] or user.show_bio is not False else "",
            "online": is_online,
            "last_seen": user.last_seen.strftime("%Y-%m-%d %H:%M:%S") if may_see_presence and user.last_seen else None
        })

    @app.route("/api/messages", methods=["GET"])
    def get_messages():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        chat_id = request.args.get("chat_id")
        last_id = request.args.get("last_id", 0, type=int)
        first_id = request.args.get("first_id", 0, type=int)

        if not chat_id or chat_id == 'null':
            return jsonify([])

        user_id = session["user_id"]
        messages = chat_service.get_recent_messages(user_id, int(chat_id), last_id, first_id, request.args.get("around", 0, type=int))
        reactions = message_reactions([item["id"] for item in messages if not item["is_deleted"]], user_id)
        for item in messages:
            item["reactions"] = reactions.get(item["id"], [])
        return jsonify(messages)

    @app.route("/api/messages", methods=["POST"])
    def send_message():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        from models.server import Settings
        settings = Settings.query.first()
        if settings and settings.premium_only_messaging:
            sender_user = db.session.get(User, session["user_id"])
            if not (sender_user and getattr(sender_user, 'premium', False)):
                return jsonify({"error": "premium_required"}), 403
        data = request.json or {}

        _check_user = db.session.get(User, session["user_id"])
        if _check_user and _check_user.is_banned:
            if _check_user.ban_expires and _check_user.ban_expires < datetime.utcnow():
                _check_user.is_banned = False
                _check_user.ban_reason = None
                _check_user.ban_expires = None
                db.session.commit()
            else:
                return jsonify({"error": "Вы заблокированы"}), 403

        chat_id = data.get("chat_id")
        target_user_id = data.get("target_user_id")
        if not chat_id and target_user_id:
            chat_data = chat_service.get_or_create_personal_chat(session["user_id"], target_user_id)
            chat_id = chat_data["chat_id"]
        sender = db.session.get(User, session["user_id"])
        content = data.get("content", "")
        reply_to_id = data.get("reply_to_id")
        if not _can_forward(session["user_id"], data.get("forward_from")):
            return jsonify(error="Пересылка этого сообщения недоступна"), 403
        msg_type = data.get("msg_type", "text")

        if settings and settings.anti67_enabled and content:
            from utils.profanity import check_anti67
            if check_anti67(content):
                return jsonify({"error": "Сообщение нарушает правила сервера"}), 400

        if settings and getattr(settings, 'anti_profanity_enabled', False) and content and not content.startswith('__'):
            try:
                from utils.profanity import check_profanity
                hit = check_profanity(content)
                if hit and hit.get("level", 0) >= 1:
                    return jsonify({"error": "Сообщение содержит недопустимые слова"}), 400
            except Exception:
                pass

        result = chat_service.post_message(session["user_id"], chat_id, content, reply_to_id=reply_to_id, msg_type=msg_type)
        if result.get("error") == "blocked":
            return jsonify(result), 403
        if "success" in result:
            result["chat_id"] = chat_id
            if sender:
                avatar = sender.avatar or f"https://ui-avatars.com/api/?name={sender.login}&background=random&color=fff&rounded=true&bold=true"
                send_push_to_chat_members(chat_id, session["user_id"], sender.login, content, avatar)

            if content and not content.startswith('__'):
                try:
                    from utils.profanity import check_profanity
                    hit = check_profanity(content)
                    if hit and getattr(settings, 'profanity_auto_report', True):
                        _create_auto_report(session["user_id"], int(chat_id), content, hit)
                except Exception:
                    pass

        return jsonify(result), 200 if "success" in result else 429 if "Слишком" in result.get("error", "") else 400

    def _create_auto_report(user_id, chat_id, content, hit):
        from models.report import UserReport
        from models import Message
        from chat.services import EncryptionService
        import json as _json
        recent = (Message.query
                  .filter_by(chat_id=chat_id, is_deleted=False)
                  .order_by(Message.id.desc())
                  .limit(5).all())
        recent.reverse()
        sender = db.session.get(User, user_id)
        cs = EncryptionService()
        context = []
        for m in recent:
            login = m.author.login if m.author else f"#{m.user_id}"
            try:
                text = cs.decrypt_for_user(m.content, sender.private_key, m.user_id != user_id) if sender else "🔒"
            except Exception:
                text = "🔒"
            context.append({"login": login, "text": text[:200], "ts": m.timestamp.strftime("%H:%M")})
        report = UserReport(
            reporter_id=None,
            reported_user_id=user_id,
            reason=f"Авторепорт: обнаружено слово «{hit['word']}»",
            context_messages=_json.dumps(context, ensure_ascii=False),
            threat_level=hit['level'],
            is_auto=True,
            trigger_word=hit['word'],
            chat_id=chat_id,
        )
        db.session.add(report)
        db.session.commit()

    @app.route("/api/report", methods=["POST"])
    def send_report():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        data = request.json or {}
        reported_user_id = data.get("reported_user_id")
        reason = (data.get("reason") or "").strip()
        chat_id = data.get("chat_id")
        if not reported_user_id or not reason:
            return jsonify({"error": "Укажите пользователя и причину"}), 400
        if len(reason) > 500:
            return jsonify({"error": "Причина слишком длинная"}), 400

        from models.report import UserReport
        from models import Message
        import json as _json

        context = []
        if chat_id:
            from models import ChatParticipant
            if ChatParticipant.query.filter_by(user_id=session["user_id"], chat_id=int(chat_id)).first():
                recent = (Message.query
                          .filter_by(chat_id=int(chat_id), is_deleted=False)
                          .order_by(Message.id.desc())
                          .limit(5).all())
                recent.reverse()
                sender = db.session.get(User, session["user_id"])
                for m in recent:
                    login = m.author.login if m.author else f"#{m.user_id}"
                    try:
                        from chat.services import EncryptionService
                        cs = EncryptionService()
                        text = cs.decrypt_for_user(m.content, sender.private_key, m.user_id != session["user_id"]) if sender else "🔒"
                    except Exception:
                        text = "🔒"
                    context.append({"login": login, "text": text[:200], "ts": m.timestamp.strftime("%H:%M")})

        report = UserReport(
            reporter_id=session["user_id"],
            reported_user_id=int(reported_user_id),
            reason=reason,
            context_messages=_json.dumps(context, ensure_ascii=False),
            threat_level=0,
            is_auto=False,
            chat_id=int(chat_id) if chat_id else None,
        )
        db.session.add(report)
        db.session.commit()
        return jsonify({"success": True})

    @app.route("/api/messages/<int:message_id>", methods=["PUT"])
    def edit_message(message_id):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        data = request.json or {}
        new_content = data.get("content")
        result = chat_service.edit_message(session["user_id"], message_id, new_content)
        return jsonify(result), 200 if "success" in result else 400

    @app.route("/api/messages/<int:message_id>", methods=["DELETE"])
    def delete_message(message_id):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        result = chat_service.delete_message(session["user_id"], message_id)
        return jsonify(result), 200 if "success" in result else 400

    @app.route("/api/files/<filename>")
    def serve_file(filename):
        if "user_id" not in session:
            abort(401)
        sig = request.args.get("sig", "")
        if not sig or not FileService.verify_signature(filename, sig):
            abort(403)
        safe = os.path.basename(filename)
        if not re.match(r'^[0-9a-f]{32}\.[a-z0-9]{1,10}$', safe):
            abort(400)
        upload_root = os.path.realpath(FileService.UPLOAD_DIR)
        fpath = os.path.realpath(os.path.join(upload_root, safe))
        if os.path.commonpath([upload_root, fpath]) != upload_root:
            abort(400)
        if not os.path.isfile(fpath):
            abort(404)
        resp = send_from_directory(FileService.UPLOAD_DIR, safe)
        resp.headers['Cache-Control'] = 'private, max-age=31536000, immutable'
        resp.headers['X-Content-Type-Options'] = 'nosniff'
        return resp

    @app.route("/api/messages/status", methods=["GET"])
    def messages_status():
        if "user_id" not in session:
            return jsonify([]), 401
        chat_id_raw = request.args.get("chat_id")
        ids_str = request.args.get("ids", "")
        if not chat_id_raw or not ids_str:
            return jsonify([])
        from models import Message
        chat_id_val = int(chat_id_raw)
        if not ChatParticipant.query.filter_by(user_id=session["user_id"], chat_id=chat_id_val).first():
            return jsonify([])
        ids = [int(x) for x in ids_str.split(",") if x.strip().isdigit()][:200]
        if not ids:
            return jsonify([])
        messages = Message.query.filter(Message.id.in_(ids), Message.chat_id == chat_id_val).all()
        curr_user = db.session.get(User, session["user_id"])
        crypto = EncryptionService()
        result = []
        for msg in messages:
            entry = {"id": msg.id, "is_deleted": msg.is_deleted, "is_edited": msg.is_edited or False}
            if msg.is_edited and not msg.is_deleted:
                entry["content"] = crypto.decrypt_for_user(msg.content, curr_user.private_key, msg.user_id != session["user_id"])
            result.append(entry)
        return jsonify(result)

    @app.route("/api/upload", methods=["POST"])
    def upload_file():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        from models.server import Settings
        settings = Settings.query.first()
        if settings and settings.premium_only_messaging:
            uploader = db.session.get(User, session["user_id"])
            if not (uploader and getattr(uploader, 'premium', False)):
                return jsonify({"error": "premium_required"}), 403

        chat_id = request.form.get("chat_id")
        target_user_id = request.form.get("target_user_id")
        caption = request.form.get("caption", "")
        upload_reply_to_id = request.form.get("reply_to_id")
        if not _can_forward(session["user_id"], request.form.get("forward_from")):
            return jsonify(error="Пересылка этого вложения недоступна"), 403
        upload_msg_type = request.form.get("msg_type", "text")

        if not chat_id and target_user_id:
            chat_data = chat_service.get_or_create_personal_chat(session["user_id"], int(target_user_id))
            chat_id = chat_data["chat_id"]

        if not chat_id:
            return jsonify({"error": "No chat"}), 400

        files = request.files.getlist("file")
        if not files:
            return jsonify({"error": "No file"}), 400

        last_result = None
        send_error = None
        for i, f in enumerate(files):
            file_data = FileService.save_file(f)
            if not file_data:
                continue
            cap = caption if i == 0 else ""
            result = chat_service.post_message(session["user_id"], int(chat_id), cap, file_data=file_data,
                                               reply_to_id=int(upload_reply_to_id) if upload_reply_to_id else None,
                                               msg_type=upload_msg_type if i == 0 else 'text')
            if "success" in result:
                result["chat_id"] = int(chat_id)
                result["file"] = file_data
                last_result = result
            else:
                send_error = result.get("error")
                try:
                    os.unlink(os.path.join(FileService.UPLOAD_DIR, urlsplit(file_data["url"]).path.rsplit("/", 1)[-1]))
                except OSError:
                    pass

        if last_result:
            sender = db.session.get(User, session["user_id"])
            if sender:
                avatar = sender.avatar or f"https://ui-avatars.com/api/?name={sender.login}&background=random&color=fff&rounded=true&bold=true"
                send_push_to_chat_members(int(chat_id), session["user_id"], sender.login, "📎 Файл", avatar)
            return jsonify(last_result), 200

        return jsonify(error=send_error or "Неподдерживаемый формат или файл больше 50 МБ. Для моделей подходят STL, STEP, STP, OBJ и 3MF."), 400

    @app.route("/api/users/search", methods=["GET"])
    def search_users_api():
        if "user_id" not in session:
            return jsonify([]), 401

        query = request.args.get("q", "")
        return jsonify(chat_service.search_users(query, session["user_id"]))

    @app.route("/api/chats/get_or_create", methods=["POST"])
    def get_or_create_chat():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        target_user_id = request.json.get("target_user_id")
        if not target_user_id:
            return jsonify({"error": "Missing target"}), 400

        result = chat_service.get_or_create_personal_chat(session["user_id"], target_user_id)
        return jsonify(result)

    @app.route("/api/chats", methods=["GET"])
    def get_chats_api():
        if "user_id" not in session:
            return jsonify({})
        uid = session["user_id"]
        limit = request.args.get("limit", 25, type=int)
        offset = request.args.get("offset", 0, type=int)
        from sqlalchemy import func
        from models import Message as _Msg
        chat_ids_q = [p.chat_id for p in ChatParticipant.query.filter_by(user_id=uid).with_entities(ChatParticipant.chat_id).all()]
        if chat_ids_q:
            max_msg_id = db.session.query(func.max(_Msg.id)).filter(_Msg.chat_id.in_(chat_ids_q)).scalar() or 0
            unread_total = db.session.query(func.count(_Msg.id)).filter(
                _Msg.chat_id.in_(chat_ids_q), _Msg.is_read == False, _Msg.user_id != uid
            ).scalar() or 0
            etag = f'"{max_msg_id}-{unread_total}-{offset}"'
        else:
            etag = '"empty"'
        if offset == 0 and request.headers.get('If-None-Match') == etag:
            return '', 304
        data = chat_service.get_user_chats(uid, limit=limit, offset=offset)
        resp = make_response(jsonify(data))
        if offset == 0:
            resp.headers['ETag'] = etag
        resp.headers['Cache-Control'] = 'no-cache'
        return resp

    @app.route("/api/chats/realtime")
    def poll_chat_events():
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        previous = request.args.get("seq", -1, type=int) if request.args.get("epoch") == epoch else -1
        sequence = wait_for_revision(user_id, previous)
        response = jsonify(epoch=epoch, seq=sequence)
        response.headers["Cache-Control"] = "no-store"
        return response

    try:
        from flask_sock import Sock
    except ImportError:
        Sock = None

    if Sock is not None:
        app.config.setdefault("SOCK_SERVER_OPTIONS", {"ping_interval": 25, "max_message_size": 256})
        sock = Sock(app)

        @sock.route("/api/chats/socket")
        def chat_socket(ws):
            user_id = session.get("user_id")
            origin = urlsplit(request.headers.get("Origin", ""))
            if not user_id or origin.scheme not in {"http", "https"} or origin.netloc != request.host:
                ws.close(reason=1008)
                return
            previous = -1
            while ws.connected:
                previous = wait_for_revision(user_id, previous)
                if ws.connected:
                    ws.send(json.dumps({"epoch": epoch, "seq": previous}))

    @app.route("/api/chats/poll")
    def poll_chats():
        if "user_id" not in session:
            return jsonify({"seq": 0, "changed": False}), 401
        uid = session["user_id"]
        client_seq = request.args.get("seq", -1, type=int)

        current_seq = wait_for_revision(uid, client_seq, timeout=25)

        changed = client_seq != current_seq
        if not changed:
            return jsonify({"seq": current_seq, "changed": False})

        from sqlalchemy import func
        from models import Message as _Msg
        chat_ids_q = [p.chat_id for p in ChatParticipant.query.filter_by(user_id=uid).with_entities(ChatParticipant.chat_id).all()]
        etag_val = '"empty"'
        if chat_ids_q:
            max_msg_id = db.session.query(func.max(_Msg.id)).filter(_Msg.chat_id.in_(chat_ids_q)).scalar() or 0
            unread_total = db.session.query(func.count(_Msg.id)).filter(
                _Msg.chat_id.in_(chat_ids_q), _Msg.is_read == False, _Msg.user_id != uid
            ).scalar() or 0
            etag_val = f'"{max_msg_id}-{unread_total}"'

        data = chat_service.get_user_chats(uid, limit=25, offset=0)
        resp = make_response(jsonify({"seq": current_seq, "changed": True, "data": data}))
        resp.headers['ETag'] = etag_val
        resp.headers['Cache-Control'] = 'no-cache'
        return resp

    @app.route("/api/agora/token")
    def get_agora_token():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        channel_name = request.args.get("channel")
        use_secondary = request.args.get("secondary") == "true"
        if not channel_name:
            return jsonify({"error": "Channel name required"}), 400

        agora_service = AgoraService()
        token = agora_service.generate_rtc_token(channel_name, session["user_id"], use_secondary=use_secondary)

        return jsonify({
            "token": token,
            "app_id": Config.AGORA_APP_ID,
            "uid": session["user_id"]
        })

    @app.route("/api/chats/<int:chat_id>/block/<int:target_user_id>", methods=["POST"])
    def block_user_in_chat(chat_id, target_user_id):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        result = chat_service.block_user(chat_id, session["user_id"], target_user_id)
        return jsonify(result), 200 if "success" in result else 403

    @app.route("/api/chats/<int:chat_id>/unblock/<int:target_user_id>", methods=["POST"])
    def unblock_user_in_chat(chat_id, target_user_id):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        result = chat_service.unblock_user(chat_id, session["user_id"], target_user_id)
        return jsonify(result), 200 if "success" in result else 403

    @app.route("/api/call/start", methods=["POST"])
    def start_call():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json or {}
        target_user_id = data.get("target_user_id")
        chat_id = data.get("chat_id")
        use_secondary = data.get("secondary") == True

        if not target_user_id or not chat_id:
            return jsonify({"error": "Missing fields"}), 400

        caller_participant = ChatParticipant.query.filter_by(user_id=session["user_id"], chat_id=int(chat_id)).first()
        if caller_participant and caller_participant.blocked:
            return jsonify({"error": "blocked"}), 403

        caller = db.session.get(User, session["user_id"])
        agora_service = AgoraService()

        channel_name = f"call_{uuid.uuid4().hex[:16]}"
        token = agora_service.generate_rtc_token(channel_name, session["user_id"], use_secondary=use_secondary)

        caller_avatar = caller.avatar if getattr(caller, 'avatar', None) else f"https://ui-avatars.com/api/?name={caller.fio}&background=random&color=fff&rounded=true&bold=true"

        call_url = f"/call?channel={channel_name}"
        if use_secondary:
            call_url += "&secondary=true"

        invite_message = f"__CALL_INVITE__{channel_name}|{caller.login}|{caller_avatar}"

        result = chat_service.post_message(session["user_id"], int(chat_id), invite_message)

        if "success" not in result:
            return jsonify({"error": "Failed to send invite"}), 500

        return jsonify({
            "channel": channel_name,
            "token": token,
            "call_url": call_url,
            "app_id": Config.AGORA_APP_ID
        })

    @app.route("/call")
    def call_page():
        if "user_id" not in session:
            return redirect(url_for("login"))
        user = db.session.get(User, session["user_id"])
        return render_template("call.html", current_user=user)

    @app.route("/api/chats/group", methods=["POST"])
    def create_group_api():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json or {}
        name = data.get("name")
        participants = data.get("participants", [])
        chat_type = data.get("chat_type", "group")

        if not isinstance(name, str) or not 1 <= len(name.strip()) <= 150:
            return jsonify(error="Введите название от 1 до 150 символов.", field="name"), 400

        description = data.get("description", "")
        if not isinstance(description, str) or len(description.strip()) > 250:
            return jsonify(error="Сократите описание до 250 символов.", field="description"), 400
        if not isinstance(participants, list) or len(participants) > 100 or any(type(user_id) is not int for user_id in participants):
            return jsonify(error="Некорректный список участников"), 400
        result = chat_service.create_group_chat(session["user_id"], str(name).strip(), participants, chat_type=chat_type, description=description.strip())
        return jsonify(result), 200 if "success" in result else 400

    @app.route("/api/chats/invite", methods=["POST"])
    def invite_to_group_api():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json or {}
        chat_id = data.get("chat_id")
        participants = data.get("participants", [])

        if not chat_id or not participants:
            return jsonify({"error": "Missing data"}), 400

        inviter_participant = ChatParticipant.query.filter_by(user_id=session["user_id"], chat_id=int(chat_id)).first()
        if inviter_participant and inviter_participant.blocked:
            return jsonify({"error": "blocked"}), 403

        result = chat_service.invite_to_chat(chat_id, session["user_id"], participants)
        return jsonify(result), 200 if "success" in result else 400

    @app.route("/api/chats/<int:chat_id>/info", methods=["GET"])
    def get_chat_info_api(chat_id):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        user_id = session["user_id"]
        membership = ChatParticipant.query.filter_by(chat_id=chat_id, user_id=user_id, blocked=False).first()
        if not membership:
            return jsonify(error="Чат недоступен"), 404
        result = chat_service.get_chat_info(chat_id)
        if "success" in result:
            chat = db.session.get(Chat, chat_id)
            result.update({key: value for key, value in chat_fields(chat).items() if key != "avatar" or value})
            result["current_user_id"] = user_id
            result["permissions"] = member_rights(chat, membership)
            if "invite" in result["permissions"]:
                result["invite_token"] = chat.invite_token
        return jsonify(result), 200 if "success" in result else 404

    @app.route("/api/chats/join", methods=["POST"])
    def join_chat_api():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json or {}
        chat_id = data.get("chat_id")

        if not chat_id:
            return jsonify({"error": "Укажите chat_id"}), 400

        try:
            chat_id = int(chat_id)
        except (TypeError, ValueError):
            return jsonify(error="Некорректный чат"), 400
        result = join_managed_chat(chat_id, session["user_id"], data.get("token"))
        return jsonify(result), 200 if "success" in result else 400

    @app.route("/api/chats/<int:chat_id>/leave", methods=["POST"])
    def leave_chat(chat_id):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error": "Unauthorized"}), 401
        chat = db.session.get(Chat, chat_id)
        if not chat or chat.personal:
            return jsonify({"error": "Группа или канал не найдены"}), 404
        membership = ChatParticipant.query.filter_by(chat_id=chat_id, user_id=user_id).first()
        if not membership:
            return jsonify({"success": True})
        if chat.owner_id == user_id:
            successor = (ChatParticipant.query.filter(ChatParticipant.chat_id == chat_id,
                         ChatParticipant.user_id != user_id, ChatParticipant.blocked.is_(False))
                         .order_by(ChatParticipant.id).first())
            chat.owner_id = successor.user_id if successor else None
            if successor:
                successor.role = "owner"
        db.session.delete(membership)
        db.session.commit()
        notify_user(user_id)
        notify_chat_users(chat_id)
        return jsonify({"success": True})

    @app.route("/api/chats/<int:chat_id>", methods=["DELETE"])
    def delete_chat_api(chat_id):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        result = chat_service.delete_chat(chat_id, session["user_id"], for_both=request.args.get("scope") == "both")
        return jsonify(result), 200 if "success" in result else 403

    @app.put("/api/user/privacy")
    def update_privacy():
        user_id = session.get("user_id")
        user = db.session.get(User, user_id) if user_id else None
        if not user:
            return jsonify(error="Требуется вход"), 401
        payload = request.get_json(silent=True) or {}
        fields = ("show_bio", "show_last_seen")
        if not isinstance(payload, dict) or any(type(value) is not bool or field not in fields for field, value in payload.items()):
            return jsonify(error="Некорректные настройки приватности"), 400
        for field, value in payload.items():
            setattr(user, field, value)
        db.session.commit()
        return jsonify(show_bio=user.show_bio is not False, show_last_seen=user.show_last_seen is not False)

    @app.route("/api/user/profile", methods=["POST"])
    def update_user_profile():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        user = db.session.get(User, session["user_id"])
        if not user:
            return jsonify({"error": "Not found"}), 404

        data = request.json or {}
        changed = False
        original_login = user.login
        old_avatar = user.avatar
        new_avatar_path = None

        if "fio" in data:
            fio = data["fio"]
            if not isinstance(fio, str):
                return jsonify(error="Введите имя.", field="fio"), 400
            fio = re.sub(r"<[^>]*>", "", fio).strip()
            if not fio or len(fio) > 120:
                return jsonify(error="Имя и фамилия вместе должны содержать от 1 до 120 символов.", field="fio"), 400
            user.fio = fio
            changed = True

        if "login" in data:
            from sqlalchemy import func
            login = data["login"]
            if not isinstance(login, str) or not re.fullmatch(r"[A-Za-z0-9_]{3,50}", login):
                return jsonify(error="Введите от 3 до 50 символов. Подойдут латинские буквы, цифры и подчёркивания.", field="login"), 400
            login = login.lower() if login != user.login else user.login
            if login != user.login and User.query.filter(func.lower(User.login) == login.lower(), User.id != user.id).first():
                return jsonify(error="Это имя уже занято. Выберите другое.", field="login"), 409
            user.login = login
            changed = True

        if "bio" in data:
            bio = str(data["bio"]).strip()[:200]
            try:
                from utils.profanity import check_profanity
                hit = check_profanity(bio)
            except Exception:
                hit = None
            if hit and hit["level"] >= 2:
                return jsonify(error="Измените описание: в нём есть недопустимые слова.", field="bio"), 400
            user.bio = bio
            changed = True

        if "avatar" in data:
            avatar_data = data["avatar"]
            if avatar_data and isinstance(avatar_data, str):
                if avatar_data.startswith("data:image/") or avatar_data.startswith("data:video/"):
                    try:
                        import base64 as _b64
                        header, b64body = avatar_data.split(",", 1)
                        mime = header.split(":")[1].split(";")[0]
                        ext_map = {
                            "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif",
                            "image/webp": "webp", "video/mp4": "mp4", "video/webm": "webm"
                        }
                        ext = ext_map.get(mime, "jpg")
                        raw = _b64.b64decode(b64body, validate=True)
                        if not raw or len(raw) > 10 * 1024 * 1024:
                            return jsonify(error="Выберите файл размером до 10 МБ.", field="avatar"), 400
                        safe_name = f"{uuid.uuid4().hex}.{ext}"
                        os.makedirs(FileService.UPLOAD_DIR, exist_ok=True)
                        new_avatar_path = os.path.join(FileService.UPLOAD_DIR, safe_name)
                        with open(new_avatar_path, "wb") as fout:
                            fout.write(raw)
                        user.avatar = f"/api/files/{safe_name}?sig={FileService.sign_filename(safe_name)}"
                        changed = True
                    except ValueError:
                        return jsonify(error="Не удалось прочитать фото. Выберите другой файл.", field="avatar"), 400
                    except OSError:
                        return jsonify(error="Не удалось сохранить фото. Попробуйте позже.", field="avatar"), 500
                elif avatar_data.startswith("http") or avatar_data.startswith("/"):
                    user.avatar = avatar_data
                    changed = True

        if changed:
            from sqlalchemy.exc import IntegrityError
            try:
                if "login" in data and not PublicHandle.query.filter_by(kind="user", owner_id=user.id).first():
                    reserve_handle("user", user.id, user.login)
                elif "login" in data and login != original_login:
                    reserve_handle("user", user.id, user.login)
                db.session.commit()
            except (IntegrityError, ValueError):
                db.session.rollback()
                if new_avatar_path:
                    try:
                        os.remove(new_avatar_path)
                    except OSError:
                        pass
                return jsonify(error="Это имя уже занято. Выберите другое.", field="login"), 409
            if new_avatar_path and old_avatar:
                old_name = re.fullmatch(r"/api/files/([a-f0-9]{32}\.[a-z0-9]{1,10})\?sig=[a-f0-9]+", old_avatar)
                if old_name:
                    try:
                        os.remove(os.path.join(FileService.UPLOAD_DIR, old_name[1]))
                    except OSError:
                        pass

        avatar_url = user.avatar if user.avatar else f"https://ui-avatars.com/api/?name={user.login}&background=random&color=fff&rounded=true&bold=true"
        return jsonify({"success": True, "avatar": avatar_url, "bio": user.bio or "", "fio": user.fio, "login": user.login,
                        "handle": public_name(user)})

    @app.route("/api/push/vapid-key", methods=["GET"])
    def push_vapid_key():
        return jsonify({"publicKey": Config.VAPID_PUBLIC_KEY, "available": bool(_WEBPUSH_OK and Config.VAPID_PRIVATE_KEY)})

    @app.route("/api/push/subscribe", methods=["POST"])
    def push_subscribe():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        from models.push import PushSubscription
        data = request.json or {}
        endpoint = data.get("endpoint")
        keys = data.get("keys") or {}
        p256dh = keys.get("p256dh")
        auth = keys.get("auth")
        if not endpoint or not p256dh or not auth:
            return jsonify({"error": "Invalid subscription"}), 400
        raw_settings = data.get("settings")
        settings = {}
        if isinstance(raw_settings, dict):
            for field in ("kinds", "previews", "overrides"):
                values = raw_settings.get(field)
                if isinstance(values, dict):
                    settings[field] = {key: value for key, value in list(values.items())[:500]
                                       if type(value) is bool and (key.isdecimal() if field == "overrides"
                                                                  else key in ("personal", "group", "channel"))}
        if not isinstance(endpoint, str) or len(endpoint) > 2048:
            return jsonify(error="Некорректный адрес push-подписки"), 400
        try:
            host = urlsplit(endpoint)
            domain = host.hostname or ""
            permitted = domain in ("fcm.googleapis.com", "updates.push.services.mozilla.com", "web.push.apple.com") or domain.endswith(".notify.windows.com")
            if host.scheme != "https" or not permitted or host.username or host.password or host.port not in (None, 443):
                return jsonify(error="Провайдер уведомлений не поддерживается"), 400
        except ValueError:
            return jsonify(error="Некорректный адрес push-подписки"), 400
        existing = PushSubscription.query.filter_by(user_id=session["user_id"], endpoint=endpoint).first()
        if existing:
            existing.p256dh = p256dh
            existing.auth = auth
            if raw_settings is not None:
                existing.settings = json.dumps(settings)
        else:
            sub = PushSubscription(user_id=session["user_id"], endpoint=endpoint, p256dh=p256dh, auth=auth, settings=json.dumps(settings))
            db.session.add(sub)
        db.session.commit()
        return jsonify({"ok": True})

    @app.route("/api/user/premium-inbox", methods=["POST"])
    def toggle_premium_inbox():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        user = db.session.get(User, session["user_id"])
        if not user:
            return jsonify({"error": "Not found"}), 404
        if not getattr(user, 'premium', False):
            return jsonify({"error": "Требуется Premium"}), 403
        data = request.json or {}
        user.premium_only_inbox = bool(data.get("enabled", False))
        db.session.commit()
        return jsonify({"success": True, "premium_only_inbox": user.premium_only_inbox})

    @app.route("/api/server/settings", methods=["GET"])
    def get_server_settings():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401
        from models.server import Settings
        s = Settings.query.first()
        return jsonify({"premium_only_messaging": s.premium_only_messaging if s else False})

    @app.route("/api/push/unsubscribe", methods=["POST"])
    def push_unsubscribe():
        if "user_id" not in session:
            return jsonify({"ok": True})
        from models.push import PushSubscription
        data = request.json or {}
        endpoint = data.get("endpoint")
        if endpoint:
            PushSubscription.query.filter_by(user_id=session["user_id"], endpoint=endpoint).delete()
            db.session.commit()
        return jsonify({"ok": True})
