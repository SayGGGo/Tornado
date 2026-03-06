from flask import render_template, jsonify, session, request, redirect, url_for
from markupsafe import escape
from models import Message, db, User


def register_chat(app):
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
            "1": {
                "name": "LuckyTools AI",
                "avatar": "https://i.ibb.co/dsKqPRtX/ltlogo.png",
                "active": False,
                "last_msg": "Нейросеть от LuckyTools",
                "last_time": "",
                "last_status": False,
                "unread": 0,
                "pinned": False,
                "muted": False,
                "tags": [],
                "premium": "1"
            },
            "2": {
                "name": "Tornado",
                "avatar": "https://i.ibb.co/XZ3kSFyf/tlogo.png",
                "active": False,
                "last_msg": "Служебные сообщения",
                "last_time": "",
                "last_status": False,
                "unread": 0,
                "pinned": False,
                "muted": False,
                "premium": "1"
            },
            "3": {
                "name": "Test",
                "avatar": "https://cdn.worldvectorlogo.com/logos/telegram-1.svg",
                "active": False,
                "last_msg": "/start",
                "last_time": "17:21",
                "last_status": True,
                "unread": 0,
                "pinned": False,
                "muted": False,
                "premium": "0"
            }}
        return render_template("chat.html", current_user=user, msg_data=msg_data, folders=folders)

    @app.route("/api/messages", methods=["GET"])
    def get_messages():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        last_id = request.args.get("last_id", 0, type=int)
        messages = Message.query.filter(Message.id > last_id).order_by(Message.id.asc()).limit(50).all()

        result = [{
            "id": msg.id,
            "user_id": msg.user_id,
            "login": msg.user.login,
            "content": msg.content,
            "timestamp": msg.timestamp.strftime("%H:%M")
        } for msg in messages]

        return jsonify(result)

    @app.route("/api/messages", methods=["POST"])
    def send_message():
        if "user_id" not in session:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json
        if not data:
            return jsonify({"error": "Empty request"}), 400

        raw_content = data.get("content", "").strip()

        if not raw_content:
            return jsonify({"error": "Empty message"}), 400

        safe_content = escape(raw_content)

        new_msg = Message(user_id=session["user_id"], content=safe_content)
        db.session.add(new_msg)
        db.session.commit()

        return jsonify({"success": True, "id": new_msg.id})