from datetime import datetime
from . import db

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    personal = db.Column(db.Boolean, default=False)
    name = db.Column(db.String(150), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    protected = db.Column(db.Boolean, default=False)
    chat_type = db.Column(db.String(20), default='group')

    participants = db.relationship("ChatParticipant", back_populates="chat", cascade="all, delete-orphan")
    messages = db.relationship("Message", back_populates="chat", cascade="all, delete-orphan")

class ChatParticipant(db.Model):
    __tablename__ = 'chat_participant'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    chat_id = db.Column(db.Integer, db.ForeignKey("chat.id"), nullable=False)
    role = db.Column(db.String(20), default="member")
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_typing = db.Column(db.DateTime, nullable=True)
    blocked = db.Column(db.Boolean, default=False)

    user = db.relationship("User", back_populates="chat_memberships")
    chat = db.relationship("Chat", back_populates="participants")