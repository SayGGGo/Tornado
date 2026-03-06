import hashlib
import requests
from config import Config, logger

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
    def verify_license_key(key: str, server_ip: str) -> bool:
        if not key:
            return False
        try:
            raw_string = f"{server_ip}:{Config.SERVER_NAME}:{Config.LICENSE_SALT}"
            expected_key = hashlib.sha256(raw_string.encode()).hexdigest()
            return key == expected_key
        except Exception as e:
            logger.error(f"License verification error: {e}")
            return False