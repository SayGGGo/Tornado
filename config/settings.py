import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", os.urandom(24))
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///tornado.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    TURNSTILE_SECRET = os.getenv("TURNSTILE_SECRET", "1x0000000000000000000000000000000AA")
    TURNSTILE_SITEKEY = os.getenv("TURNSTILE_SITEKEY", "1")

    SERVER_NAME = os.getenv("SERVER_NAME", "Tornado")
    SERVER_OPENKEY = os.getenv("SERVER_OPENKEY")
    SERVER_VERIFY = os.getenv("SERVER_VERIFY", "false")
    LICENSE_SALT = os.getenv("LICENSE_SALT")

    TELEGRAM_API_ACTIVE = os.getenv("TELEGRAM_API") == "True"
    TG_API_ID = os.getenv("TG_API_ID")
    TG_API_HASH = os.getenv("TG_API_HASH")