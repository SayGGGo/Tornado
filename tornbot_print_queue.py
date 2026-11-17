import json
import logging
import mimetypes
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime

from dotenv import load_dotenv
import tornbot as telebot

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("tornbot-print-queue")

QUEUED = "queued"
STATUS_RU = {QUEUED: "В очереди", "in_progress": "В работе", "done": "Готово", "archived": "В архиве"}
MIME = {".stl": "model/stl", ".stp": "model/step", ".step": "model/step", ".obj": "model/obj", ".3mf": "model/3mf"}
BOT_TOKEN = os.getenv("TORNBOT_TOKEN", "").strip()
PORTAL_URL = os.getenv("PORTAL_URL", "").rstrip("/")
PORTAL_PUBLIC_URL = os.getenv("PORTAL_PUBLIC_URL", PORTAL_URL).rstrip("/")
PORTAL_KEY = os.getenv("PORTAL_SERVICE_TOKEN", "").strip()
ADMIN_IDS = {int(x.strip()) for x in os.getenv("ADMIN_CHAT_IDS", "").replace(";", ",").split(",") if x.strip().lstrip("-").isdigit()}
DEMO_QUEUE = [
    {"shortId": "demo-104", "status": "queued", "firstName": "Алина", "lastName": "Соколова", "group": "8А", "purpose": "Корпус для учебного датчика", "quantity": 2, "comment": "PLA, зелёный", "createdAt": "2026-11-17T09:30:00+00:00", "file": {"name": "sensor-case.stl"}},
    {"shortId": "demo-103", "status": "in_progress", "firstName": "Илья", "lastName": "Морозов", "group": "10Б", "purpose": "Шестерни для робота", "quantity": 6, "createdAt": "2026-11-16T14:10:00+00:00", "file": {"name": "gears.3mf"}},
    {"shortId": "demo-102", "status": "done", "firstName": "Мария", "lastName": "Ким", "group": "7В", "purpose": "Подставка для микроскопа", "quantity": 1, "createdAt": "2026-11-15T11:45:00+00:00"},
]


class PortalError(RuntimeError):
    pass


def api(method, path, payload=None, body=None, headers=None):
    if not PORTAL_URL:
        if method == "GET" and path == "/api/print/requests":
            return {"requests": [item for item in DEMO_QUEUE if item["status"] != "archived"]}
        if path.startswith("/api/print/track/") and method == "GET":
            sid = urllib.parse.unquote(path.rsplit("/", 1)[-1])
            item = next((item for item in DEMO_QUEUE if item["shortId"] == sid), None)
            if item:
                return {"request": item}
            raise PortalError("Заявка не найдена")
        if path.startswith("/api/print/requests/") and method == "PATCH":
            sid = urllib.parse.unquote(path.rsplit("/", 1)[-1])
            item = next((item for item in DEMO_QUEUE if item["shortId"] == sid), None)
            if item:
                item["status"] = (payload or {}).get("status", item["status"])
                return {"request": item}
            raise PortalError("Заявка не найдена")
        raise PortalError("Этот метод недоступен в локальном демо")
    request_headers = {"x-service-key": PORTAL_KEY, "Accept": "application/json"}
    if payload is not None:
        body = json.dumps(payload, ensure_ascii=False).encode()
        request_headers["Content-Type"] = "application/json"
    request_headers.update(headers or {})
    req = urllib.request.Request(PORTAL_URL + path, data=body, headers=request_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            raw = response.read()
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")
        try:
            detail = json.loads(detail).get("error", detail)
        except json.JSONDecodeError:
            pass
        raise PortalError(f"Портал ответил {exc.code}: {detail[:400]}") from exc
    except (urllib.error.URLError, TimeoutError) as exc:
        raise PortalError(f"Портал недоступен: {exc}") from exc
    try:
        return json.loads(raw) if raw else {}
    except json.JSONDecodeError as exc:
        raise PortalError("Портал вернул некорректный JSON") from exc


def request_info(item):
    status = STATUS_RU.get(item.get("status"), "В очереди")
    lines = [f"Заявка #{item.get('shortId', '?')} · {status}",
             f"{item.get('lastName', '')} {item.get('firstName', '')} · {item.get('group', '')}",
             f"{item.get('purpose', 'Без описания')} · {item.get('quantity', 1)} шт."]
    if item.get("comment"):
        lines.append(f"Комментарий: {item['comment']}")
    file = item.get("file") or {}
    if file.get("name"):
        lines.append(f"Файл: {file['name']}")
    url = item.get("driveLink") or file.get("url")
    if url:
        if url.startswith("/"):
            url = PORTAL_PUBLIC_URL + url
        lines.append(f"Файл: {url}")
    if item.get("createdAt"):
        try:
            created = datetime.fromisoformat(item["createdAt"].replace("Z", "+00:00")).astimezone().strftime("%d.%m.%Y %H:%M")
        except (ValueError, TypeError):
            created = item["createdAt"]
        lines.append(f"Создана: {created}")
    return "\n".join(lines)


def action_keyboard(item):
    sid = str(item.get("shortId", ""))
    status = item.get("status", QUEUED)
    keyboard = telebot.types.InlineKeyboardMarkup()
    buttons = []
    if status == QUEUED:
        buttons.append(telebot.types.InlineKeyboardButton("▶ Взять в работу", callback_data=f"work:{sid}"))
    elif status == "in_progress":
        buttons.append(telebot.types.InlineKeyboardButton("✓ Готово", callback_data=f"done:{sid}"))
    if status != "archived":
        buttons.append(telebot.types.InlineKeyboardButton("В архив", callback_data=f"archive:{sid}"))
    if buttons:
        keyboard.add(*buttons)
    keyboard.add(telebot.types.InlineKeyboardButton("↻ Обновить", callback_data=f"show:{sid}"))
    return keyboard


bot = telebot.TeleBot(BOT_TOKEN, api_url=os.getenv("TORNBOT_API", "http://127.0.0.1:3000/api/bot"))


def admin(message):
    return bool(message and message.from_user and message.from_user.id in ADMIN_IDS)


def require_admin(message):
    if admin(message):
        return True
    bot.send_message(message.chat.id, "Доступно только администраторам очереди.", reply_to_message_id=message.message_id)
    return False


@bot.message_handler(commands=["start", "help"])
def start(message):
    if not admin(message):
        bot.send_message(message.chat.id, "Заявки на 3D-печать оформляются на портале. Бот предназначен для команды очереди.")
        return
    bot.send_message(message.chat.id,
        "🔧 Очередь 3D-печати\n\n/queue — новые заявки\n/status НОМЕР — карточка заявки\n/work НОМЕР — взять в работу\n/done НОМЕР — отметить готовой\n/archive НОМЕР — убрать в архив",
        reply_to_message_id=message.message_id)


@bot.message_handler(commands=["queue"])
def queue(message):
    if not require_admin(message):
        return
    try:
        items = api("GET", "/api/print/requests").get("requests") or []
        if not items:
            bot.send_message(message.chat.id, "📭 Очередь пуста.", reply_to_message_id=message.message_id)
            return
        for item in items[:30]:
            bot.send_message(message.chat.id, request_info(item), reply_markup=action_keyboard(item), reply_to_message_id=message.message_id)
            time.sleep(1.1)
    except PortalError as exc:
        bot.send_message(message.chat.id, f"Не удалось загрузить очередь: {exc}")


@bot.message_handler(commands=["status", "work", "done", "archive"])
def request_command(message):
    if not require_admin(message):
        return
    parts = (message.text or "").split(maxsplit=1)
    if len(parts) < 2:
        bot.send_message(message.chat.id, "Укажите короткий номер заявки, например /status a1b2c3d4", reply_to_message_id=message.message_id)
        return
    action, sid = parts[0][1:].lower(), urllib.parse.quote(parts[1].strip().lstrip("#"), safe="")
    try:
        if action != "status":
            status = {"work": "in_progress", "done": "done", "archive": "archived"}[action]
            item = api("PATCH", f"/api/print/requests/{sid}", {"status": status}).get("request", {})
        else:
            item = api("GET", f"/api/print/track/{sid}").get("request", {})
        bot.send_message(message.chat.id, request_info(item), reply_markup=action_keyboard(item), reply_to_message_id=message.message_id)
    except (PortalError, KeyError) as exc:
        bot.send_message(message.chat.id, f"Не удалось обновить заявку: {exc}")


@bot.callback_query_handler()
def button(callback):
    try:
        action, raw_id = callback.data.split(":", 1)
        sid = urllib.parse.quote(raw_id, safe="")
        if action == "show":
            item = api("GET", f"/api/print/track/{sid}").get("request", {})
        else:
            if callback.from_user.id not in ADMIN_IDS:
                bot.answer_callback_query(callback.id, "Только для администраторов")
                return
            status = {"work": "in_progress", "done": "done", "archive": "archived"}[action]
            item = api("PATCH", f"/api/print/requests/{sid}", {"status": status}).get("request", {})
        bot.answer_callback_query(callback.id, "Обновлено")
        bot.edit_message_text(request_info(item), callback.message.chat.id, callback.message.message_id,
                              reply_markup=action_keyboard(item))
    except (PortalError, ValueError, KeyError) as exc:
        bot.answer_callback_query(callback.id, f"Ошибка: {exc}"[:180])


def main():
    missing = [name for name, value in (("TORNBOT_TOKEN", BOT_TOKEN),) if not value]
    if missing:
        raise SystemExit('TORNBOT_TOKEN не задан в .env')
    if not ADMIN_IDS:
        log.warning("ADMIN_CHAT_IDS не задан; админские команды будут закрыты")
    log.info("Queue bot starting in %s mode", "portal" if PORTAL_URL and PORTAL_KEY else "local demo")
    bot.infinity_polling(timeout=20, long_polling_timeout=20)


if __name__ == "__main__":
    main()
