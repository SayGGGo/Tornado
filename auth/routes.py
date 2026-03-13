import secrets
from flask import render_template, request, jsonify, session, redirect, url_for
from config import logger, Config
from models import User, db
from utils import get_groups
from .services import AuthService, ConnectService
from utils.security import CaptchaManager


def register_auth(app):
    auth_service = AuthService()
    connect_service = ConnectService()

    @app.route("/")
    def index():
        if "user_id" in session:
            return redirect(url_for("chat"))

        provider, site_key = CaptchaManager.get_active_provider()
        return render_template(
            "start.html",
            groups=get_groups(),
            captcha_provider=provider,
            site_key=site_key
        )

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
            data = request.json or {}
            next_url = request.args.get("next")
            if next_url:
                data["next"] = next_url

            result = auth_service.login_user(data)
            return jsonify(result)

        provider, site_key = CaptchaManager.get_active_provider()
        return render_template(
            "login.html",
            captcha_provider=provider,
            site_key=site_key
        )

    @app.route("/logout")
    def logout():
        session.pop("user_id", None)
        return redirect(url_for("login"))

    @app.route("/api/start_auth", methods=["GET", "POST"])
    def start_auth():
        data = request.json if request.is_json else request.args
        name = data.get("name", "Unknown App")
        logo = data.get("logo", "")
        info = str(data.get("info", "123"))

        token = connect_service.create_auth_request(name, logo, info)
        return jsonify({
            "success": True,
            "token": token,
            "url": url_for('connect_page', token=token, _external=True)
        })

    @app.route("/auth/<token>")
    def connect_page(token):
        if "user_id" not in session:
            return redirect(url_for("login", next=request.path))

        user = db.session.get(User, session["user_id"])
        if not user:
            return redirect(url_for("login"))

        req = connect_service.get_request(token)
        if not req or req["status"] != "pending":
            return render_template("error.html", error_code=403)

        requested_data = []
        if "1" in req["info"]: requested_data.append("ID профиля")
        if "2" in req["info"]: requested_data.append("Логин и аватарка")
        if "3" in req["info"]: requested_data.append("ФИО")
        if "4" in req["info"]: requested_data.append("Статус Premium")
        if "5" in req["info"]: requested_data.append("Доступ к перепискам")

        return render_template(
            "connect.html",
            token=token,
            app_name=req["name"],
            app_logo=req["logo"],
            requested_data=requested_data,
            user_name=user.login,
            user_fio=user.fio,
            user_avatar=user.avatar
        )

    @app.route("/api/auth/<token>/approve", methods=["POST"])
    def approve_auth(token):
        if "user_id" not in session:
            return jsonify({"success": False}), 401

        user_id = session["user_id"]
        req = connect_service.get_request(token)

        if req and req.get("name") == "TORNADO for IDE":
            # print("IDE found")
            user = db.session.get(User, user_id)
            if user:
                ide_token = secrets.token_hex(32)
                user.ide_connected = True
                user.ide_token = ide_token
                db.session.commit()

                success = connect_service.approve_request(token, user_id)
                return jsonify({"success": success})

        success = connect_service.approve_request(token, user_id)
        return jsonify({"success": success})

    @app.route("/api/auth/<token>/reject", methods=["POST"])
    def reject_auth(token):
        if "user_id" not in session:
            return jsonify({"success": False}), 401
        success = connect_service.reject_request(token)
        return jsonify({"success": success})

    @app.route("/api/check_auth/<token>", methods=["GET"])
    def check_auth(token):
        return jsonify(connect_service.check_status(token))