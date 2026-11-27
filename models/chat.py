from datetime import datetime
from . import db

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    personal = db.Column(db.Boolean, default=False)
    name = db.Column(db.String(150), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    protected = db.Column(db.Boolean, default=False)
    chat_type = db.Column(db.String(20), default='group')
    description = db.Column(db.String(250), default="")
    avatar = db.Column(db.Text, nullable=True)
    alias = db.Column(db.String(32), nullable=True)
    visibility = db.Column(db.String(12), default="public")
    invite_token = db.Column(db.String(64), nullable=True)
    approval_required = db.Column(db.Boolean, default=False)
    discussion_chat_id = db.Column(db.Integer, nullable=True)
    reactions_mode = db.Column(db.String(12), default="all")
    reaction_limit = db.Column(db.Integer, default=11)
    allowed_reactions = db.Column(db.Text, default="[]")
    join_requests = db.relationship("ChatJoinRequest", cascade="all, delete-orphan")


    participants = db.relationship("ChatParticipant", back_populates="chat", cascade="all, delete-orphan")
    messages = db.relationship("Message", back_populates="chat", cascade="all, delete-orphan")

class ChatParticipant(db.Model):
    __tablename__ = 'chat_participant'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    chat_id = db.Column(db.Integer, db.ForeignKey("chat.id"), nullable=False)
    role = db.Column(db.String(20), default="member")
    permissions = db.Column(db.Text, default="[]")
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_typing = db.Column(db.DateTime, nullable=True)
    blocked = db.Column(db.Boolean, default=False)
    history_after_id = db.Column(db.Integer, default=0)
    history_hidden = db.Column(db.Boolean, default=False)

    user = db.relationship("User", back_populates="chat_memberships")
    chat = db.relationship("Chat", back_populates="participants")
class ChatJoinRequest(db.Model):
    __tablename__ = "chat_join_request"
    chat_id = db.Column(db.Integer, db.ForeignKey("chat.id"), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
