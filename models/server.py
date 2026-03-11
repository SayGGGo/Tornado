from . import db

class CaptchaStats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    month = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    count = db.Column(db.Integer, default=0)