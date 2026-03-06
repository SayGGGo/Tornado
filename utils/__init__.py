from .text import TextObfuscator
from .security import SecurityManager
from .network import NetworkTools, GroupScraper
from .versioning import VersionControl


def get_randomization(text, power):
    return TextObfuscator().randomize(text, power)

def get_groups():
    return GroupScraper().fetch_groups()

def verify_turnstile(token):
    return SecurityManager().verify_turnstile(token)

def get_ip():
    return NetworkTools.get_server_ip()

def verify_key(key):
    return SecurityManager().verify_license_key(key, get_ip())

def check_github_updates():
    VersionControl.check_updates("SayGGGo/Tornado", "0.0.1")

__all__ = [
    "get_randomization",
    "get_groups",
    "get_ip",
    "verify_key",
    "verify_turnstile",
    "check_github_updates"
]