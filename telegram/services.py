import asyncio
import io
import qrcode
from PIL import ImageDraw
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from telethon import TelegramClient
from telethon.sessions import MemorySession
from config import Config


class TelegramService:
    async def _get_qr_url(self):
        loop = asyncio.get_event_loop()
        client = TelegramClient(MemorySession(), int(Config.TG_API_ID), Config.TG_API_HASH, loop=loop)
        await client.connect()
        qr_login = await client.qr_login()
        return qr_login.url

    def generate_login_qr(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            url = loop.run_until_complete(self._get_qr_url())
            qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=4)
            qr.add_data(url)
            qr.make(fit=True)

            img = qr.make_image(image_factory=StyledPilImage, module_drawer=RoundedModuleDrawer(),
                                eye_drawer=RoundedModuleDrawer()).convert("RGB")

            width, height = img.size
            hole_size = int(width * 0.25)
            left = (width - hole_size) // 2
            top = (height - hole_size) // 2

            draw = ImageDraw.Draw(img)
            draw.rectangle([left, top, left + hole_size, top + hole_size], fill="white")

            img_io = io.BytesIO()
            img.save(img_io, "PNG")
            img_io.seek(0)
            return img_io
        finally:
            loop.close()