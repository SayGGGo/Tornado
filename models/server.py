from . import db


class CaptchaStats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    month = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)
    count = db.Column(db.Integer, default=0)


class Settings(db.Model):
    # system
    id = db.Column(db.Integer, primary_key=True)
    sinc_env = db.Column(db.Boolean, default=True)

    # captha
    turnstile_secret = db.Column(db.String(255), default="0")
    turnstile_sitekey = db.Column(db.String(255), default="0")

    yandex_server = db.Column(db.String(255), default="0")
    yandex_sitekey = db.Column(db.String(255), default="0")

    # server card
    server_name_ping = db.Column(db.String(255), default="Tornado")
    server_img_url = db.Column(db.String(500), default="")
    server_openkey = db.Column(db.String(255))
    server_verify = db.Column(db.Boolean, default=False)
    license_salt = db.Column(db.String(255))

    # tg intg
    telegram_api_active = db.Column(db.Boolean, default=False)
    tg_api_id = db.Column(db.String(255))
    tg_api_hash = db.Column(db.String(255))

    # flask
    flask_debug = db.Column(db.Boolean, default=False)
    flask_host = db.Column(db.String(50), default="0.0.0.0")
    flask_port = db.Column(db.Integer, default=3000)

    # admin
    admin_session_ind = db.Column(db.String(255), default="0")