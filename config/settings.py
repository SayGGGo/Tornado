import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", os.urandom(24))
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///tornado.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    TURNSTILE_SECRET = os.getenv("TURNSTILE_SECRET", "0")
    TURNSTILE_SITEKEY = os.getenv("TURNSTILE_SITEKEY", "0")

    YANDEX_SERVER = os.getenv("YANDEX_SERVER", "0")
    YANDEX_SITEKEY = os.getenv("YANDEX_SITEKEY", "0")

    SERVER_NAME_PING = os.getenv("SERVER_NAME_PING", "Tornado")
    SERVER_IMG_URL = os.getenv("SERVER_IMG_URL", "")
    SERVER_OPENKEY = os.getenv("SERVER_OPENKEY")
    SERVER_VERIFY = os.getenv("SERVER_VERIFY", "false")
    LICENSE_SALT = os.getenv("LICENSE_SALT")

    TELEGRAM_API_ACTIVE = os.getenv("TELEGRAM_API") == "True"
    TG_API_ID = os.getenv("TG_API_ID")
    TG_API_HASH = os.getenv("TG_API_HASH")

    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "false")
    FLASK_HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    FLASK_PORT = os.getenv("FLASK_PORT", "3000")

    ADMIN_SESSION_IND = os.getenv("ADMIN_PAGE", "0")

    AGORA_APP_ID = os.getenv("AGORA_APP_ID", "0")
    AGORA_APP_CERTIFICATE = os.getenv("AGORA_APP_CERTIFICATE", "0")