import socket
import time
import requests
from bs4 import BeautifulSoup
from config import logger


class NetworkTools:
    _ip_cache = None

    @classmethod
    def get_server_ip(cls) -> str:
        if cls._ip_cache:
            return cls._ip_cache
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
                s.settimeout(2)
                s.connect(("8.8.8.8", 80))
                cls._ip_cache = s.getsockname()[0]
            return cls._ip_cache
        except Exception:
            return "127.0.0.1"


class GroupScraper:
    def __init__(self):
        self.cache = {"data": [], "last_updated": 0}
        self.url = "https://genius-school.kuzstu.ru/%D1%80%D0%B0%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5/"

    def fetch_groups(self):
        current_time = time.time()
        if self.cache["data"] and (current_time - self.cache["last_updated"] < 3600):
            return self.cache["data"]

        try:
            res = requests.get(self.url, timeout=10)
            res.raise_for_status()
            res.encoding = "utf-8"
            soup = BeautifulSoup(res.text, "html.parser")

            groups = [
                {"name": link.get_text(strip=True), "value": link.get_text(strip=True).lower().replace(" ", "_")}
                for link in soup.select("table a") if link.get_text(strip=True)
            ]

            if groups:
                self.cache.update({"data": groups, "last_updated": current_time})
                return groups
        except Exception as e:
            logger.error(f"Scraper error: {e}")
            return self.cache["data"] or [{"name": "Ошибка загрузки", "value": "error"}]