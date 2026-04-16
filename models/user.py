from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fio = db.Column(db.String(150), nullable=False)
    avatar = db.Column(db.String(200))
    login = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    group_id = db.Column(db.String(50), nullable=False)
    study_type = db.Column(db.String(50))
    platforms = db.Column(db.String(200))
    projects = db.Column(db.String(200))
    source = db.Column(db.String(50))
    bio = db.Column(db.String(200))

    premium = db.Column(db.Boolean, default=False)
    premium_emoji = db.Column(db.Integer, default=0)

    chat_memberships = db.relationship("ChatParticipant", back_populates="user", cascade="all, delete-orphan")
    messages = db.relationship("Message", back_populates="author", lazy="dynamic")

    public_key = db.Column(db.Text, nullable=True)
    private_key = db.Column(db.Text, nullable=True)

    ide_connected = db.Column(db.Boolean, default=False)
    ide_token = db.Column(db.String(200))