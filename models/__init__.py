from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .chat import Chat, ChatParticipant
from .message import Message
from .server import CaptchaStats, Settings
from .admin import Admin
from .push import PushSubscription

def _automigrate(engine):
    from sqlalchemy import inspect, text
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()

    for model in db.Model.__subclasses__():
        table = model.__tablename__
        if table not in existing_tables:
            continue
        existing_cols = {col["name"] for col in inspector.get_columns(table)}
        for col in model.__table__.columns:
            if col.name in existing_cols:
                continue
            col_type = col.type.compile(engine.dialect)
            nullable = "" if col.nullable else " NOT NULL"
            default = ""
            if col.default is not None and col.default.is_scalar:
                val = col.default.arg
                if isinstance(val, bool):
                    default = f" DEFAULT {1 if val else 0}"
                elif isinstance(val, str):
                    default = f" DEFAULT '{val}'"
                else:
                    default = f" DEFAULT {val}"
            elif col.nullable:
                default = " DEFAULT NULL"
            with engine.connect() as conn:
                conn.execute(text(f'ALTER TABLE "{table}" ADD COLUMN "{col.name}" {col_type}{default}'))
                conn.commit()

def init_models(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
        _automigrate(db.engine)