import time
from dataclasses import dataclass, field

import requests


class ApiException(RuntimeError):
    pass


@dataclass
class User:
    id: int
    is_bot: bool = False
    first_name: str = ""
    username: str = ""


@dataclass
class Chat:
    id: int
    type: str = "private"
    title: str = ""


@dataclass
class Message:
    message_id: int
    date: int
    chat: Chat
    from_user: User
    text: str = ""
    reply_to_message: object = None
    edit_date: int = None
    reply_markup: dict = None


@dataclass
class Update:
    update_id: int
    message: Message = None
    callback_query: object = None


@dataclass
class CallbackQuery:
    id: str
    from_user: User
    message: Message
    data: str = ""


@dataclass
class InlineKeyboardButton:
    text: str
    callback_data: str = None
    url: str = None


@dataclass
class ReplyKeyboardMarkup:
    keyboard: list = field(default_factory=list)
    resize_keyboard: bool = True

    def add(self, *buttons):
        self.keyboard.append([{"text": getattr(button, "text", str(button))} for button in buttons])
        return self


@dataclass
class InlineKeyboardMarkup:
    inline_keyboard: list = field(default_factory=list)

    def add(self, *buttons):
        self.inline_keyboard.append([{key: value for key, value in button.__dict__.items() if value is not None} for button in buttons])
        return self


class Bot:
    """Small telebot-compatible client for Tornado's Bot API."""

    def __init__(self, token, parse_mode=None, api_url="http://127.0.0.1:3000/api/bot"):
        self.token = token
        self.parse_mode = parse_mode
        self.api_url = api_url.rstrip("/") + token + "/"
        self.handlers = []
        self._offset = int(__import__("os").getenv("TORNBOT_OFFSET", "0"))
        self._running = False

    def _call(self, method, data=None):
        response = requests.post(self.api_url + method, json=data or {}, timeout=35)
        payload = response.json()
        if not payload.get("ok"):
            raise ApiException(payload.get("description", "Bot API request failed"))
        return payload.get("result")

    @staticmethod
    def _message(raw):
        if not raw:
            return None
        return Message(raw["message_id"], raw.get("date", 0), Chat(**raw["chat"]), User(**raw["from"]), raw.get("text", ""), reply_to_message=Bot._message(raw.get("reply_to_message")), edit_date=raw.get("edit_date"), reply_markup=raw.get("reply_markup"))

    def get_me(self):
        raw = self._call("getMe")
        return User(**raw)

    def get_user(self, user_id):
        return User(**self._call("getUser", {"user_id": user_id}))

    def get_chat_member(self, chat_id, user_id):
        return self._call("getChatMember", {"chat_id": chat_id, "user_id": user_id})

    def get_updates(self, offset=None, limit=100, timeout=0):
        data = {"limit": limit, "timeout": timeout}
        if offset is not None:
            data["offset"] = offset
        return self._call("getUpdates", data)

    def get_my_name(self):
        return self._call("getMyName")

    def set_my_name(self, name):
        return self._call("setMyName", {"name": name})

    def get_my_description(self):
        return self._call("getMyDescription")

    def set_my_description(self, description):
        return self._call("setMyDescription", {"description": description})

    def set_my_profile_photo(self, photo_url):
        return self._call("setMyProfilePhoto", {"photo_url": photo_url})

    def send_message(self, chat_id, text, **kwargs):
        markup = kwargs.get("reply_markup")
        if isinstance(markup, InlineKeyboardMarkup):
            kwargs["reply_markup"] = {"inline_keyboard": markup.inline_keyboard}
        elif isinstance(markup, ReplyKeyboardMarkup):
            kwargs["reply_markup"] = {"keyboard": markup.keyboard, "resize_keyboard": markup.resize_keyboard}
        raw = self._call("sendMessage", {"chat_id": chat_id, "text": text, **kwargs})
        return self._message(raw)

    def edit_message_text(self, text, chat_id=None, message_id=None, **kwargs):
        return self._message(self._call("editMessageText", {"text": text, "chat_id": chat_id, "message_id": message_id, **kwargs}))

    def edit_message_reply_markup(self, chat_id=None, message_id=None, reply_markup=None):
        if isinstance(reply_markup, InlineKeyboardMarkup):
            reply_markup = {"inline_keyboard": reply_markup.inline_keyboard}
        return self._message(self._call("editMessageReplyMarkup", {"chat_id": chat_id, "message_id": message_id, "reply_markup": reply_markup}))

    def delete_message(self, chat_id, message_id):
        return self._call("deleteMessage", {"chat_id": chat_id, "message_id": message_id})

    def get_chat(self, chat_id):
        return Chat(**self._call("getChat", {"chat_id": chat_id}))

    def send_chat_action(self, chat_id, action):
        return self._call("sendChatAction", {"chat_id": chat_id, "action": action})

    def answer_callback_query(self, callback_query_id, text=None, **kwargs):
        return self._call("answerCallbackQuery", {"callback_query_id": callback_query_id, "text": text, **kwargs})

    def message_handler(self, commands=None, func=None, content_types=None, **kwargs):
        def register(handler):
            self.handlers.append((handler, commands, func))
            return handler
        return register

    def callback_query_handler(self, func=None, **kwargs):
        if not hasattr(self, "callback_handlers"):
            self.callback_handlers = []
        def register(handler):
            self.callback_handlers.append((handler, func))
            return handler
        return register

    def polling(self, none_stop=True, interval=0, timeout=20, **kwargs):
        self._running = True
        while self._running:
            try:
                for item in self._call("getUpdates", {"offset": self._offset, "timeout": timeout}):
                    self._offset = item["update_id"] + 1
                    raw = item.get("message")
                    message = self._message(raw)
                    if message:
                        update = Update(item["update_id"], message)
                        for handler, commands, predicate in self.handlers:
                            if commands and message.text.startswith("/"):
                                matched = message.text[1:].split()[0] in commands
                            else:
                                matched = not commands
                            if matched and (predicate is None or predicate(message)):
                                handler(message)
                    raw_callback = item.get("callback_query")
                    if raw_callback:
                        callback = CallbackQuery(
                            str(raw_callback["id"]), User(**raw_callback["from"]),
                            self._message(raw_callback.get("message")), str(raw_callback.get("data", ""))
                        )
                        for handler, predicate in getattr(self, "callback_handlers", []):
                            if predicate is None or predicate(callback):
                                handler(callback)
                if interval:
                    time.sleep(interval)
            except Exception:
                if not none_stop:
                    raise
                time.sleep(max(interval, 1))

    def stop_polling(self):
        self._running = False


types = type("types", (), {"InlineKeyboardMarkup": InlineKeyboardMarkup, "InlineKeyboardButton": InlineKeyboardButton, "ReplyKeyboardMarkup": ReplyKeyboardMarkup})
