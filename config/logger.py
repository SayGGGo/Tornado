import logging
import sys
from .settings import Config


class NoApiFilter(logging.Filter):
    def filter(self, record):
        msg = record.getMessage()
        if " 429 " in msg: return False
        return "/api/messages" not in msg and "/api/chats" not in msg


def setup_logger():
    from logging.handlers import RotatingFileHandler
    
    file_handler = RotatingFileHandler("app-trn.log", maxBytes=5000000, backupCount=5, encoding="utf-8")
    file_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
    
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))

    logging.basicConfig(
        level=logging.INFO,
        handlers=[file_handler, stream_handler]
    )

    logger = logging.getLogger(Config.SERVER_NAME_PING)
    werkzeug_logger = logging.getLogger("werkzeug")
    werkzeug_logger.setLevel(logging.INFO)

    api_filter = NoApiFilter()
    logger.addFilter(api_filter)
    werkzeug_logger.addFilter(api_filter)

    return logger