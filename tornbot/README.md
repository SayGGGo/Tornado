# tornbot

TeleBot-style Python client for the organization-local Tornado Bot API. It supports `import tornbot` / `tornbot.TeleBot(...)`, command and callback handlers, polling, inline keyboards, message send/edit/delete, and bot profile methods.

```python
import os
import tornbot as telebot

bot = telebot.TeleBot(os.environ["TORNBOT_TOKEN"])

@bot.message_handler(commands=["start"])
def start(message):
    keyboard = telebot.types.InlineKeyboardMarkup()
    keyboard.add(telebot.types.InlineKeyboardButton("Help", callback_data="help"))
    bot.send_message(message.chat.id, "Hello", reply_markup=keyboard)

bot.infinity_polling()
```

This client targets Tornado's own API, not Telegram's servers. The two services issue different tokens and are not interchangeable. It is not a complete implementation of every pyTelegramBotAPI method.
