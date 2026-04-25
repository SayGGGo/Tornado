import sys
import os

try:
    import requests
    from bs4 import BeautifulSoup
    from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_file
    from werkzeug.security import generate_password_hash, check_password_hash
    from markupsafe import escape
except ImportError as lib:
    sys.exit(f"Пожалуйста, установите библиотеку {lib}")

from config import Config, logger
from botapi import register_bot_api
from models import init_models, User, Chat, Message, ChatParticipant, Settings, db
from utils import verify_turnstile, get_groups, get_randomization, verify_key, check_github_updates
from utils.security import DDoSGuard
from auth import register_auth
from system import register_system
from chat import register_chat
from admin import register_admin
from spotify import register_spotify


app = Flask(__name__)
app.config.from_object(Config)
app.config['SECRET_KEY'] = Config.SECRET_KEY

init_models(app)

with app.app_context():
    from models.server import Settings as _Settings
    if not _Settings.query.first():
        db.session.add(_Settings())
        db.session.commit()
register_bot_api(app)
register_auth(app)
register_system(app)
register_chat(app)
register_admin(app)
register_spotify(app)

@app.route("/sw.js")
def service_worker():
    from flask import send_from_directory, make_response
    resp = make_response(send_from_directory('static', 'sw.js'))
    resp.headers['Content-Type'] = 'application/javascript'
    resp.headers['Service-Worker-Allowed'] = '/'
    return resp

@app.after_request
def set_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'geolocation=(), payment=()'
    return response

@app.before_request
def anti_ddos():
    if 'sid' not in session: session['sid'] = os.urandom(8).hex()
    if not DDoSGuard.check(
        request.remote_addr,
        request.headers.get('User-Agent'),
        request.method,
        request.path,
        request.referrer,
        session.get('user_id'),
        session.get('sid')
    ):
        return "Anti-System Block", 429

@app.teardown_appcontext
def shutdown_session(exception=None):
    db.session.remove()

server_ip_cache = None
groups_cache = {"data": [], "last_updated": 0}

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

    ssl_ctx = None
    if Config.USE_SSL:
        if os.path.exists("server.crt") and os.path.exists("server.key"):
            ssl_ctx = ("server.crt", "server.key")
        else:
            ssl_ctx = "adhoc"

    app.run(host=Config.FLASK_HOST,  port=Config.FLASK_PORT, ssl_context=ssl_ctx)
