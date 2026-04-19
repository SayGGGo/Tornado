import os
import hashlib

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


class Config:
    _secret = os.getenv("SECRET_KEY")
    SECRET_KEY = _secret if _secret else hashlib.sha256(b"tornado-default-dev-key").hexdigest()
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
    TG_PROXY_HOST = os.getenv("TG_PROXY_HOST", "")
    TG_PROXY_PORT = os.getenv("TG_PROXY_PORT", "10808")

    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "false")
    FLASK_HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    FLASK_PORT = os.getenv("FLASK_PORT", "3000")
    USE_SSL = os.getenv("USE_SSL") == "True"

    ADMIN_SESSION_IND = os.getenv("ADMIN_PAGE", "0")

    AGORA_APP_ID = os.getenv("AGORA_APP_ID", "0")
    AGORA_APP_CERTIFICATE = os.getenv("AGORA_APP_CERTIFICATE", "0")
    SECONDARY_CERTIFICATE = os.getenv("SECONDARY_CERTIFICATE", "0")

    SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
    SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
    SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
    WHITE_LIST = os.getenv("WHITE_LIST", "")
    ANTI_DDOS = os.getenv("ANTI_DDOS", "True") == "True"
