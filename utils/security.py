import hashlib
import requests
from datetime import datetime
from flask import request
from config import Config, logger
from models import db
from models.server import CaptchaStats
from .network import NetworkTools


class CaptchaManager:
    @staticmethod
    def get_current_stats():
        now = datetime.now()
        stats = CaptchaStats.query.filter_by(month=now.month, year=now.year).first()
        if not stats:
            stats = CaptchaStats(month=now.month, year=now.year, count=0)
            db.session.add(stats)
            db.session.commit()
        return stats

    @staticmethod
    def increment_usage():
        stats = CaptchaManager.get_current_stats()
        stats.count += 1
        db.session.commit()

    @staticmethod
    def get_active_provider():
        has_yandex = True if Config.YANDEX_SITEKEY != "0" and Config.YANDEX_SERVER != "0" else False
        has_turnstile = True if Config.TURNSTILE_SITEKEY != "0" and Config.TURNSTILE_SECRET != "0" else False

        if has_yandex and has_turnstile:
            if CaptchaManager.get_current_stats().count < 7500: # Фри тариф 10К, запас 2.5К
                return "yandex", Config.YANDEX_SITEKEY
            return "turnstile", Config.TURNSTILE_SITEKEY

        elif has_yandex:
            return "yandex", Config.YANDEX_SITEKEY
        elif has_turnstile:
            return "turnstile", Config.TURNSTILE_SITEKEY

        return None, None


class SecurityManager:
    @staticmethod
    def verify_turnstile(token: str) -> bool:
        if not token:
            return False
        url = "https://challenges.cloudflare.com/turnstile/v0/siteverify"
        data = {"secret": Config.TURNSTILE_SECRET, "response": token}
        try:
            response = requests.post(url, data=data, timeout=5)
            return response.json().get("success", False)
        except requests.RequestException as e:
            logger.error(f"Turnstile error: {e}")
            return False

    @staticmethod
    def verify_yandex(token: str, ip: str) -> bool:
        if not token:
            return False
        url = "https://smartcaptcha.yandexcloud.net/validate"
        params = {
            "secret": Config.YANDEX_SERVER,
            "token": token,
            "ip": ip
        }
        try:
            response = requests.get(url, params=params, timeout=5)
            if response.status_code != 200:
                return True

            result = response.json().get("status") == "ok"
            if result:
                CaptchaManager.increment_usage()
            return result
        except Exception as e:
            logger.error(f"Yandex SmartCaptcha error: {e}")
            return True

    @staticmethod
    def verify_captcha(data: dict) -> bool:
        provider, _ = CaptchaManager.get_active_provider()
        if not provider:
            return True

        yandex_token = data.get("smart-token")
        turnstile_token = data.get("cf-turnstile-response")

        if yandex_token:
            return SecurityManager.verify_yandex(yandex_token, request.remote_addr)
        elif turnstile_token:
            return SecurityManager.verify_turnstile(turnstile_token)

        return False

    @staticmethod
    def verify_license_key(key: str, server_ip: str) -> bool:
        if not key:
            return False
        try:
            raw_string = f"{server_ip}:{Config.SERVER_NAME_PING}:{Config.LICENSE_SALT}"
            expected_key = hashlib.sha256(raw_string.encode()).hexdigest()
            return key == expected_key
        except Exception as e:
            logger.error(f"License verification error: {e}")
            return False

class DDoSGuard:
    _p = {}
    _b = {}
    _h = {}
    _ua_blacklist = ['python-requests', 'curl', 'wget', 'scrapy', 'selenium', 'headless', 'phantomjs', 'postman', 'aiohttp', 'httpx']

    @classmethod
    def check(cls, ip, ua, method, path, ref, uid=None, sid=None):
        import time
        n = time.time()
        
        target = f"{ip}:{uid or sid or 'anon'}"
        
        if path.startswith('/static/'):
            cls._h[target] = n + 3600
            return True

        ua = (ua or "").lower()
        if any(bot in ua for bot in cls._ua_blacklist) or (not ua and not uid):
            cls._b[target] = n + 86400
            return False

        if target in cls._b:
            if n < cls._b[target]: return False
            del cls._b[target]

        if method == "POST" and path in ['/login', '/register', '/auth/login', '/auth/register']:
            if target not in cls._h and not uid:
                cls._b[target] = n + 1800
                return False

        if ip not in cls._p: cls._p[ip] = []
        cls._p[ip] = [t for t in cls._p[ip] if n - t < 10]
        cls._p[ip].append(n)
        
        limit = 500 if uid else 60
        if len(cls._p[ip]) > limit:
            cls._b[target] = n + 600
            return False
            
        return True