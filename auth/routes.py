from flask import render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from config import logger, Config
from models import User, db
from utils import verify_turnstile, get_groups

def register_auth(app):
    @app.route("/")
    def index():
        if "user_id" in session:
            return redirect(url_for("chat"))
        return render_template("start.html", groups=get_groups(), site_key=Config.TURNSTILE_SITEKEY)

    @app.route("/api/register", methods=["POST"])
    def register():
        data = request.json
        if not data:
            logger.warning("Попытка регистрации с пустым запросом.")
            return jsonify({"success": False, "message": "Пустой запрос"}), 400

        token = data.get("cf-turnstile-response")
        if not token or not verify_turnstile(token):
            logger.warning("Провалена проверка капчи при регистрации.")
            return jsonify({"success": False, "message": "Капча не пройдена"})

        required_fields = ["fio", "login", "password", "password_retry", "position"]
        if not all(data.get(k) for k in required_fields):
            return jsonify({"success": False, "message": "Заполните все обязательные поля"})

        if data["password"] != data["password_retry"]:
            return jsonify({"success": False, "message": "Пароли не совпадают"})

        if User.query.filter_by(login=data["login"]).first():
            logger.warning(f"Попытка регистрации существующего логина: {data['login']}")
            return jsonify({"success": False, "message": "Пользователь с таким логином уже существует"})

        new_user = User(
            fio=str(data["fio"]).strip(),
            login=str(data["login"]).strip(),
            password_hash=generate_password_hash(data["password"]),
            group_id=str(data["position"]).strip(),
            study_type=str(data.get("hiring_volume", "")).strip(),
            platforms=str(data.get("channels", "")).strip(),
            projects=str(data.get("painpoints", "")).strip(),
            source=str(data.get("current_ats", "")).strip(),
            premium=bool(data.get("premium_sub"))
        )

        db.session.add(new_user)
        db.session.commit()
        logger.info(f"Зарегистрирован новый пользователь: {new_user.login}")

        session["user_id"] = new_user.id
        return jsonify({"success": True, "redirect": url_for("chat")})

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if "user_id" in session:
            return redirect(url_for("chat"))

        if request.method == "POST":
            data = request.json
            if not data:
                return jsonify({"success": False, "message": "Пустой запрос"}), 400

            token = data.get("cf-turnstile-response")
            if not token or not verify_turnstile(token):
                return jsonify({"success": False, "message": "Капча не пройдена"})

            user = User.query.filter_by(login=data.get("login")).first()

            if user and check_password_hash(user.password_hash, data.get("password", "")):
                session["user_id"] = user.id
                logger.info(f"Успешный вход пользователя: {user.login}")
                return jsonify({"success": True, "redirect": url_for("chat")})

            logger.warning(f"Неудачная попытка входа для логина: {data.get('login')}")
            return jsonify({"success": False, "message": "Неверный логин или пароль"})

        return render_template("login.html", site_key=Config.TURNSTILE_SITEKEY)

    @app.route("/logout")
    def logout():
        session.pop("user_id", None)
        return redirect(url_for("login"))