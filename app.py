import random
import sys
import os
import time
from datetime import datetime
import hashlib
import socket

try:
    import requests
    from bs4 import BeautifulSoup
    from flask import Flask, render_template, request, jsonify, session, redirect, url_for
    from flask_sqlalchemy import SQLAlchemy
    from werkzeug.security import generate_password_hash, check_password_hash
    from dotenv import load_dotenv
    from markupsafe import escape
    import subprocess
except ImportError as e:
    sys.exit(f"Критическая ошибка: не установлена библиотека {e.name}. Выполните установку зависимостей.")

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", os.urandom(24))
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///tornado.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

server_ip_cache = None
groups_cache = {"data": [], "last_updated": 0}


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fio = db.Column(db.String(150), nullable=False)
    login = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    group_id = db.Column(db.String(50), nullable=False)
    study_type = db.Column(db.String(50))
    platforms = db.Column(db.String(200))
    projects = db.Column(db.String(200))
    source = db.Column(db.String(50))
    premium = db.Column(db.Boolean, default=False)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship("User", backref=db.backref("messages", lazy=True))


with app.app_context():
    db.create_all()


def get_local_commit():
    try:
        return f"коммит: {subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            capture_output=True, text=True, check=True
        ).stdout.strip()}"
    except (subprocess.CalledProcessError, FileNotFoundError):
        return "неизвестно"


def get_local_version():
    try:
        return f"релиз: {subprocess.run(
            ["git", "describe", "--tags", "--abbrev=0"],
            capture_output=True, text=True, check=True
        ).stdout.strip()}"
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
                print(f"[WARN] Доступен новый релиз: {latest_version} (текущий {current_version})")
            return

        url_commits = f"https://api.github.com/repos/SayGGGo/Tornado/commits"
        res_commits = requests.get(url_commits, headers=headers, timeout=5)

        if res_commits.status_code == 200 and res_commits.json():
            latest_commit = res_commits.json()[0].get("sha", "")[:7]
            if latest_commit and latest_commit != current_commit:
                print(f"[WARN] Доступен новый коммит: {latest_commit} (текущий {current_commit})")

    except requests.RequestException as e:
        print(f"[ERROR] Ошибка проверки обновлений GitHub: {e}")


def verify_turnstile(token):
    url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
    data = {
        "secret": os.getenv("TURNSTILE_SECRET", "1x0000000000000000000000000000000AA"),
        "response": token
    }
    try:
        response = requests.post(url, data=data, timeout=5)
        return response.json().get("success", False)
    except requests.RequestException:
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

    except requests.RequestException:
        if groups_cache["data"]:
            return groups_cache["data"]
        groups = [{"name": "Ошибка загрузки расписания", "value": "error"}]

    return groups


@app.route("/")
def index():
    if "user_id" in session:
        return redirect(url_for("chat"))
    return render_template("start.html", groups=get_groups(), site_key=os.getenv("TURNSTILE_SITEKEY", "1"))


@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    if not data:
        return jsonify({"success": False, "message": "Пустой запрос"}), 400

    token = data.get("cf-turnstile-response")
    if not token or not verify_turnstile(token):
        return jsonify({"success": False, "message": "Капча не пройдена"})

    required_fields = ["fio", "login", "password", "password_retry", "position"]
    if not all(data.get(k) for k in required_fields):
        return jsonify({"success": False, "message": "Заполните все обязательные поля"})

    if data["password"] != data["password_retry"]:
        return jsonify({"success": False, "message": "Пароли не совпадают"})

    if User.query.filter_by(login=data["login"]).first():
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

    session["user_id"] = new_user.id
    return jsonify({"success": True, "redirect": url_for("chat")})


# Фекй пинг для рекламы в другом мессенджере
def get_randomization(text, power):
    homoglyphs = {
        'а': ['a', 'а', 'α', '𝕒', 'а́', 'а̇'], 'б': ['б', 'b', '6', '♭', '𝕓'],
        'в': ['в', 'b', 'v', '𝕧', 'ʙ'], 'г': ['г', 'r', 'g', '𝕘', 'г̓'],
        'д': ['д', 'd', '𝕕', '∂'], 'е': ['е', 'e', 'е́', '℮', '𝕖', 'є'],
        'з': ['з', '3', 'z', '𝕫'], 'и': ['и', 'u', 'i', '𝕚', 'і'],
        'к': ['к', 'k', '𝕜', 'қ'], 'л': ['л', 'l', '𝕝', 'љ'],
        'м': ['м', 'm', '𝕞', 'ʍ'], 'н': ['н', 'n', 'h', '𝕟', 'ң'],
        'о': ['о', 'o', '0', 'ο', '𝕠', 'о̇'], 'п': ['п', 'n', 'π', '𝕡'],
        'р': ['р', 'p', 'ρ', '𝕡'], 'с': ['с', 'c', '𝕔', 'ç'],
        'т': ['т', 't', '𝕥', 'τ'], 'у': ['у', 'y', 'γ', '𝕪'],
        'х': ['х', 'x', '𝕩', 'х̇'], 'ч': ['ч', '4', 'ҷ'],

        'a': ['a', 'а', 'α', '𝕒', 'а́'], 'b': ['b', 'в', '8', '𝕓', 'ʙ'],
        'c': ['c', 'с', 'ç', '𝕔', 'с̇'], 'd': ['d', 'ԁ', '𝕕', 'đ'],
        'e': ['e', 'е', '℮', '𝕖', 'ё'], 'f': ['f', '𝕗', 'ƒ'],
        'g': ['g', '𝕘', 'ԍ', 'ｇ'], 'h': ['h', 'н', '𝕙', 'һ'],
        'i': ['i', 'і', '𝕚', '1', 'ι'], 'j': ['j', 'ј', '𝕛'],
        'k': ['k', 'к', '𝕜', 'κ'], 'l': ['l', '𝕝', 'ӏ', 'ǀ'],
        'm': ['m', 'м', '𝕞', 'ʍ'], 'n': ['n', 'п', '𝕟', 'η'],
        'o': ['o', 'о', '0', '𝕠', 'ο'], 'p': ['p', 'р', '𝕡', 'ρ'],
        'q': ['q', '𝕢', 'ԛ'], 'r': ['r', 'г', '𝕣', 'ʀ'],
        's': ['s', '𝕤', 'ѕ', 'ś'], 't': ['t', 'т', '𝕥', 'τ'],
        'u': ['u', 'и', '𝕦', 'μ'], 'v': ['v', 'ѵ', '𝕧', 'ν'],
        'w': ['w', '𝕨', 'ѡ'], 'x': ['x', 'х', '𝕩', 'ҳ'],
        'y': ['y', 'у', '𝕪', 'ү'], 'z': ['z', '𝕫', 'ᴢ'],

        '0': ['0', 'O', 'Ο', '𝕠', 'zero'], '1': ['1', 'I', 'l', '𝕚', 'і'],
        '2': ['2', 'ℤ', 'ᒿ'], '3': ['3', 'з', 'Ӡ', 'ʒ'],
        '4': ['4', 'ч', 'Ꮞ'], '5': ['5', 'Ƽ', '𝟝'],
        '6': ['6', 'б', 'б'], '7': ['7', '7', '𝟕'],
        '8': ['8', 'B', '𝟠', 'Ȣ'], '9': ['9', 'q', '𝟡']
    }

    invisible_chars = ['\u200B', '\u200C', '\u200D', '\u2060']
    result = []

    for char in text:
        if char in [':', '/', '.', '?', '=', '&', '+']:
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
        return "127.0.0.1"


def verify_key(key):
    if not key:
        return False
    try:
        server_name = os.getenv("SERVER_NAME", "Tornado")
        secret_salt = os.getenv("LICENSE_SALT")
        current_ip = get_ip()

        raw_string = f"{current_ip}:{server_name}:{secret_salt}"
        expected_key = hashlib.sha256(raw_string.encode()).hexdigest()

        return key == expected_key
    except Exception:
        return False


@app.route("/api/ping")
def ping():
    try:
        open_key = os.getenv("SERVER_OPENKEY")
        is_verified = verify_key(open_key)
        verify_env = str(os.getenv("SERVER_VERIFY", "false")).lower()

        return jsonify({
            "ok": True,
            "name": os.getenv("SERVER_NAME"),
            "verify": is_verified,
            "verify_key": open_key if verify_env == "true" else None
        })
    except Exception as error:
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
            return jsonify({"success": True, "redirect": url_for("chat")})

        return jsonify({"success": False, "message": "Неверный логин или пароль"})

    return render_template("login.html", site_key=os.getenv("TURNSTILE_SITEKEY", "1"))


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

    return render_template("chat.html", current_user=user)


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


@app.errorhandler(404)
def page_not_found(e):
    return render_template('error.html', error_code=404), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('error.html', error_code=500), 500

@app.errorhandler(403)
def perm_defended(e):
    return render_template('error.html', error_code=403), 403


if __name__ == "__main__":
    check_github_updates()
    app.run(debug=True, port=3000, host="0.0.0.0")