from datetime import datetime
from . import db

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    chat_id = db.Column(db.Integer, db.ForeignKey("chat.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False)
    is_edited = db.Column(db.Boolean, default=False)
    is_deleted = db.Column(db.Boolean, default=False)
    file_url = db.Column(db.String(512), nullable=True)
    file_name = db.Column(db.String(255), nullable=True)
    file_type = db.Column(db.String(100), nullable=True)
    file_size = db.Column(db.Integer, nullable=True)
    reply_to_id = db.Column(db.Integer, db.ForeignKey("message.id"), nullable=True)
    msg_type = db.Column(db.String(20), default='text')

    author = db.relationship("User", back_populates="messages")
    chat = db.relationship("Chat", back_populates="messages")
    reply_to = db.relationship("Message", remote_side=[id], foreign_keys=[reply_to_id])