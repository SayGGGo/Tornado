import logging
from datetime import datetime
import base64
import os
import uuid
import hmac
import hashlib
import time as _time
from collections import defaultdict
from markupsafe import escape
from models import Message, Chat, ChatParticipant, db, User
from sqlalchemy import or_
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from config import Config
from agora_token_builder import RtcTokenBuilder
from werkzeug.utils import secure_filename
import time

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'webm', 'mp3', 'ogg', 'wav', 'pdf', 'doc', 'docx', 'zip', 'rar', 'txt', 'csv', 'xls', 'xlsx'}
MAX_FILE_SIZE = 50 * 1024 * 1024
IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
VIDEO_EXTENSIONS = {'mp4', 'webm'}
AUDIO_EXTENSIONS = {'mp3', 'ogg', 'wav'}
SYSTEM_PREFIXES = ('__CALL_INVITE__', '__CHATLINK__')


class FloodControl:
    def __init__(self, min_interval=1.0, burst_limit=5, burst_window=10.0):
        self._last = defaultdict(float)
        self._burst = defaultdict(list)
        self._min_interval = min_interval
        self._burst_limit = burst_limit
        self._burst_window = burst_window

    def check(self, user_id):
        now = _time.time()
        if now - self._last[user_id] < self._min_interval:
            return False
        window = self._burst[user_id]
        window[:] = [t for t in window if now - t < self._burst_window]
        if len(window) >= self._burst_limit:
            return False
        self._last[user_id] = now
        window.append(now)
        return True


flood_control = FloodControl()


class EncryptionService:
    @staticmethod
    def generate_keys():
        private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        public_key = private_key.public_key()

        priv_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ).decode('utf-8')

        pub_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode('utf-8')

        return priv_pem, pub_pem

    def encrypt_for_multiple(self, text, pub_pems):
        aes_key = os.urandom(32)
        iv = os.urandom(16)

        cipher = Cipher(algorithms.AES(aes_key), modes.CFB(iv))
        encryptor = cipher.encryptor()
        encrypted_text = encryptor.update(text.encode()) + encryptor.finalize()

        key_blobs = b""
        for pub_pem in pub_pems:
            p_key = serialization.load_pem_public_key(pub_pem.encode())
            wrapped = p_key.encrypt(
                aes_key,
                padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None)
            )
            key_blobs += wrapped

        num_keys = len(pub_pems)
        num_keys_bytes = num_keys.to_bytes(2, byteorder='big')

        combined = b"MULTI|" + iv + num_keys_bytes + key_blobs + encrypted_text
        return base64.b64encode(combined).decode('utf-8')

    def encrypt_for_two(self, text, pub1_pem, pub2_pem):
        return self.encrypt_for_multiple(text, [pub1_pem, pub2_pem])

    def decrypt_for_user(self, encrypted_data_b64, priv_key_pem, is_recipient=False):
        try:
            data = base64.b64decode(encrypted_data_b64)
            private_key = serialization.load_pem_private_key(priv_key_pem.encode(), password=None)

            if data[:6] == b"MULTI|":
                data = data[6:]
                iv = data[:16]
                num_keys = int.from_bytes(data[16:18], byteorder='big')
                aes_key = None

                text_start_offset = 18 + (256 * num_keys)
                offset = 18

                for _ in range(num_keys):
                    blob = data[offset:offset + 256]
                    offset += 256
                    try:
                        aes_key = private_key.decrypt(
                            blob,
                            padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(),
                                         label=None)
                        )
                        break
                    except Exception:
                        continue

                if not aes_key:
                    return "[ Ошибка расшифровки ]"

                encrypted_text = data[text_start_offset:]
                cipher = Cipher(algorithms.AES(aes_key), modes.CFB(iv))
                decryptor = cipher.decryptor()
                return (decryptor.update(encrypted_text) + decryptor.finalize()).decode()

            else:
                iv = data[:16]
                wrapped_aes_key = data[272:528] if is_recipient else data[16:272]
                encrypted_text = data[528:]

                aes_key = private_key.decrypt(
                    wrapped_aes_key,
                    padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None)
                )

                cipher = Cipher(algorithms.AES(aes_key), modes.CFB(iv))
                decryptor = cipher.decryptor()
                return (decryptor.update(encrypted_text) + decryptor.finalize()).decode()

        except Exception:
            return "[ Это сообщение слишком старое ]"


class FileService:
    UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'static', 'uploads')

    @staticmethod
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    @staticmethod
    def is_image(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in IMAGE_EXTENSIONS

    @staticmethod
    def is_video(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in VIDEO_EXTENSIONS

    @staticmethod
    def is_audio(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in AUDIO_EXTENSIONS

    @staticmethod
    def generate_safe_name(filename):
        ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else 'bin'
        return f"{uuid.uuid4().hex}.{ext}"

    @staticmethod
    def sign_filename(filename):
        secret = Config.SECRET_KEY.encode() if isinstance(Config.SECRET_KEY, str) else Config.SECRET_KEY
        return hmac.new(secret, filename.encode(), hashlib.sha256).hexdigest()[:16]

    @classmethod
    def verify_signature(cls, filename, sig):
        return hmac.compare_digest(cls.sign_filename(filename), sig)

    @classmethod
    def save_file(cls, file_storage):
        if not file_storage or not file_storage.filename:
            return None

        raw_name = file_storage.filename
        ext = raw_name.rsplit('.', 1)[1].lower() if '.' in raw_name else ''
        if not ext or ext not in ALLOWED_EXTENSIONS:
            return None

        file_storage.seek(0, 2)
        size = file_storage.tell()
        file_storage.seek(0)

        if size > MAX_FILE_SIZE:
            return None

        safe_name = f"{uuid.uuid4().hex}.{ext}"
        os.makedirs(cls.UPLOAD_DIR, exist_ok=True)
        file_path = os.path.join(cls.UPLOAD_DIR, safe_name)
        file_storage.save(file_path)

        display_name = secure_filename(raw_name) or f"file.{ext}"
        mime = file_storage.content_type or 'application/octet-stream'
        sig = cls.sign_filename(safe_name)

        return {
            "url": f"/api/files/{safe_name}?sig={sig}",
            "name": display_name,
            "type": mime,
            "size": size,
            "is_image": ext in IMAGE_EXTENSIONS,
            "is_video": ext in VIDEO_EXTENSIONS,
            "is_audio": ext in AUDIO_EXTENSIONS
        }


class ChatService:
    def __init__(self):
        self.crypto = EncryptionService()

    def get_user_chats(self, user_id):
        from sqlalchemy.orm import joinedload, aliased
        from sqlalchemy import func

        participants = ChatParticipant.query.filter_by(user_id=user_id).options(
            joinedload(ChatParticipant.chat).joinedload(Chat.participants).joinedload(ChatParticipant.user)
        ).all()
        
        if not participants:
            return {}

        chat_ids = [p.chat_id for p in participants]
        
        last_msgs_sub = db.session.query(
            Message.chat_id,
            func.max(Message.id).label('max_id')
        ).filter(Message.chat_id.in_(chat_ids)).group_by(Message.chat_id).subquery()

        last_messages = Message.query.join(
            last_msgs_sub,
            (Message.chat_id == last_msgs_sub.c.chat_id) & (Message.id == last_msgs_sub.c.max_id)
        ).all()
        last_msg_map = {m.chat_id: m for m in last_messages}

        unread_counts = db.session.query(
            Message.chat_id,
            func.count(Message.id)
        ).filter(
            Message.chat_id.in_(chat_ids),
            Message.is_read == False,
            Message.user_id != user_id
        ).group_by(Message.chat_id).all()
        unread_map = dict(unread_counts)

        chats_data = {}
        curr_user = db.session.get(User, user_id)
        now = datetime.utcnow()

        for p in participants:
            chat = p.chat
            last_msg = last_msg_map.get(chat.id)
            msg_preview = "Нет сообщений"

            if last_msg:
                if last_msg.is_deleted:
                    msg_preview = "Сообщение удалено"
                else:
                    is_recip = (last_msg.user_id != user_id)
                    msg_preview = self.crypto.decrypt_for_user(last_msg.content, curr_user.private_key, is_recip)
                    if last_msg.file_name:
                        msg_preview = f"📎 {last_msg.file_name}"

            unread_count = unread_map.get(chat.id, 0)
            if last_msg and last_msg.user_id == user_id:
                last_status = True if getattr(last_msg, 'is_read', False) else False
            else:
                last_status = None

            is_typing = False
            typing_users = []
            other_participants = [op for op in chat.participants if op.user_id != user_id]
            
            for op in other_participants:
                if op.last_typing and (now - op.last_typing).total_seconds() < 6:
                    is_typing = True
                    typing_users.append(op.user.login)

            if chat.personal:
                other_check = other_participants[0] if other_participants else None
                if other_check:
                    user = other_check.user
                    is_online = user.last_seen and (now - user.last_seen).total_seconds() < 120
                    chats_data[str(chat.id)] = {
                        "name": user.login,
                        "avatar": user.avatar if getattr(user, 'avatar', None) else f"https://ui-avatars.com/api/?name={user.fio}&background=random&color=fff&rounded=true&bold=true&uppercase=true",
                        "active": False,
                        "last_msg": "печатает..." if is_typing else msg_preview,
                        "last_time": last_msg.timestamp.strftime("%H:%M") if last_msg else "",
                        "last_status": last_status,
                        "unread": unread_count,
                        "pinned": False,
                        "muted": False,
                        "premium": "1" if getattr(user, 'premium', False) else "",
                        "target_user_id": user.id,
                        "online": is_online,
                        "typing": is_typing
                    }
            else:
                chats_data[str(chat.id)] = {
                    "name": chat.name,
                    "avatar": f"https://ui-avatars.com/api/?name={chat.name}&background=random&color=fff&rounded=true&bold=true&uppercase=true",
                    "active": False,
                    "last_msg": f"{', '.join(typing_users)} печатает..." if is_typing else msg_preview,
                    "last_time": last_msg.timestamp.strftime("%H:%M") if last_msg else "",
                    "last_status": last_status,
                    "unread": unread_count,
                    "pinned": False,
                    "muted": False,
                    "premium": "",
                    "target_user_id": "",
                    "typing": is_typing,
                    "typing_list": typing_users
                }

        return chats_data

    def get_recent_messages(self, user_id, chat_id, last_id=0, first_id=0):
        if not ChatParticipant.query.filter_by(user_id=user_id, chat_id=chat_id).first():
            return []

        curr_user = db.session.get(User, user_id)
        from sqlalchemy.orm import joinedload
        query = Message.query.filter_by(chat_id=chat_id).options(joinedload(Message.author))

        if first_id > 0:
            messages = query.filter(Message.id < first_id).order_by(Message.id.desc()).limit(50).all()
            messages.reverse()
        else:
            if last_id > 0:
                messages = query.filter(Message.id > last_id).order_by(Message.id.asc()).limit(50).all()
            else:
                messages = query.order_by(Message.id.desc()).limit(50).all()
                messages.reverse()

        if hasattr(Message, 'is_read'):
            for msg in messages:
                if msg.user_id != user_id and not getattr(msg, 'is_read', True):
                    msg.is_read = True
            db.session.commit()

        result = []
        now = datetime.utcnow()
        for msg in messages:
            avatar = msg.author.avatar if getattr(msg.author, 'avatar', None) else f"https://ui-avatars.com/api/?name={msg.author.login}&background=random&color=fff&rounded=true&bold=true"
            is_online = msg.author.last_seen and (now - msg.author.last_seen).total_seconds() < 120
            if msg.is_deleted:
                result.append({
                    "id": msg.id,
                    "user_id": msg.user_id,
                    "login": msg.author.login,
                    "avatar": avatar,
                    "content": "",
                    "timestamp": msg.timestamp.strftime("%H:%M"),
                    "is_read": getattr(msg, 'is_read', False),
                    "is_edited": False,
                    "is_deleted": True,
                    "file_url": None,
                    "file_name": None,
                    "file_type": None,
                    "file_size": None,
                    "online": is_online
                })
            else:
                result.append({
                    "id": msg.id,
                    "user_id": msg.user_id,
                    "login": msg.author.login,
                    "avatar": avatar,
                    "content": self.crypto.decrypt_for_user(msg.content, curr_user.private_key, (msg.user_id != user_id)),
                    "timestamp": msg.timestamp.strftime("%H:%M"),
                    "is_read": getattr(msg, 'is_read', False),
                    "is_edited": msg.is_edited or False,
                    "is_deleted": False,
                    "file_url": msg.file_url,
                    "file_name": msg.file_name,
                    "file_type": msg.file_type,
                    "file_size": msg.file_size,
                    "online": is_online
                })
        return result

    def post_message(self, user_id, chat_id, content, file_data=None):
        if not chat_id: return {"error": "Empty"}
        if not content and not file_data: return {"error": "Empty"}

        if not flood_control.check(user_id):
            return {"error": "Слишком быстро. Подождите немного."}

        if not ChatParticipant.query.filter_by(user_id=user_id, chat_id=chat_id).first():
            return {"error": "Denied"}

        parts = ChatParticipant.query.filter_by(chat_id=chat_id).all()
        pub_pems = [p.user.public_key for p in parts if p.user.public_key]

        content_str = str(content).strip() if content else ""
        if file_data:
            content_str = content_str or file_data.get("name", "файл")

        chunks = [content_str[i:i + 2048] for i in range(0, len(content_str), 2048)]

        message_ids = []
        for idx, chunk in enumerate(chunks):
            safe_chunk = escape(chunk)
            encrypted = self.crypto.encrypt_for_multiple(safe_chunk, pub_pems)
            new_msg = Message(user_id=user_id, chat_id=chat_id, content=encrypted)
            if idx == 0 and file_data:
                new_msg.file_url = file_data.get("url")
                new_msg.file_name = file_data.get("name")
                new_msg.file_type = file_data.get("type")
                new_msg.file_size = file_data.get("size")
            db.session.add(new_msg)
            db.session.flush()
            message_ids.append(new_msg.id)

        db.session.commit()
        return {"success": True, "ids": message_ids}

    def edit_message(self, user_id, message_id, new_content):
        msg = db.session.get(Message, message_id)
        if not msg:
            return {"error": "Not found"}
        if msg.user_id != user_id:
            return {"error": "Denied"}
        if msg.is_deleted:
            return {"error": "Deleted"}
        if not new_content or not new_content.strip():
            return {"error": "Empty"}

        decrypted = self.crypto.decrypt_for_user(msg.content, db.session.get(User, user_id).private_key, False)
        for prefix in SYSTEM_PREFIXES:
            if decrypted.startswith(prefix):
                return {"error": "Denied"}

        parts = ChatParticipant.query.filter_by(chat_id=msg.chat_id).all()
        pub_pems = [p.user.public_key for p in parts if p.user.public_key]

        safe_content = escape(new_content.strip())
        encrypted = self.crypto.encrypt_for_multiple(safe_content, pub_pems)
        msg.content = encrypted
        msg.is_edited = True
        db.session.commit()
        return {"success": True}

    def delete_message(self, user_id, message_id):
        msg = db.session.get(Message, message_id)
        if not msg:
            return {"error": "Not found"}

        chat = db.session.get(Chat, msg.chat_id)
        participant = ChatParticipant.query.filter_by(user_id=user_id, chat_id=msg.chat_id).first()
        if not participant:
            return {"error": "Denied"}

        is_own = msg.user_id == user_id
        is_personal = chat.personal if chat else False
        is_owner = (not chat.personal and chat.owner_id == user_id) if chat else False

        if not is_own and not is_personal and not is_owner:
            return {"error": "Denied"}

        if msg.file_url:
            try:
                fname = msg.file_url.split('/api/files/')[-1].split('?')[0] if '/api/files/' in msg.file_url else ''
                if fname:
                    file_path = os.path.join(FileService.UPLOAD_DIR, fname)
                    if os.path.exists(file_path):
                        os.remove(file_path)
            except Exception:
                pass

        msg.is_deleted = True
        msg.file_url = None
        msg.file_name = None
        msg.file_type = None
        msg.file_size = None
        db.session.commit()
        return {"success": True}

    def search_users(self, query, current_user_id):
        if not query: return []
        users = User.query.filter(or_(User.login.ilike(f"%{query}%"), User.fio.ilike(f"%{query}%"))).limit(10).all()
        return [{"id": u.id, "login": u.login, "fio": u.fio} for u in users if u.id != current_user_id]

    def get_or_create_personal_chat(self, user1_id, user2_id):
        c1 = [p.chat_id for p in ChatParticipant.query.filter_by(user_id=user1_id).all()]
        c2 = [p.chat_id for p in ChatParticipant.query.filter_by(user_id=user2_id).all()]
        common = set(c1).intersection(c2)

        for cid in common:
            chat = Chat.query.get(cid)
            if chat and chat.personal: return {"chat_id": cid, "is_new": False}

        new_chat = Chat(personal=True)
        db.session.add(new_chat)
        db.session.commit()

        for uid in [user1_id, user2_id]:
            u = db.session.get(User, uid)
            if not u.public_key:
                u.private_key, u.public_key = self.crypto.generate_keys()

        db.session.add_all([ChatParticipant(user_id=user1_id, chat_id=new_chat.id),
                            ChatParticipant(user_id=user2_id, chat_id=new_chat.id)])
        db.session.commit()
        return {"chat_id": new_chat.id, "is_new": True}

    def create_group_chat(self, owner_id, name, participant_ids):
        if not name:
            return {"error": "Invalid data"}

        new_chat = Chat(personal=False, name=name, owner_id=owner_id)
        db.session.add(new_chat)
        db.session.flush()

        db.session.add(ChatParticipant(user_id=owner_id, chat_id=new_chat.id, role="owner"))

        if participant_ids:
            for uid in participant_ids:
                if uid != owner_id:
                    db.session.add(ChatParticipant(user_id=uid, chat_id=new_chat.id, role="member"))

        db.session.commit()
        return {"chat_id": new_chat.id, "success": True}

    def invite_to_chat(self, chat_id, inviter_id, participant_ids):
        chat = db.session.get(Chat, chat_id)
        if not chat or chat.personal:
            return {"error": "Invalid chat"}

        inviter_p = ChatParticipant.query.filter_by(user_id=inviter_id, chat_id=chat_id).first()
        if not inviter_p:
            return {"error": "Denied"}

        added_count = 0
        for uid in participant_ids:
            existing = ChatParticipant.query.filter_by(user_id=uid, chat_id=chat_id).first()
            if not existing:
                db.session.add(ChatParticipant(user_id=uid, chat_id=chat_id, role="member"))
                added_count += 1

        db.session.commit()
        return {"success": True, "added": added_count}

    def get_chat_info(self, chat_id):
        chat = db.session.get(Chat, chat_id)
        if not chat:
            return {"error": "Not found"}

        participants = []
        for p in chat.participants:
            user = p.user
            avatar = user.avatar if getattr(user, 'avatar',
                                            None) else f"https://ui-avatars.com/api/?name={user.login}&background=random&color=fff&rounded=true&bold=true"
            participants.append({
                "id": user.id,
                "login": user.login,
                "avatar": avatar,
                "role": p.role
            })

        return {
            "participants": participants,
            "is_personal": chat.personal,
            "owner_id": chat.owner_id,
            "success": True
        }

    def delete_chat(self, chat_id, user_id):
        chat = db.session.get(Chat, chat_id)
        if not chat:
            return {"error": "Not found"}

        if chat.personal or chat.owner_id != user_id:
            return {"error": "Denied"}

        db.session.delete(chat)
        db.session.commit()
        return {"success": True}

    def join_chat(self, chat_id, user_id):
        chat = db.session.get(Chat, chat_id)
        if not chat or chat.personal:
            return {"error": "Invalid chat"}

        existing = ChatParticipant.query.filter_by(user_id=user_id, chat_id=chat_id).first()
        if not existing:
            db.session.add(ChatParticipant(user_id=user_id, chat_id=chat_id, role="member"))
            db.session.commit()

        return {"success": True}


class AgoraService:
    def __init__(self):
        self.app_id = Config.AGORA_APP_ID
        self.primary_cert = Config.AGORA_APP_CERTIFICATE
        self.secondary_cert = Config.SECONDARY_CERTIFICATE

    def generate_rtc_token(self, channel_name, user_id, role=1, use_secondary=False):
        expiration_time_in_seconds = 3600
        current_timestamp = int(time.time())
        privilege_expired_ts = current_timestamp + expiration_time_in_seconds
        
        cert = self.secondary_cert if use_secondary else self.primary_cert

        token = RtcTokenBuilder.buildTokenWithUid(
            self.app_id,
            cert,
            channel_name,
            user_id,
            role,
            privilege_expired_ts
        )
        return token
