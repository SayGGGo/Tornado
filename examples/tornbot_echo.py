import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import tornbot


bot = tornbot.Bot(os.environ["TORNBOT_TOKEN"], api_url=os.getenv("TORNBOT_API", "http://127.0.0.1:3000/api/bot"))
last_bot_messages = {}


def remember(message):
    last_bot_messages[message.chat.id] = message.message_id
    return message


@bot.message_handler(commands=["start"])
def start(message):
    remember(bot.send_message(message.chat.id, "Привет! Я TornBot. Напиши /help, чтобы увидеть команды."))


@bot.message_handler(commands=["help"])
def help_message(message):
    remember(bot.send_message(message.chat.id, "Команды: /start, /help, /edit, /edit-last, /reply, /buttons. Остальной текст я повторю."))


@bot.message_handler(commands=["edit"])
def edit_message(message):
    sent = bot.send_message(message.chat.id, "Это сообщение будет отредактировано")
    remember(bot.edit_message_text("Сообщение изменено через edit_message_text", message.chat.id, sent.message_id))


@bot.message_handler(commands=["edit-last"])
def edit_last_message(message):
    message_id = last_bot_messages.get(message.chat.id)
    if not message_id:
        remember(bot.send_message(message.chat.id, "Пока нет сообщения бота для изменения. Сначала вызовите /start или /buttons."))
        return
    remember(bot.edit_message_text("Это более раннее сообщение изменено командой /edit-last", message.chat.id, message_id))


@bot.message_handler(commands=["reply"])
def reply_message(message):
    remember(bot.send_message(message.chat.id, "Это ответ с цитатой вашего сообщения.", reply_to_message_id=message.message_id))


@bot.message_handler(commands=["buttons"])
def show_buttons(message):
    keyboard = tornbot.InlineKeyboardMarkup()
    keyboard.add(
        tornbot.InlineKeyboardButton("О боте", callback_data="about"),
        tornbot.InlineKeyboardButton("Возможности API", callback_data="api"),
    )
    keyboard.add(tornbot.InlineKeyboardButton("Изменить это сообщение", callback_data="edit_menu"))
    reply_keyboard = tornbot.ReplyKeyboardMarkup()
    reply_keyboard.add(tornbot.InlineKeyboardButton("/help"), tornbot.InlineKeyboardButton("/reply"))
    markup = {"inline_keyboard": keyboard.inline_keyboard, "keyboard": reply_keyboard.keyboard}
    remember(bot.send_message(message.chat.id, "Демо inline- и reply-клавиатур. Нажмите кнопку:", reply_markup=markup))


@bot.message_handler(commands=["keyboard"])
def show_reply_keyboard(message):
    keyboard = tornbot.ReplyKeyboardMarkup()
    keyboard.add(tornbot.InlineKeyboardButton("/help"), tornbot.InlineKeyboardButton("/reply"))
    remember(bot.send_message(message.chat.id, "Демо reply-клавиатуры. Нажмите кнопку:", reply_markup=keyboard))


@bot.callback_query_handler()
def inline_action(callback):
    if callback.data == "about":
        bot.answer_callback_query(callback.id, "Это локальный TornBot")
        remember(bot.send_message(callback.message.chat.id, "TornBot — бот внутри вашей организации.", reply_to_message_id=callback.message.message_id))
    elif callback.data == "api":
        bot.answer_callback_query(callback.id, "Поддерживаются callbacks")
        remember(bot.send_message(callback.message.chat.id, "API: getMe, getUser, getChat, getChatMember, getUpdates, sendMessage, editMessageText, deleteMessage и клавиатуры.", reply_to_message_id=callback.message.message_id))
    elif callback.data == "edit_menu":
        bot.answer_callback_query(callback.id, "Обновляю сообщение")
        remember(bot.edit_message_text("Ранее отправленное меню изменено через callback.", callback.message.chat.id, callback.message.message_id))


@bot.message_handler(func=lambda message: bool(message.text))
def echo(message):
    remember(bot.send_message(message.chat.id, f"Вы написали: {message.text}"))


bot.polling(none_stop=True, timeout=20)
