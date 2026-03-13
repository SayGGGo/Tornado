from werkzeug.security import generate_password_hash, check_password_hash
from flask import url_for, session
from models import User, db
from utils import verify_turnstile
import uuid
import time
from utils.security import SecurityManager

active_auth_requests = {}


class AuthService:
    def register_user(self, data):
        if not SecurityManager.verify_captcha(data):
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
        if not SecurityManager.verify_captcha(data):
            return {"success": False, "message": "Капча не пройдена"}

        user = User.query.filter_by(login=data.get("login")).first()
        if user and check_password_hash(user.password_hash, data.get("password", "")):
            session["user_id"] = user.id
            redirect_url = data.get("next") or url_for("chat")
            return {"success": True, "redirect": redirect_url}

        return {"success": False, "message": "Неверный логин или пароль"}


class ConnectService:
    def create_auth_request(self, name, logo, info):
        token = str(uuid.uuid4())
        active_auth_requests[token] = {
            "name": name,
            "logo": logo,
            "info": info,
            "status": "pending",
            "user_data": None,
            "expires_at": time.time() + 300
        }
        return token

    def get_request(self, token):
        req = active_auth_requests.get(token)
        if req and time.time() < req["expires_at"]:
            return req
        if req:
            del active_auth_requests[token]
        return None

    def approve_request(self, token, user_id):
        req = self.get_request(token)
        if not req:
            return False
        user = db.session.get(User, user_id)
        if not user:
            return False

        data = {}
        if "1" in req["info"]: data["id"] = user.id
        if "2" in req["info"]: data["login"] = user.login
        if "3" in req["info"]: data["fio"] = user.fio
        if "4" in req["info"]: data["premium"] = user.premium
        if "5" in req["info"]: data["messages_access"] = True

        req["status"] = "approved"
        req["user_data"] = data
        return True

    def reject_request(self, token):
        req = self.get_request(token)
        if not req:
            return False
        req["status"] = "rejected"
        return True

    def check_status(self, token):
        req = self.get_request(token)
        if not req:
            return {"status": "expired"}

        if req.get("status") == "approved":
            if req.get("name") == "TORNADO for IDE":
                user_data = req.get("user_data")
                if user_data:
                    user = db.session.get(User, user_data.get("id"))
                    if user:
                        req["ide_token"] = user.ide_token

        return {
            "status": req["status"],
            "user_data": req.get("user_data"),
            "ide_token": req.get("ide_token") if req.get("name") == "TORNADO for IDE" else None
        }