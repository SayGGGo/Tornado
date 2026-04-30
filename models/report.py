import json
from datetime import datetime
from . import db


class UserReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    reported_user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    reason = db.Column(db.Text, nullable=False)
    context_messages = db.Column(db.Text, nullable=True)
    threat_level = db.Column(db.Integer, default=0)
    is_auto = db.Column(db.Boolean, default=False)
    trigger_word = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    chat_id = db.Column(db.Integer, nullable=True)

    reporter = db.relationship("User", foreign_keys=[reporter_id], backref="sent_reports")
    reported = db.relationship("User", foreign_keys=[reported_user_id], backref="received_reports")

    def get_context(self):
        try:
            return json.loads(self.context_messages) if self.context_messages else []
        except Exception:
            return []
