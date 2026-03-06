from flask import render_template, request, jsonify, session, redirect, url_for
from config import logger, Config
from utils import get_groups
from .services import AuthService

def register_auth(app):
    auth_service = AuthService()

    @app.route("/")
    def index():
        if "user_id" in session:
            return redirect(url_for("chat"))
        return render_template("start.html", groups=get_groups(), site_key=Config.TURNSTILE_SITEKEY)

    @app.route("/api/register", methods=["POST"])
    def register():
        result = auth_service.register_user(request.json or {})
        if not result["success"]:
            return jsonify(result), 400 if result.get("message") == "Пустой запрос" else 200
        return jsonify(result)

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if "user_id" in session:
            return redirect(url_for("chat"))

        if request.method == "POST":
            result = auth_service.login_user(request.json or {})
            return jsonify(result)

        return render_template("login.html", site_key=Config.TURNSTILE_SITEKEY)

    @app.route("/logout")
    def logout():
        session.pop("user_id", None)
        return redirect(url_for("login"))