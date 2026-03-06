import asyncio
import io

import qrcode
from PIL import ImageDraw
from flask import jsonify, send_file
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from telethon import TelegramClient
from telethon.sessions import MemorySession
from config import Config, logger


def register_tg(app):
    async def get_qr_from_login(client):
        await client.connect()
        qr_login = await client.qr_login()
        return qr_login.url

    @app.route("/api/tg/login", methods=["GET"])
    def generate_qr_from_login():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            client = TelegramClient(MemorySession(), int(Config.TG_API_ID), Config.TG_API_HASH, loop=loop)
        except:
            return jsonify({"success": False, "message": "API недоступен"}), 500

        try:
            url = loop.run_until_complete(get_qr_from_login(client))

            qr = qrcode.QRCode(
                error_correction=qrcode.constants.ERROR_CORRECT_H,
                box_size=10,
                border=4,
            )
            qr.add_data(url)
            qr.make(fit=True)

            img = qr.make_image(
                image_factory=StyledPilImage,
                module_drawer=RoundedModuleDrawer(),
                eye_drawer=RoundedModuleDrawer()).convert("RGB")

            width, height = img.size

            hole_size_ratio = 0.25
            hole_w = int(width * hole_size_ratio)
            hole_h = int(height * hole_size_ratio)

            left = (width - hole_w) // 2
            top = (height - hole_h) // 2
            right = (width + hole_w) // 2
            bottom = (height + hole_h) // 2

            draw = ImageDraw.Draw(img)
            draw.rectangle([left, top, right, bottom], fill="white")

            img_io = io.BytesIO()
            img.save(img_io, "PNG")
            img_io.seek(0)

            return send_file(img_io, mimetype="image/png")
        except Exception as error:
            logger.error(f"Ошибка: {error}")
            return jsonify({"success": False, "message": "API недоступен"}), 500
        finally:
            loop.close()