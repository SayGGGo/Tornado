import random
import sys
import os
import time
from datetime import datetime
import hashlib
import socket
import subprocess
import asyncio

try:
    import requests
    from bs4 import BeautifulSoup
    from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_file
    from werkzeug.security import generate_password_hash, check_password_hash
    from markupsafe import escape
except ImportError as lib:
    sys.exit(f"Пожалуйста, установите библиотеку {lib}")

from config import Config, logger, setup_settings
from botapi import register_bot_api
from models import init_models, User, Chat, Message, ChatParticipant, Settings, db
from utils import verify_turnstile, get_groups, get_randomization, verify_key, check_github_updates
from auth import register_auth
from system import register_system
from chat import register_chat
from telegram import register_tg
from admin import register_admin

tg_api = False
if Config.TELEGRAM_API_ACTIVE:
    try:
        from telethon.sync import TelegramClient
        from telethon.sessions import MemorySession
        import qrcode
        from qrcode.image.styledpil import StyledPilImage
        from qrcode.image.styles.moduledrawers import RoundedModuleDrawer, CircleModuleDrawer
        import PIL
        from PIL import ImageDraw
        import io
        tg_api = True
    except ImportError as lib:
        sys.exit(f"Пожалуйста, установите библиотеку {lib} или установите TELEGRAM_API=False в .env")

app = Flask(__name__)
app.config.from_object(Config)
app.config['SECRET_KEY'] = Config.SECRET_KEY

init_models(app)

server_ip_cache = None
groups_cache = {"data": [], "last_updated": 0}

if tg_api:
    logger.info("Teelgram API активен")


if __name__ == "__main__":
    # check_github_updates()
    setup_settings(app, db, Settings)
    register_bot_api(app)
    register_auth(app)
    register_system(app)
    register_chat(app)
    register_tg(app)
    register_admin(app)

    app.run(host=Config.FLASK_HOST,  port=Config.FLASK_PORT)
