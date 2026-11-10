import time
import json
from datetime import datetime

from flask import jsonify, request
from sqlalchemy import or_

from models import Chat, ChatParticipant, Message, User, db


def _json_message(message):
    from chat.services import ChatService
    return {
        "message_id": message.id,
        "date": int((message.timestamp or datetime.utcnow()).timestamp()),
        "chat": {"id": message.chat_id, "type": "private" if message.chat.personal else message.chat.chat_type or "group", "title": message.chat.name or ""},
        "from": {"id": message.user_id, "is_bot": bool(getattr(message.author, "is_bot", False)), "username": message.author.login, "first_name": message.author.fio},
        "text": "" if message.is_deleted else ChatService().crypto.decrypt_for_user(message.content, message.author.private_key, False) if message.content else "",
        "edit_date": int(message.timestamp.timestamp()) if message.is_edited and message.timestamp else None,
        "reply_to_message": _json_message(message.reply_to) if message.reply_to else None,
        "reply_markup": json.loads(message.reply_markup) if getattr(message, "reply_markup", None) else None,
    }


class TornBotAPI:
    """Telegram Bot API shaped interface backed by Tornado chats."""

    @staticmethod
    def handle(token, method, data):
        from chat.services import ChatService

        bot = BotToken.query.filter_by(token=token, active=True).first()
        if not bot:
            return {"ok": False, "error_code": 401, "description": "Unauthorized"}, 401
        owner = db.session.get(User, bot.user_id)
        if not owner:
            return {"ok": False, "error_code": 401, "description": "Unauthorized"}, 401
        if method == "getMe":
            return {"ok": True, "result": {"id": owner.id, "is_bot": True, "first_name": owner.fio, "username": owner.login}}
        if method in ("getUser", "getChatMember"):
            chat_id = int(data.get("chat_id", 0) or 0)
            user_id = int(data.get("user_id", 0) or 0)
            if method == "getUser":
                shared_chat_ids = [row.chat_id for row in ChatParticipant.query.filter_by(user_id=owner.id).all()]
                member = ChatParticipant.query.filter(ChatParticipant.user_id == user_id, ChatParticipant.chat_id.in_(shared_chat_ids)).first()
            else:
                if not ChatParticipant.query.filter_by(user_id=owner.id, chat_id=chat_id).first():
                    return {"ok": False, "error_code": 400, "description": "bot is not a member of this chat"}, 400
                member = ChatParticipant.query.filter_by(user_id=user_id, chat_id=chat_id).first()
            if not member:
                return {"ok": False, "error_code": 400, "description": "user not found in bot chats"}, 400
            user = member.user
            result = {"id": user.id, "is_bot": bool(user.is_bot), "first_name": user.fio, "username": user.login}
            if method == "getChatMember":
                result = {"user": result, "status": member.role or "member", "is_blocked": bool(member.blocked)}
            return {"ok": True, "result": result}
        if method in ("getMyName", "setMyName", "getMyDescription", "setMyDescription", "setMyProfilePhoto"):
            if method == "getMyName":
                return {"ok": True, "result": {"name": owner.fio}}
            if method == "setMyName":
                name = str(data.get("name", "")).strip()
                if not name or len(name) > 150:
                    return {"ok": False, "error_code": 400, "description": "name must contain 1–150 characters"}, 400
                owner.fio = name
            elif method == "getMyDescription":
                return {"ok": True, "result": {"description": owner.bio or ""}}
            elif method == "setMyDescription":
                description = str(data.get("description", ""))
                if len(description) > 200:
                    return {"ok": False, "error_code": 400, "description": "description is too long"}, 400
                owner.bio = description
            else:
                photo_url = str(data.get("photo_url", "")).strip()
                if not (photo_url.startswith("https://") or photo_url.startswith("/static/")):
                    return {"ok": False, "error_code": 400, "description": "photo_url must be HTTPS or a /static/ path"}, 400
                owner.avatar = photo_url
            db.session.commit()
            return {"ok": True, "result": True}
        if method == "getUpdates":
            offset = int(data.get("offset", 0) or 0)
            timeout = min(int(data.get("timeout", 0) or 0), 25)
            deadline = time.time() + timeout
            while True:
                q = Message.query.join(ChatParticipant, ChatParticipant.chat_id == Message.chat_id).filter(
                    ChatParticipant.user_id == owner.id, Message.user_id != owner.id, Message.id >= offset
                ).order_by(Message.id).limit(min(int(data.get("limit", 100) or 100), 100))
                rows = q.all()
                if rows or time.time() >= deadline:
                    updates = []
                    for row in rows:
                        if row.msg_type == "bot_callback":
                            callback_text = ChatService().crypto.decrypt_for_user(row.content, owner.private_key, False)
                            updates.append({"update_id": row.id, "callback_query": {
                                "id": str(row.id),
                                "from": {"id": row.author.id, "is_bot": False, "username": row.author.login, "first_name": row.author.fio},
                                "message": _json_message(row.reply_to),
                                "data": callback_text,
                            }})
                        else:
                            updates.append({"update_id": row.id, "message": _json_message(row)})
                    return {"ok": True, "result": updates}
                time.sleep(0.5)
        chat_id = int(data.get("chat_id", 0) or 0)
        participant = ChatParticipant.query.filter_by(chat_id=chat_id, user_id=owner.id).first()
        if method == "sendMessage":
            if not participant:
                return {"ok": False, "error_code": 400, "description": "bot is not a member of this chat"}, 400
            text = str(data.get("text", ""))
            if not text:
                return {"ok": False, "error_code": 400, "description": "text is required"}, 400
            reply_markup = data.get("reply_markup")
            if reply_markup is not None and not isinstance(reply_markup, dict):
                return {"ok": False, "error_code": 400, "description": "reply_markup must be an object"}, 400
            sent = ChatService().post_message(owner.id, chat_id, text, reply_to_id=data.get("reply_to_message_id"), reply_markup=reply_markup)
            if "error" in sent:
                return {"ok": False, "error_code": 400, "description": str(sent["error"])}, 400
            msg = db.session.get(Message, sent["ids"][0])
            return {"ok": True, "result": _json_message(msg)}
        message_id = int(data.get("message_id", 0) or 0)
        msg = db.session.get(Message, message_id)
        if method in ("editMessageText", "editMessageCaption"):
            result = ChatService().edit_message(owner.id, message_id, data.get("text", data.get("caption", "")))
            if "success" not in result:
                return {"ok": False, "error_code": 400, "description": str(result.get("error", "edit failed"))}, 400
            db.session.refresh(msg)
            if "reply_markup" in data:
                msg.reply_markup = json.dumps(data["reply_markup"], ensure_ascii=False) if data["reply_markup"] else None
                db.session.commit()
            return {"ok": True, "result": _json_message(msg)}
        if method == "editMessageReplyMarkup":
            if not msg:
                return {"ok": False, "error_code": 400, "description": "message not found"}, 400
            if msg.user_id != owner.id:
                return {"ok": False, "error_code": 400, "description": "bots can only edit their own messages"}, 400
            markup = data.get("reply_markup")
            if markup is not None and not isinstance(markup, dict):
                return {"ok": False, "error_code": 400, "description": "reply_markup must be an object"}, 400
            msg.reply_markup = json.dumps(markup, ensure_ascii=False) if markup else None
            msg.is_edited = True
            db.session.commit()
            return {"ok": True, "result": _json_message(msg)}
        if method == "deleteMessage":
            result = ChatService().delete_message(owner.id, message_id)
            return ({"ok": True, "result": True} if "success" in result else {"ok": False, "error_code": 400, "description": result.get("error", "delete failed")}, 200 if "success" in result else 400)
        if method == "getChat":
            chat = db.session.get(Chat, chat_id)
            if not chat or not participant:
                return {"ok": False, "error_code": 400, "description": "chat not found"}, 400
            return {"ok": True, "result": {"id": chat.id, "type": "private" if chat.personal else chat.chat_type or "group", "title": chat.name or ""}}
        if method == "answerCallbackQuery":
            return {"ok": True, "result": True}
        if method == "sendChatAction":
            return {"ok": True, "result": True}
        if method == "setMyCommands":
            return {"ok": True, "result": True}
        if method == "getMyCommands":
            return {"ok": True, "result": []}
        if method == "getFile":
            return {"ok": False, "error_code": 404, "description": "file_id was not found"}, 404
        return {"ok": False, "error_code": 404, "description": "method not implemented"}, 404


from models.bot import BotToken
