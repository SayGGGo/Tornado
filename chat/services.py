import logging
import base64
import os
from markupsafe import escape
from models import Message, Chat, ChatParticipant, db, User
from sqlalchemy import or_
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

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

    def encrypt_for_two(self, text, pub1_pem, pub2_pem):
        aes_key = os.urandom(32)
        iv = os.urandom(16)

        cipher = Cipher(algorithms.AES(aes_key), modes.CFB(iv))
        encryptor = cipher.encryptor()
        encrypted_text = encryptor.update(text.encode()) + encryptor.finalize()

        def wrap_key(p_key_pem):
            p_key = serialization.load_pem_public_key(p_key_pem.encode())
            return p_key.encrypt(
                aes_key,
                padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None)
            )

        key_blob1 = wrap_key(pub1_pem)
        key_blob2 = wrap_key(pub2_pem)

        combined = iv + key_blob1 + key_blob2 + encrypted_text
        return base64.b64encode(combined).decode('utf-8')

    def decrypt_for_user(self, encrypted_data_b64, priv_key_pem, is_recipient=False):
        try:
            data = base64.b64decode(encrypted_data_b64)
            iv = data[:16]
            wrapped_aes_key = data[272:528] if is_recipient else data[16:272]
            encrypted_text = data[528:]

            private_key = serialization.load_pem_private_key(priv_key_pem.encode(), password=None)
            aes_key = private_key.decrypt(
                wrapped_aes_key,
                padding.OAEP(mgf=padding.MGF1(algorithm=hashes.SHA256()), algorithm=hashes.SHA256(), label=None)
            )

            cipher = Cipher(algorithms.AES(aes_key), modes.CFB(iv))
            decryptor = cipher.decryptor()
            return (decryptor.update(encrypted_text) + decryptor.finalize()).decode()
        except:
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
            if chat.personal:
                other_p = ChatParticipant.query.filter(ChatParticipant.chat_id == chat.id,
                                                       ChatParticipant.user_id != user_id).first()
                if other_p:
                    other_user = other_p.user
                    last_msg = Message.query.filter_by(chat_id=chat.id).order_by(Message.id.desc()).first()

                    msg_preview = "Нет сообщений"
                    if last_msg:
                        is_recip = (last_msg.user_id != user_id)
                        msg_preview = self.crypto.decrypt_for_user(last_msg.content, curr_user.private_key, is_recip)

                    is_read_attr = hasattr(Message, 'is_read')
                    unread_count = db.session.query(Message).filter_by(chat_id=chat.id, is_read=False).filter(Message.user_id != user_id).count() if is_read_attr else 0
                    last_status = getattr(last_msg, 'is_read', False) if last_msg and last_msg.user_id == user_id else False

                    chats_data[str(chat.id)] = {
                        "name": other_user.login,
                        "avatar": other_user.avatar if getattr(other_user, 'avatar', None) else f"https://ui-avatars.com/api/?name={other_user.fio}&background=random&color=fff&rounded=true&bold=true&uppercase=true",
                        "active": False,
                        "last_msg": msg_preview,
                        "last_time": last_msg.timestamp.strftime("%H:%M") if last_msg else "",
                        "last_status": last_status,
                        "unread": unread_count,
                        "pinned": False,
                        "muted": False,
                        "premium": "1" if getattr(other_user, 'premium', False) else "",
                        "target_user_id": other_user.id
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

        sender = db.session.get(User, user_id)
        parts = ChatParticipant.query.filter_by(chat_id=chat_id).all()
        recipient = next((p.user for p in parts if p.user_id != user_id), sender)

        content_str = str(content).strip()
        chunks = [content_str[i:i + MAX_MESSAGE_LENGTH] for i in range(0, len(content_str), MAX_MESSAGE_LENGTH)]

        message_ids = []
        for chunk in chunks:
            safe_chunk = escape(chunk)
            encrypted = self.crypto.encrypt_for_two(safe_chunk, sender.public_key, recipient.public_key)
            new_msg = Message(user_id=user_id, chat_id=chat_id, content=encrypted)
            db.session.add(new_msg)
            db.session.flush()
            message_ids.append(new_msg.id)

        db.session.commit()
        return {"success": True, "ids": message_ids}

    def search_users(self, query, current_user_id):
        if not query: return []
        users = User.query.filter(or_(User.login.ilike(f"%{query}%"), User.fio.ilike(f"%{query}%"))).limit(10).all()
        return [{"id": u.id, "login": u.login, "fio": u.fio} for u in users]

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