from . import db


class BotToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, unique=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True, index=True)
    token = db.Column(db.String(128), nullable=False, unique=True, index=True)
    active = db.Column(db.Boolean, nullable=False, default=True)
    user = db.relationship("User", foreign_keys=[user_id])
    owner = db.relationship("User", foreign_keys=[owner_id])
