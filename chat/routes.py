import os
import re
from flask import render_template, jsonify, session, request, redirect, url_for, send_from_directory, abort
from models import db, User
from .services import ChatService, AgoraService, FileService, EncryptionService, flood_control
from config import Config
import uuid

def register_chat(app):
    chat_service = ChatService()

    @app.route("/chat")
    def chat():
        if "user_id" not in session:
            return redirect(url_for("login"))

        user = db.session.get(User, session["user_id"])
        if not user:
            session.pop("user_id", None)
            return redirect(url_for("login"))

        folders = [{"name": "Все", "count": 0, "active": True}]
        msg_data = chat_service.get_user_chats(user.id)

        return render_template("chat.html", current_user=user, msg_data=msg_data, folders=folders)

    @app.route("/api/user/<int:target_user_id>", methods=["GET"])
    def get_user_info(target_user_id):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        user = db.session.get(User, target_user_id)
        if not user:
            return jsonify({"error": "Not found"}), 404

        avatar = user.avatar if getattr(user, 'avatar', None) else f"https://ui-avatars.com/api/?name={user.login}&background=random&color=fff&rounded=true&bold=true"
        return jsonify({
            "id": user.id,
            "login": user.login,
            "avatar": avatar,
            "bio": user.bio or ""
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

        return jsonify(chat_service.get_recent_messages(session["user_id"], int(chat_id), last_id, first_id))

    @app.route("/api/messages", methods=["POST"])
    def send_message():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json or {}
        chat_id = data.get("chat_id")
        target_user_id = data.get("target_user_id")

        if not chat_id and target_user_id:
            chat_data = chat_service.get_or_create_personal_chat(session["user_id"], target_user_id)
            chat_id = chat_data["chat_id"]

        result = chat_service.post_message(session["user_id"], chat_id, data.get("content"))
        if "success" in result:
            result["chat_id"] = chat_id

        return jsonify(result), 200 if "success" in result else 429 if "Слишком" in result.get("error", "") else 400

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
        fpath = os.path.join(FileService.UPLOAD_DIR, safe)
        if not os.path.isfile(fpath):
            abort(404)

        resp = send_from_directory(FileService.UPLOAD_DIR, safe)
        resp.headers['Cache-Control'] = 'private, max-age=86400'
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

        from models import ChatParticipant, Message
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

        chat_id = request.form.get("chat_id")
        target_user_id = request.form.get("target_user_id")
        caption = request.form.get("caption", "")

        if not chat_id and target_user_id:
            chat_data = chat_service.get_or_create_personal_chat(session["user_id"], int(target_user_id))
            chat_id = chat_data["chat_id"]

        if not chat_id:
            return jsonify({"error": "No chat"}), 400

        files = request.files.getlist("file")
        if not files:
            return jsonify({"error": "No file"}), 400

        last_result = None
        for i, f in enumerate(files):
            file_data = FileService.save_file(f)
            if not file_data:
                continue
            cap = caption if i == 0 else ""
            result = chat_service.post_message(session["user_id"], int(chat_id), cap, file_data=file_data)
            if "success" in result:
                result["chat_id"] = int(chat_id)
                result["file"] = file_data
                last_result = result

        if last_result:
            return jsonify(last_result), 200

        return jsonify({"error": "Неверный формат файла или превышен лимит 50 МБ"}), 400

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
        return jsonify(chat_service.get_user_chats(session["user_id"]))

    @app.route("/api/agora/token")
    def get_agora_token():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        channel_name = request.args.get("channel")
        if not channel_name:
            return jsonify({"error": "Channel name required"}), 400

        agora_service = AgoraService()
        token = agora_service.generate_rtc_token(channel_name, session["user_id"])

        return jsonify({
            "token": token,
            "app_id": Config.AGORA_APP_ID,
            "uid": session["user_id"]
        })

    @app.route("/api/call/start", methods=["POST"])
    def start_call():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json or {}
        target_user_id = data.get("target_user_id")
        chat_id = data.get("chat_id")

        if not target_user_id or not chat_id:
            return jsonify({"error": "Missing fields"}), 400

        caller = db.session.get(User, session["user_id"])
        agora_service = AgoraService()

        channel_name = f"call_{uuid.uuid4().hex[:16]}"
        token = agora_service.generate_rtc_token(channel_name, session["user_id"])

        caller_avatar = caller.avatar if getattr(caller, 'avatar', None) else f"https://ui-avatars.com/api/?name={caller.fio}&background=random&color=fff&rounded=true&bold=true"

        call_url = f"/call?channel={channel_name}"
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

        if not name or not str(name).strip():
            return jsonify({"error": "Необходимо имя"}), 400

        result = chat_service.create_group_chat(session["user_id"], str(name).strip(), participants)
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

        result = chat_service.invite_to_chat(chat_id, session["user_id"], participants)
        return jsonify(result), 200 if "success" in result else 400

    @app.route("/api/chats/<int:chat_id>/info", methods=["GET"])
    def get_chat_info_api(chat_id):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        result = chat_service.get_chat_info(chat_id)
        return jsonify(result), 200 if "success" in result else 404

    @app.route("/api/chats/join", methods=["POST"])
    def join_chat_api():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json or {}
        chat_id = data.get("chat_id")

        if not chat_id:
            return jsonify({"error": "Укажите chat_id"}), 400

        result = chat_service.join_chat(int(chat_id), session["user_id"])
        return jsonify(result), 200 if "success" in result else 400

    @app.route("/api/chats/<int:chat_id>", methods=["DELETE"])
    def delete_chat_api(chat_id):
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        result = chat_service.delete_chat(chat_id, session["user_id"])
        return jsonify(result), 200 if "success" in result else 403
