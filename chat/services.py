from markupsafe import escape
from models import Message, db, User

class ChatService:
    def get_recent_messages(self, last_id=0):
        messages = Message.query.filter(Message.id > last_id).order_by(Message.id.asc()).limit(50).all()
        return [{
            "id": msg.id,
            "user_id": msg.user_id,
            "login": msg.user.login,
            "content": msg.content,
            "timestamp": msg.timestamp.strftime("%H:%M")
        } for msg in messages]

    def post_message(self, user_id, content):
        if not content:
            return {"error": "Empty message"}

        safe_content = escape(content.strip())
        new_msg = Message(user_id=user_id, content=safe_content)
        db.session.add(new_msg)
        db.session.commit()
        return {"success": True, "id": new_msg.id}