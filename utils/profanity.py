import re
import time
import threading
import unicodedata

try:
    import requests as _requests
    _REQUESTS_OK = True
except ImportError:
    _REQUESTS_OK = False

_CACHE = {"abusive": [], "curse": [], "exceptions": [], "ts": 0}
_CACHE_TTL = 86400
_LOCK = threading.Lock()

_ABUSIVE_URL = "https://gitverse.ru/api/repos/ddfdi/russian_ban_words/raw/branch/main/ru_abusive_words.txt"
_CURSE_URL = "https://gitverse.ru/api/repos/ddfdi/russian_ban_words/raw/branch/main/ru_curse_words.txt"
_EXCEPT_URL = "https://gitverse.ru/api/repos/ddfdi/russian_ban_words/raw/branch/main/ru_exception_words.txt"

_CHAR_MAP = {
    'a': 'а', 'e': 'е', 'o': 'о', 'c': 'с', 'x': 'х', 'p': 'р', 'y': 'у',
    'k': 'к', 'b': 'б', 'h': 'х', 'n': 'н', 'm': 'м', 't': 'т', 'u': 'у',
    'i': 'и', 'v': 'в', 'g': 'г', 'z': 'з', 'd': 'д', 'f': 'ф', 'l': 'л',
    'j': 'й', 'q': 'к', 'w': 'в',
    '0': 'о', '3': 'з', '@': 'а', '$': 'с', '4': 'ч', '6': 'б', '9': 'р',
    '1': 'и', '!': 'и', '|': 'и', '8': 'в', '5': 'б', '7': 'т',
    '+': 'т', '*': '',
}

_ANTI67_RE = re.compile(
    r'(?:'
    r'6[\s\W_]{0,5}7'
    r'|six[\s\S]{0,30}seven'
    r'|s[\s*_\-]{0,3}i[\s*_\-]{0,3}x[\s*_\-]{0,3}s[\s*_\-]{0,3}e[\s*_\-]{0,3}v[\s*_\-]{0,3}e[\s*_\-]{0,3}n'
    r'|шесть[\s\S]{0,30}семь'
    r'|шестьдесят[\s\S]{0,30}семь'
    r'|ш[\s*_]{0,2}е[\s*_]{0,2}с[\s*_]{0,2}т[\s*_]{0,2}ь[\s*_]{0,2}с[\s*_]{0,2}е[\s*_]{0,2}м[\s*_]{0,2}ь'
    r')',
    re.IGNORECASE | re.UNICODE
)


def _fetch_words(url):
    if not _REQUESTS_OK:
        return []
    try:
        r = _requests.get(url, timeout=10)
        if r.status_code == 200:
            return [line.strip().lower() for line in r.text.splitlines() if line.strip()]
    except Exception:
        pass
    return []


def _ensure_loaded():
    with _LOCK:
        if time.time() - _CACHE["ts"] > _CACHE_TTL:
            abusive = _fetch_words(_ABUSIVE_URL)
            curse = _fetch_words(_CURSE_URL)
            exceptions = _fetch_words(_EXCEPT_URL)
            if abusive or curse:
                _CACHE["abusive"] = abusive
                _CACHE["curse"] = curse
                _CACHE["exceptions"] = exceptions
                _CACHE["ts"] = time.time()


def _normalize(text):
    text = text.lower()
    text = unicodedata.normalize('NFKD', text)
    result = []
    for ch in text:
        mapped = _CHAR_MAP.get(ch)
        if mapped is not None:
            if mapped:
                result.append(mapped)
        elif ch.isalpha():
            result.append(ch)
    joined = ''.join(result)
    collapsed = re.sub(r'(.)\1{2,}', r'\1', joined)
    return collapsed


def _normalize_text(text):
    return _normalize(text)


def _word_matches(norm_word, norm_text):
    if not norm_word or len(norm_word) < 3:
        return False
    if norm_word in norm_text:
        return True
    root = norm_word[:-2] if len(norm_word) > 5 else norm_word[:-1] if len(norm_word) > 3 else norm_word
    if len(root) >= 3 and root in norm_text:
        return True
    return False


def _has_obfuscation(original_word, original_text_lower):
    return _normalize(original_word) not in original_text_lower.replace(' ', '')


def check_profanity(text):
    if not text or not text.strip():
        return None

    _ensure_loaded()

    abusive = _CACHE["abusive"]
    curse = _CACHE["curse"]
    exceptions = set(_CACHE["exceptions"])
    norm_exceptions = {_normalize(w) for w in exceptions if _normalize(w)}
    exception_roots = {w[:-1] if len(w) > 3 else w for w in norm_exceptions}

    norm_text = _normalize(text)
    original_lower = text.lower()

    for word in abusive:
        if word in exceptions:
            continue
        norm_word = _normalize(word)
        if not norm_word or len(norm_word) < 3:
            continue
        norm_root = norm_word[:-2] if len(norm_word) > 5 else norm_word[:-1] if len(norm_word) > 3 else norm_word
        if norm_word in norm_exceptions or norm_root in exception_roots:
            continue
        if _word_matches(norm_word, norm_text):
            level = 3 if _has_obfuscation(word, original_lower) else 2
            return {"level": level, "word": word, "is_auto": True}

    for word in curse:
        if word in exceptions:
            continue
        norm_word = _normalize(word)
        if not norm_word or len(norm_word) < 3:
            continue
        norm_root = norm_word[:-2] if len(norm_word) > 5 else norm_word[:-1] if len(norm_word) > 3 else norm_word
        if norm_word in norm_exceptions or norm_root in exception_roots:
            continue
        if _word_matches(norm_word, norm_text):
            level = 2 if _has_obfuscation(word, original_lower) else 1
            return {"level": level, "word": word, "is_auto": True}

    return None


def check_anti67(text):
    if not text:
        return False
    return bool(_ANTI67_RE.search(text))
