import random
import sys
import os
import time
from datetime import datetime
import hashlib
import socket
import subprocess
import asyncio

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
from models import init_models, User, Chat, Message, ChatParticipant, db
from utils import verify_turnstile, get_groups, get_randomization, verify_key, check_github_updates

tg_api = False
if Config.TELEGRAM_API_ACTIVE:
    try:
        from telethon.sync import TelegramClient
        from telethon.sessions import MemorySession
        import qrcode
        from qrcode.image.styledpil import StyledPilImage
        from qrcode.image.styles.moduledrawers import RoundedModuleDrawer, CircleModuleDrawer
        import PIL
        from PIL import ImageDraw
        import io
        tg_api = True
    except ImportError as lib:
        sys.exit(f"Пожалуйста, установите библиотеку {lib} или установите TELEGRAM_API=False в .env")

app = Flask(__name__)
app.config.from_object(Config)
init_models(app)

server_ip_cache = None
groups_cache = {"data": [], "last_updated": 0}

if tg_api:
    logger.info("Teelgram API активен")


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

@app.route("/ping")
def fake_ping():
    messages = [
        "Tornado is best",
        "Лучший мессенджер - Tornado",
        "Переходи в Tornado",
        "А ведь Tornado лучше...",
        "Tornado: твоя приватность под защитой",
        "Попробуй Tornado прямо сейчас",
        "Tornado — связь без границ",
        "Добро пожаловать в Tornado",
        "Tornado — это быстрее, чем ты думаешь",
        "Выбирай лучшее — выбирай Tornado",
        "Tornado — мессенджер нового поколения",
        "Твой выбор сегодня — Tornado",
        "Tornado — здесь все свои",
        "Безопасность начинается с Tornado",
        "Tornado — просто, быстро, надежно",
        "Весь мир в одном Tornado",
        "Tornado: будущее уже наступило",
        "Хватит ждать, заходи в Tornado"
    ]

    return jsonify({"ok": True, "name": get_randomization(random.choice(messages), random.randint(1, 5))})


@app.route("/api/ping")
def ping():
    try:
        open_key = Config.SERVER_OPENKEY
        is_verified = verify_key(open_key)
        verify_env = str(Config.SERVER_VERIFY).lower()

        return jsonify({
            "ok": True,
            "name": Config.SERVER_NAME,
            "verify": is_verified,
            "verify_key": open_key if verify_env == "true" else None
        })
    except Exception as error:
        logger.error(f"Ошибка в /api/ping: {error}")
        return jsonify({"ok": False, "error": str(error)})


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

# --- Telegram сессии [Beta]
async def get_qr_from_login(client):
    await client.connect()
    qr_login = await client.qr_login()
    return qr_login.url

# todo: полный асинк прикрутить обязательно, криво работает
@app.route("/api/tg/login", methods=["GET"])
def generate_qr_from_login():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        client = TelegramClient(MemorySession(), int(Config.TG_API_ID), Config.TG_API_HASH, loop=loop)
    except:
        return jsonify({"success": False, "message": "API недоступен"}), 500

    try:
        url = loop.run_until_complete(get_qr_from_login(client))

        qr = qrcode.QRCode(
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        img = qr.make_image(
            image_factory=StyledPilImage,
            module_drawer=RoundedModuleDrawer(),
            eye_drawer=RoundedModuleDrawer()).convert("RGB")

        width, height = img.size

        hole_size_ratio = 0.25
        hole_w = int(width * hole_size_ratio)
        hole_h = int(height * hole_size_ratio)

        left = (width - hole_w) // 2
        top = (height - hole_h) // 2
        right = (width + hole_w) // 2
        bottom = (height + hole_h) // 2

        draw = ImageDraw.Draw(img)
        draw.rectangle([left, top, right, bottom], fill="white")

        img_io = io.BytesIO()
        img.save(img_io, "PNG")
        img_io.seek(0)

        return send_file(img_io, mimetype="image/png")
    except Exception as error:
        logger.error(f"Ошибка: {error}")
        return jsonify({"success": False, "message": "API недоступен"}), 500
    finally:
        loop.close()

@app.route("/logout")
def logout():
    session.pop("user_id", None)
    return redirect(url_for("login"))


@app.route("/chat")
def chat():
    if "user_id" not in session:
        return redirect(url_for("login"))

    user = db.session.get(User, session["user_id"])
    if not user:
        session.pop("user_id", None)
        return redirect(url_for("login"))

    folders = [{"name": "Все", "count": 0, "active": True}]

    msg_data = {
        "1": {
            "name": "LuckyTools AI",
            "avatar": "https://i.ibb.co/dsKqPRtX/ltlogo.png",
            "active": False,
            "last_msg": "Нейросеть от LuckyTools",
            "last_time": "",
            "last_status": False,
            "unread": 0,
            "pinned": False,
            "muted": False,
            "tags": [],
            "premium": "1"
        },
        "2": {
            "name": "Tornado",
            "avatar": "https://i.ibb.co/XZ3kSFyf/tlogo.png",
            "active": False,
            "last_msg": "Служебные сообщения",
            "last_time": "",
            "last_status": False,
            "unread": 0,
            "pinned": False,
            "muted": False,
            "premium": "1"
        },
        "3": {
            "name": "Test",
            "avatar": "https://cdn.worldvectorlogo.com/logos/telegram-1.svg",
            "active": False,
            "last_msg": "/start",
            "last_time": "17:21",
            "last_status": True,
            "unread": 0,
            "pinned": False,
            "muted": False,
            "premium": "0"
        }}
    return render_template("chat.html", current_user=user, msg_data=msg_data, folders=folders)


@app.route("/api/messages", methods=["GET"])
def get_messages():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    last_id = request.args.get("last_id", 0, type=int)
    messages = Message.query.filter(Message.id > last_id).order_by(Message.id.asc()).limit(50).all()

    result = [{
        "id": msg.id,
        "user_id": msg.user_id,
        "login": msg.user.login,
        "content": msg.content,
        "timestamp": msg.timestamp.strftime("%H:%M")
    } for msg in messages]

    return jsonify(result)


@app.route("/api/messages", methods=["POST"])
def send_message():
    if "user_id" not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    if not data:
        return jsonify({"error": "Empty request"}), 400

    raw_content = data.get("content", "").strip()

    if not raw_content:
        return jsonify({"error": "Empty message"}), 400

    safe_content = escape(raw_content)

    new_msg = Message(user_id=session["user_id"], content=safe_content)
    db.session.add(new_msg)
    db.session.commit()

    return jsonify({"success": True, "id": new_msg.id})

@app.route("/favicon.ico")
def icon():
    return send_file("static/icons/favicon.ico")


@app.errorhandler(404)
def page_not_found(e):
    logger.warning(f"Страница не найдена: {request.url}")
    return render_template("error.html", error_code=404), 404

@app.errorhandler(500)
def internal_server_error(e):
    logger.error(f"Внутренняя ошибка сервера: {e}")
    return render_template("error.html", error_code=500), 500

@app.errorhandler(403)
def perm_defended(e):
    logger.warning(f"Доступ запрещен: {request.url}")
    return render_template("error.html", error_code=403), 403


if __name__ == "__main__":
    # check_github_updates()
    register_bot_api(app)
    app.run(port=3000, host="0.0.0.0")
