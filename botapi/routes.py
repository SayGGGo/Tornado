from flask import request, jsonify, session
from config import logger
from .handlers import TornBotAPI
from chat.services import ChatService
from models import BotToken, Chat, ChatParticipant, Message, User, db
import json
import re
import secrets
from werkzeug.security import generate_password_hash


def register_bot_api(app):
    @app.route('/api/bots', methods=['GET', 'POST'])
    def manage_bots():
        owner_id = session.get("user_id")
        if not owner_id:
            return jsonify({"ok": False, "description": "authentication required"}), 401
        if request.method == "GET":
            tokens = BotToken.query.filter_by(owner_id=owner_id).all()
            items = []
            for item in tokens:
                user = item.user
                dm = Chat.query.join(ChatParticipant, ChatParticipant.chat_id == Chat.id).filter(
                    Chat.personal.is_(True), ChatParticipant.user_id == owner_id,
                    Chat.id.in_([p.chat_id for p in ChatParticipant.query.filter_by(user_id=user.id).all()])
                ).first()
                items.append({"id": item.id, "user_id": user.id, "name": user.fio, "username": user.login,
                              "avatar": user.avatar or "", "active": bool(item.active), "token_hint": item.token[-6:],
                              "chat_id": dm.id if dm else None})
            return jsonify({"ok": True, "result": items})
        data = request.get_json(silent=True) or {}
        name = str(data.get("name", "")).strip()
        if not name or len(name) > 150:
            return jsonify({"ok": False, "description": "Имя бота должно содержать от 1 до 150 символов"}), 400
        base = re.sub(r"[^a-z0-9_]", "_", str(data.get("username", name)).lower()).strip("_")[:40] or "bot"
        login = "bot_" + base
        suffix = 2
        while User.query.filter_by(login=login).first():
            login = f"bot_{base[:35]}_{suffix}"
            suffix += 1
        from chat.services import EncryptionService
        private_key, public_key = EncryptionService.generate_keys()
        bot_user = User(fio=name, login=login, password_hash=generate_password_hash(secrets.token_urlsafe(32)),
                        group_id="", private_key=private_key, public_key=public_key, is_bot=True)
        db.session.add(bot_user)
        db.session.flush()
        token = BotToken(user_id=bot_user.id, owner_id=owner_id, token="torn-" + secrets.token_urlsafe(32), active=True)
        db.session.add(token)
        dm = Chat(personal=True, owner_id=owner_id, chat_type="personal")
        db.session.add(dm)
        db.session.flush()
        db.session.add_all([
            ChatParticipant(user_id=owner_id, chat_id=dm.id, role="member"),
            ChatParticipant(user_id=bot_user.id, chat_id=dm.id, role="member"),
        ])
        db.session.commit()
        return jsonify({"ok": True, "result": {"id": token.id, "user_id": bot_user.id, "name": name,
                        "username": login, "active": True, "chat_id": dm.id, "token": token.token}}), 201

    @app.route('/api/bots/<int:bot_id>', methods=['PATCH', 'DELETE'])
    def update_bot(bot_id):
        owner_id = session.get("user_id")
        item = BotToken.query.filter_by(id=bot_id, owner_id=owner_id).first() if owner_id else None
        if not item:
            return jsonify({"ok": False, "description": "bot not found"}), 404
        if request.method == "DELETE":
            item.active = False
            db.session.commit()
            return jsonify({"ok": True, "result": True})
        data = request.get_json(silent=True) or {}
        user = item.user
        if "name" in data:
            name = str(data.get("name", "")).strip()
            if not name or len(name) > 150:
                return jsonify({"ok": False, "description": "invalid bot name"}), 400
            user.fio = name
        if "avatar" in data:
            avatar = str(data.get("avatar", "")).strip()
            if avatar and not (avatar.startswith("https://") or avatar.startswith("/static/")):
                return jsonify({"ok": False, "description": "avatar must be HTTPS or a /static/ path"}), 400
            user.avatar = avatar or None
        db.session.commit()
        return jsonify({"ok": True, "result": {"id": item.id, "name": user.fio, "avatar": user.avatar or ""}})

    @app.route('/api/bots/<int:bot_id>/token', methods=['POST'])
    def rotate_bot_token(bot_id):
        owner_id = session.get("user_id")
        item = BotToken.query.filter_by(id=bot_id, owner_id=owner_id).first() if owner_id else None
        if not item:
            return jsonify({"ok": False, "description": "bot not found"}), 404
        item.token = "torn-" + secrets.token_urlsafe(32)
        item.active = True
        db.session.commit()
        return jsonify({"ok": True, "result": {"token": item.token}})

    @app.route('/api/bot/callback', methods=['POST'])
    def bot_callback():
        user_id = session.get("user_id")
        data = request.get_json(silent=True) or {}
        try:
            chat_id = int(data.get("chat_id", 0))
            message_id = int(data.get("message_id", 0))
        except (TypeError, ValueError):
            return jsonify({"ok": False, "description": "invalid callback target"}), 400
        message = db.session.get(Message, message_id)
        if not user_id or not message or message.chat_id != chat_id or message.is_deleted:
            return jsonify({"ok": False, "description": "callback target not found"}), 404
        if not ChatParticipant.query.filter_by(user_id=user_id, chat_id=chat_id).first():
            return jsonify({"ok": False, "description": "not a chat participant"}), 403
        if not message.reply_markup or not message.author.is_bot or message.user_id == user_id:
            return jsonify({"ok": False, "description": "callback is unavailable"}), 400
        try:
            markup = json.loads(message.reply_markup)
            values = {str(button.get("callback_data")) for row in markup.get("inline_keyboard", []) for button in row if button.get("callback_data") is not None}
        except (TypeError, ValueError, AttributeError):
            values = set()
        callback_data = str(data.get("data", ""))
        if callback_data not in values:
            return jsonify({"ok": False, "description": "unknown callback data"}), 400
        result = ChatService().post_message(user_id, chat_id, callback_data, reply_to_id=message_id, msg_type="bot_callback")
        if "error" in result:
            return jsonify({"ok": False, "description": str(result["error"])}), 400
        return jsonify({"ok": True})

    @app.route('/api/bot<token>/<method>', methods=['GET', 'POST'])
    def bot_api_endpoint(token, method):
        data = request.get_json(silent=True) or request.values.to_dict()
        try:
            result = TornBotAPI.handle(token, method, data)
            if isinstance(result, tuple):
                payload, status = result
                return jsonify(payload), status
            return jsonify(result), 200
        except Exception:
            logger.exception("[TORNBOT] Request failed")
            return jsonify({"ok": False, "error_code": 500, "description": "Internal server error"}), 500
