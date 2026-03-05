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

def get_local_commit():
    try:
        return f"коммит: {subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], capture_output=True, text=True, check=True).stdout.strip()}"
    except (subprocess.CalledProcessError, FileNotFoundError):
        return "неизвестно"


def get_local_version():
    try:
        return f"релиз: {subprocess.run(['git', 'describe', '--tags', '--abbrev=0'], capture_output=True, text=True, check=True).stdout.strip()}"
    except (subprocess.CalledProcessError, FileNotFoundError):
        return get_local_commit()


def check_github_updates():
    headers = {"Accept": "application/vnd.github.v3+json"}
    current_version = get_local_version()
    current_commit = get_local_commit()

    try:
        url_releases = f"https://api.github.com/repos/SayGGGo/Tornado/releases"
        res = requests.get(url_releases, headers=headers, timeout=5)

        if res.status_code == 200 and res.json():
            latest_release = res.json()[0]
            latest_version = latest_release.get("tag_name")
            if latest_version and latest_version != current_version:
                logger.warning(f"Доступен новый релиз: {latest_version} (текущий {current_version})")
            return

        url_commits = f"https://api.github.com/repos/SayGGGo/Tornado/commits"
        res_commits = requests.get(url_commits, headers=headers, timeout=5)

        if res_commits.status_code == 200 and res_commits.json():
            latest_commit = res_commits.json()[0].get("sha", "")[:7]
            if latest_commit and latest_commit != current_commit:
                logger.warning(f"Доступен новый коммит: {latest_commit} (текущий {current_commit})")

    except requests.RequestException as error:
        logger.error(f"Ошибка проверки обновлений GitHub: {error}")


def verify_turnstile(token):
    url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    data = {
        "secret": Config.TURNSTILE_SECRET,
        "response": token
    }
    try:
        response = requests.post(url, data=data, timeout=5)
        return response.json().get("success", False)
    except requests.RequestException as error:
        logger.error(f"Ошибка проверки Turnstile: {error}")
        return False


def get_groups():
    global groups_cache
    current_time = time.time()

    if groups_cache["data"] and (current_time - groups_cache["last_updated"] < 3600):
        return groups_cache["data"]

    url = "https://genius-school.kuzstu.ru/%D1%80%D0%B0%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5/"
    groups = []
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        response.encoding = "utf-8"
        soup = BeautifulSoup(response.text, "html.parser")
        links = soup.select("table a")
        for link in links:
            name = link.get_text(strip=True)
            if name:
                groups.append({
                    "name": name,
                    "value": name.lower().replace(" ", "_")
                })

        if groups:
            groups_cache["data"] = groups
            groups_cache["last_updated"] = current_time
            logger.info("Расписание групп успешно обновлено.")

    except requests.RequestException as error:
        logger.error(f"Ошибка загрузки расписания: {error}")
        if groups_cache["data"]:
            return groups_cache["data"]
        groups = [{"name": "Ошибка загрузки расписания", "value": "error"}]

    return groups


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


# todo: Что-то придумать
def get_randomization(text, power):
    homoglyphs = {
        "а": ["a", "а", "α", "𝕒", "а́", "а̇"], "б": ["б", "b", "6", "♭", "𝕓"],
        "в": ["в", "b", "v", "𝕧", "ʙ"], "г": ["г", "r", "g", "𝕘", "г̓"],
        "д": ["д", "d", "𝕕", "∂"], "е": ["е", "e", "е́", "℮", "𝕖", "є"],
        "з": ["з", "3", "z", "𝕫"], "и": ["и", "u", "i", "𝕚", "і"],
        "к": ["к", "k", "𝕜", "қ"], "л": ["л", "l", "𝕝", "љ"],
        "м": ["м", "m", "𝕞", "ʍ"], "н": ["н", "n", "h", "𝕟", "ң"],
        "о": ["о", "o", "0", "ο", "𝕠", "о̇"], "п": ["п", "n", "π", "𝕡"],
        "р": ["р", "p", "ρ", "𝕡"], "с": ["с", "c", "𝕔", "ç"],
        "т": ["т", "t", "𝕥", "τ"], "у": ["у", "y", "γ", "𝕪"],
        "х": ["х", "x", "𝕩", "х̇"], "ч": ["ч", "4", "ҷ"],

        "a": ["a", "а", "α", "𝕒", "а́"], "b": ["b", "в", "8", "𝕓", "ʙ"],
        "c": ["c", "с", "ç", "𝕔", "с̇"], "d": ["d", "ԁ", "𝕕", "đ"],
        "e": ["e", "е", "℮", "𝕖", "ё"], "f": ["f", "𝕗", "ƒ"],
        "g": ["g", "𝕘", "ԍ", "ｇ"], "h": ["h", "н", "𝕙", "һ"],
        "i": ["i", "і", "𝕚", "1", "ι"], "j": ["j", "ј", "𝕛"],
        "k": ["k", "к", "𝕜", "κ"], "l": ["l", "𝕝", "ӏ", "ǀ"],
        "m": ["m", "м", "𝕞", "ʍ"], "n": ["n", "п", "𝕟", "η"],
        "o": ["o", "о", "0", "𝕠", "ο"], "p": ["p", "р", "𝕡", "ρ"],
        "q": ["q", "𝕢", "ԛ"], "r": ["r", "г", "𝕣", "ʀ"],
        "s": ["s", "𝕤", "ѕ", "ś"], "t": ["t", "т", "𝕥", "τ"],
        "u": ["u", "и", "𝕦", "μ"], "v": ["v", "ѵ", "𝕧", "ν"],
        "w": ["w", "𝕨", "ѡ"], "x": ["x", "х", "𝕩", "ҳ"],
        "y": ["y", "у", "𝕪", "ү"], "z": ["z", "𝕫", "ᴢ"],

        "0": ["0", "O", "Ο", "𝕠", "zero"], "1": ["1", "I", "l", "𝕚", "і"],
        "2": ["2", "ℤ", "ᒿ"], "3": ["3", "з", "Ӡ", "ʒ"],
        "4": ["4", "ч", "Ꮞ"], "5": ["5", "Ƽ", "𝟝"],
        "6": ["6", "б", "б"], "7": ["7", "7", "𝟕"],
        "8": ["8", "B", "𝟠", "Ȣ"], "9": ["9", "q", "𝟡"]
    }

    invisible_chars = ["\u200B", "\u200C", "\u200D", "\u2060"]
    result = []

    for char in text:
        if char in [":", "/", ".", "?", "=", "&", "+"]:
            result.append(char)
            continue

        char_lower = char.lower()
        if char_lower in homoglyphs and random.random() < power:
            replacement = random.choice(homoglyphs[char_lower])
            new_char = replacement.upper() if char.isupper() else replacement
        else:
            new_char = char

        result.append(new_char)

        if char.isalnum() and random.random() < (power * 0.4):
            result.append(random.choice(invisible_chars))

    return "".join(result)


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


# Реальный пинг
def get_ip():
    global server_ip_cache
    if server_ip_cache:
        return server_ip_cache
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(2)
        s.connect(("8.8.8.8", 80))
        server_ip_cache = s.getsockname()[0]
        s.close()
        return server_ip_cache
    except:
        logger.error(f"Не удалось получить IP сервера")
        return "127.0.0.1"


def verify_key(key):
    if not key:
        return False
    try:
        raw_string = f"{get_ip()}:{Config.SERVER_NAME}:{Config.LICENSE_SALT}"
        expected_key = hashlib.sha256(raw_string.encode()).hexdigest()

        return key == expected_key
    except Exception:
        logger.error(f"Ошибка проверки ключа")
        return False


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
