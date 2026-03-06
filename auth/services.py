from werkzeug.security import generate_password_hash, check_password_hash
from flask import url_for, session
from models import User, db
from utils import verify_turnstile


class AuthService:
    def register_user(self, data):
        token = data.get("cf-turnstile-response")
        if not token or not verify_turnstile(token):
            return {"success": False, "message": "Капча не пройдена"}

        required_fields = ["fio", "login", "password", "password_retry", "position"]
        if not all(data.get(k) for k in required_fields):
            return {"success": False, "message": "Заполните все обязательные поля"}

        if data["password"] != data["password_retry"]:
            return {"success": False, "message": "Пароли не совпадают"}

        if User.query.filter_by(login=data["login"]).first():
            return {"success": False, "message": "Пользователь с таким логином уже существует"}

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

        session["user_id"] = new_user.id
        return {"success": True, "redirect": url_for("chat")}

    def login_user(self, data):
        token = data.get("cf-turnstile-response")
        if not token or not verify_turnstile(token):
            return {"success": False, "message": "Капча не пройдена"}

        user = User.query.filter_by(login=data.get("login")).first()
        if user and check_password_hash(user.password_hash, data.get("password", "")):
            session["user_id"] = user.id
            return {"success": True, "redirect": url_for("chat")}

        return {"success": False, "message": "Неверный логин или пароль"}