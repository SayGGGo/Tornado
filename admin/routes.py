from flask import render_template, request, jsonify, session, redirect, url_for, abort
from functools import wraps
from models import db
from models.admin import Admin
from .services import AdminAuthService
from utils.security import CaptchaManager, SecurityManager
from config import Config


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        admin_id = session.get("admin_id")
        if not admin_id:
            return redirect(url_for("admin_login", next=request.url))

        try: admin = db.session.get(Admin, int(admin_id))
        except: admin = None

        if not admin or not admin.is_active:
            session.pop("admin_id", None)
            return redirect(url_for("admin_login"))

        return f(*args, **kwargs)
    return decorated_function

def register_admin(app):
    auth_service = AdminAuthService()

    if Config.ADMIN_SESSION_IND == "0": Config.ADMIN_SESSION_IND = "admin"

    @app.route(f"/{Config.ADMIN_SESSION_IND}/login", methods=["GET", "POST"])
    def admin_login():
        if "admin_id" in session:
            return redirect(url_for("admin_dashboard"))

        if request.method == "POST":
            data = request.json or {}
            username = data.get("username")
            password = data.get("password")
            captcha_token = data.get("captcha_token")

            provider, more = CaptchaManager.get_active_provider()
            captcha_payload = {"smart-token" if provider == "yandex" else "cf-turnstile-response": captcha_token }

            if not SecurityManager.verify_captcha(captcha_payload):
                return jsonify({"success": False, "message": "Капча не решена"}), 403

            result = auth_service.authenticate(username, password)
            if result.get("success"):
                session.permanent = True
                session["admin_id"] = result["admin_id"]
            return jsonify(result)

        provider, site_key = CaptchaManager.get_active_provider()
        return render_template(
            "admin/login.html",
            captcha_provider=provider,
            site_key=site_key,
            key=Config.ADMIN_SESSION_IND
        )

    @app.route(f"/{Config.ADMIN_SESSION_IND}/logout")
    def admin_logout():
        session.clear()
        return redirect(url_for("admin_login"))

    @app.route(f"/{Config.ADMIN_SESSION_IND}/")
    @app.route(f"/{Config.ADMIN_SESSION_IND}/dashboard")
    @admin_required
    def admin_dashboard():
        admin = db.session.get(Admin, session["admin_id"])
        return render_template("admin/dashboard.html", active_tab="dashboard", admin=admin)