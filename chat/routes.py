from flask import render_template, jsonify, session, request, redirect, url_for
from models import db, User
from .services import ChatService


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
        msg_data = {
            "1": {"name": "LuckyTools AI", "avatar": "https://i.ibb.co/dsKqPRtX/ltlogo.png", "active": False,
                  "last_msg": "Нейросеть от LuckyTools", "last_time": "", "last_status": False, "unread": 0,
                  "pinned": False, "muted": False, "tags": [], "premium": "1"},
            "2": {"name": "Tornado", "avatar": "https://i.ibb.co/XZ3kSFyf/tlogo.png", "active": False,
                  "last_msg": "Служебные сообщения", "last_time": "", "last_status": False, "unread": 0,
                  "pinned": False, "muted": False, "premium": "1"},
            "3": {"name": "Test", "avatar": "https://cdn.worldvectorlogo.com/logos/telegram-1.svg", "active": False,
                  "last_msg": "/start", "last_time": "17:21", "last_status": True, "unread": 0, "pinned": False,
                  "muted": False, "premium": "0"}
        }
        return render_template("chat.html", current_user=user, msg_data=msg_data, folders=folders)

    @app.route("/api/messages", methods=["GET"])
    def get_messages():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        last_id = request.args.get("last_id", 0, type=int)
        return jsonify(chat_service.get_recent_messages(last_id))

    @app.route("/api/messages", methods=["POST"])
    def send_message():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json or {}
        result = chat_service.post_message(session["user_id"], data.get("content"))
        if "error" in result:
            return jsonify(result), 400
        return jsonify(result)