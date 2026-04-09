from datetime import datetime
from flask import jsonify, request, render_template, send_file, session
from openpyxl.styles.builtins import output
from config import logger, Config
from models import db, User
from utils import get_randomization, verify_key
import random
from models.codes import CodeQu


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
            return jsonify({"ok": False, "error": "Error"})

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

    @app.route("/api/user/ide_status", methods=["GET"])
    def ide_status():
        user_id = request.args.get("user_id", "").strip()
        if not user_id:
            return jsonify({"ok": False, "error": "Неверный user_id"}), 400

        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"ok": False, "error": "Неверный user_id"}), 400

        return jsonify({"ok": True, "ide_connected": bool(user.ide_connected)})

    @app.route("/api/code/run", methods=["POST", "GET"])
    def code_run():
        user_id = request.args.get("user_id", "").strip()
        code = request.args.get("code", "").strip()

        if CodeQu.query.filter_by(user_id=user_id, output="___PENDING___").count() > 5:
            return jsonify({"ok": False, "error": "Превышено количество активных запросов"})

        entry = CodeQu(user_id=user_id, code=code, output="___PENDING___")
        db.session.add(entry)
        db.session.commit()

        return jsonify({"ok": True, "id": entry.id})

    @app.route("/api/code/status", methods=["GET"])
    def code_status():
        entry_id = request.args.get("id", type=int)
        if not entry_id:
            return jsonify({"ok": False, "error": "id не введен"}), 400

        entry = db.session.get(CodeQu, entry_id)
        if not entry:
            return jsonify({"ok": False, "error": "Не найдено"}), 404

        return jsonify({"ok": True, "output": entry.output})

    @app.route("/api/code/complete", methods=["POST", "GET"])
    def code_complete():
        data = request.get_json(silent=True) or {}
        entry_id = data.get("id")
        ide_token = (data.get("ide_token") or "").strip()

        output = data.get("output", "")
        if isinstance(output, str):
            output = output.strip()

        if not entry_id or not ide_token:
            return jsonify({"ok": False, "error": "id или ide_token не введен"}), 400

        entry = db.session.get(CodeQu, entry_id)
        if not entry:
            return jsonify({"ok": False, "error": "Не найдено"}), 404

        if not entry.user or entry.user.ide_token != ide_token:
            return jsonify({"ok": False, "error": "Неверный токен"}), 403

        entry.output = output
        db.session.commit()

        return jsonify({"ok": True})

    @app.route("/api/code/pending", methods=["GET"])
    def code_pending():
        token = request.args.get("token", "").strip()
        if not token:
            return jsonify({"ok": False, "error": "Необходим токен"}), 400

        user = User.query.filter_by(ide_token=token).first()
        if not user:
            return jsonify({"ok": False, "error": "Запрещенно"}), 403

        now = datetime.utcnow()
        db.session.commit()

        entries = CodeQu.query.filter(
            CodeQu.user_id == user.id
        ).all()

        return jsonify({
            "ok": True,
            "entries": [
                {
                    "id": e.id,
                    "code": e.code,
                    "output": e.output
                }
                for e in entries
            ],
        })
