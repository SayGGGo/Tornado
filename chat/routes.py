from flask import render_template, jsonify, session, request, redirect, url_for
from models import db, User
from .services import ChatService, AgoraService
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
            "avatar": avatar
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

        return jsonify(result), 200 if "success" in result else 400

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