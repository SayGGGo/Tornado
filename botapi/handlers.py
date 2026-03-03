from config import logger

class BotMethodHandler:
    def handle(self, token: str, data: dict):
        raise NotImplementedError("Метод handle должен быть переопределен")


class SendMessageHandler(BotMethodHandler):
    def handle(self, token: str, data: dict):
        logger.info(f"[TORNBOT] Метод SendMessage из токена {token}")
        return {"ok": True}


class GetUpdatesHandler(BotMethodHandler):
    def handle(self, token: str, data: dict):
        logger.info(f"[TORNBOT] Метод getUpdates из токена {token}")
        return {"ok": True}


class DefaultHandler:
    def handle(self, token: str, method: str, data: dict):
        logger.info(f"[TORNBOT] Метод {method} из токена {token}")
        return {"ok": True}

metod_handlers = {
    "sendMessage": SendMessageHandler(),
    "getUpdates": GetUpdatesHandler(),
}