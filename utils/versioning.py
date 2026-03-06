import subprocess
import requests
from config import logger

class VersionControl:
    @staticmethod
    def get_local_commit() -> str:
        try:
            return subprocess.run(['git', 'rev-parse', '--short', 'HEAD'],
                                  capture_output=True, text=True, check=True).stdout.strip()
        except Exception:
            return "unknown"

    @staticmethod
    def check_updates(repo_path: str, current_version: str):
        headers = {"Accept": "application/vnd.github.v3+json"}
        try:
            url = f"https://api.github.com/repos/{repo_path}/releases"
            res = requests.get(url, headers=headers, timeout=5)
            if res.status_code == 200 and res.json():
                latest = res.json()[0].get("tag_name")
                if latest != current_version:
                    logger.warning(f"Update available: {latest}")
        except Exception as e:
            logger.error(f"Update check failed: {e}")