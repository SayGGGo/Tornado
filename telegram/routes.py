from flask import jsonify, send_file
from config import logger
from .services import TelegramService

def register_tg(app):
    tg_service = TelegramService()

    @app.route("/api/tg/login", methods=["GET"])
    def generate_qr_from_login():
        try:
            img_io = tg_service.generate_login_qr()
            return send_file(img_io, mimetype="image/png")
        except Exception as error:
            logger.error(f"Ошибка в Telegram API: {error}")
            return jsonify({"success": False, "message": "API недоступен"}), 500