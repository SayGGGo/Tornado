import logging
import base64
import os
from markupsafe import escape
from models import Message, Chat, ChatParticipant, db, User
from sqlalchemy import or_
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from config import Config
from agora_token_builder import RtcTokenBuilder
import time


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


class ChatService:
    def __init__(self):
        self.crypto = EncryptionService()

    def get_user_chats(self, user_id):
        participants = ChatParticipant.query.filter_by(user_id=user_id).all()
        chats_data = {}
        curr_user = db.session.get(User, user_id)

        for p in participants:
            chat = p.chat
            last_msg = Message.query.filter_by(chat_id=chat.id).order_by(Message.id.desc()).first()
            msg_preview = "Нет сообщений"

            if last_msg:
                is_recip = (last_msg.user_id != user_id)
                msg_preview = self.crypto.decrypt_for_user(last_msg.content, curr_user.private_key, is_recip)

            is_read_attr = hasattr(Message, 'is_read')
            unread_count = db.session.query(Message).filter_by(chat_id=chat.id, is_read=False).filter(
                Message.user_id != user_id).count() if is_read_attr else 0
            last_status = getattr(last_msg, 'is_read', False) if last_msg and last_msg.user_id == user_id else False

            if chat.personal:
                other_check = ChatParticipant.query.filter(ChatParticipant.chat_id == chat.id,
                                                           ChatParticipant.user_id != user_id).first()
                if other_check:
                    user = other_check.user
                    chats_data[str(chat.id)] = {
                        "name": user.login,
                        "avatar": user.avatar if getattr(user, 'avatar',
                                                         None) else f"https://ui-avatars.com/api/?name={user.fio}&background=random&color=fff&rounded=true&bold=true&uppercase=true",
                        "active": False,
                        "last_msg": msg_preview,
                        "last_time": last_msg.timestamp.strftime("%H:%M") if last_msg else "",
                        "last_status": last_status,
                        "unread": unread_count,
                        "pinned": False,
                        "muted": False,
                        "premium": "1" if getattr(user, 'premium', False) else "",
                        "target_user_id": user.id
                    }
            else:
                chats_data[str(chat.id)] = {
                    "name": chat.name,
                    "avatar": f"https://ui-avatars.com/api/?name={chat.name}&background=random&color=fff&rounded=true&bold=true&uppercase=true",
                    "active": False,
                    "last_msg": msg_preview,
                    "last_time": last_msg.timestamp.strftime("%H:%M") if last_msg else "",
                    "last_status": last_status,
                    "unread": unread_count,
                    "pinned": False,
                    "muted": False,
                    "premium": "",
                    "target_user_id": ""
                }

        return chats_data

    def get_recent_messages(self, user_id, chat_id, last_id=0, first_id=0):
        if not ChatParticipant.query.filter_by(user_id=user_id, chat_id=chat_id).first():
            return []

        curr_user = db.session.get(User, user_id)
        query = Message.query.filter_by(chat_id=chat_id)

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

        return [{
            "id": msg.id,
            "user_id": msg.user_id,
            "login": msg.author.login,
            "content": self.crypto.decrypt_for_user(msg.content, curr_user.private_key, (msg.user_id != user_id)),
            "timestamp": msg.timestamp.strftime("%H:%M"),
            "is_read": getattr(msg, 'is_read', False)
        } for msg in messages]

    def post_message(self, user_id, chat_id, content):
        if not content or not chat_id: return {"error": "Empty"}

        if not ChatParticipant.query.filter_by(user_id=user_id, chat_id=chat_id).first():
            return {"error": "Denied"}

        parts = ChatParticipant.query.filter_by(chat_id=chat_id).all()
        pub_pems = [p.user.public_key for p in parts if p.user.public_key]

        content_str = str(content).strip()
        chunks = [content_str[i:i + 2048] for i in range(0, len(content_str), 2048)]

        message_ids = []
        for chunk in chunks:
            safe_chunk = escape(chunk)
            encrypted = self.crypto.encrypt_for_multiple(safe_chunk, pub_pems)
            new_msg = Message(user_id=user_id, chat_id=chat_id, content=encrypted)
            db.session.add(new_msg)
            db.session.flush()
            message_ids.append(new_msg.id)

        db.session.commit()
        return {"success": True, "ids": message_ids}

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
        self.app_certificate = Config.AGORA_APP_CERTIFICATE

    def generate_rtc_token(self, channel_name, user_id, role=1):
        expiration_time_in_seconds = 3600
        current_timestamp = int(time.time())
        privilege_expired_ts = current_timestamp + expiration_time_in_seconds

        token = RtcTokenBuilder.buildTokenWithUid(
            self.app_id,
            self.app_certificate,
            channel_name,
            user_id,
            role,
            privilege_expired_ts
        )
        return token