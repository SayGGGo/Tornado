from flask import request, jsonify
from config import logger
from .handlers import metod_handlers, DefaultHandler


def register_bot_api(app):
    @app.route('/api/bot<token>/<method>', methods=['GET', 'POST'])
    def bot_api_endpoint(token, method):
        data = request.json if request.is_json else request.values.to_dict()

        handler = metod_handlers.get(method)

        try:
            if handler:
                response_data = handler.handle(token, data)
            else:
                response_data = DefaultHandler().handle(token, method, data)

            return jsonify(response_data), 200

        except:
            logger.error(f"[TORNBOT] Error")
            return jsonify({"ok": False}), 500