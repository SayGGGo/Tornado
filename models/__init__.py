from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .chat import Chat, ChatParticipant
from .message import Message
from .server import CaptchaStats, Settings
from .admin import Admin
from .push import PushSubscription

def init_models(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()