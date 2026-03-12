import logging
import sys
from .settings import Config


class NoApiFilter(logging.Filter):
    def filter(self, record):
        msg = record.getMessage()
        return "/api/messages" not in msg and "/api/chats" not in msg


def setup_logger():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )

    logger = logging.getLogger(Config.SERVER_NAME_PING)
    werkzeug_logger = logging.getLogger("werkzeug")
    werkzeug_logger.setLevel(logging.INFO)

    api_filter = NoApiFilter()
    logger.addFilter(api_filter)
    werkzeug_logger.addFilter(api_filter)

    return logger