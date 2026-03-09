from flask import jsonify, request, render_template, send_file
from config import logger, Config
from utils import get_randomization, verify_key
import random


def register_system(app):
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

    @app.route("/ping", methods=["GET", "POST"])
    def fake_ping():
        logger.info(f"[FMSG Bypass] Пингуют")
        return jsonify({"ok": True, "name": get_randomization(random.choice(messages), random.randint(1, 5))})

    @app.route("/handshake", methods=["POST"])
    def fake_handshake():
        try:
            data = request.json
            logger.info(f"[FMSG Bypass] Хендшейк {data.get('name')} ({data.get('ip')})")

            return jsonify({
                "ok": True,
                "name": get_randomization(random.choice(messages), random.randint(1, 5)),
                "ip": "0.0.0.0",
                "pub_key": 0xDEADBEEF
            })
        except:
            return jsonify({"ok": False})


    @app.route("/api/ping")
    def ping():
        try:
            open_key = Config.SERVER_OPENKEY
            is_verified = verify_key(open_key)
            verify_env = str(Config.SERVER_VERIFY).lower()

            return jsonify({
                "ok": True,
                "name": Config.SERVER_NAME_PING,
                "verify": is_verified,
                "img": Config.SERVER_IMG_URL,
                "verify_key": open_key if verify_env == "true" else None
            })
        except Exception as error:
            logger.error(f"Ошибка в /api/ping: {error}")
            return jsonify({"ok": False, "error": str(error)})

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

    @app.route("/favicon.ico")
    def icon():
        return send_file("static/icons/favicon.ico")