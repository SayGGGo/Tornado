from . import db
from datetime import datetime, timedelta


class CodeQu(db.Model):
    __tablename__ = "code_queue"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    code = db.Column(db.Text, nullable=False)
    output = db.Column(db.Text, nullable=False)

    user = db.relationship("User", backref=db.backref("code_queue", lazy="dynamic"))