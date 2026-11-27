"""Create and run an isolated local Tornado workspace for reviewing the interface."""
import argparse
import os
import re
from pathlib import Path
from secrets import token_hex, token_urlsafe

from werkzeug.security import generate_password_hash

os.environ["DATABASE_URL"] = "sqlite:///tornado-preview.db"
instance_dir = Path(__file__).resolve().parent / "instance"
instance_dir.mkdir(parents=True, exist_ok=True)
secret_path = instance_dir / "preview-secret.key"
try:
    with secret_path.open("x", encoding="ascii") as key_file:
        key_file.write(token_hex(32))
except FileExistsError:
    pass
os.environ["SECRET_KEY"] = secret_path.read_text(encoding="ascii").strip()
os.environ["ADMIN_PASSWORD"] = token_urlsafe(24)
for key in ("TURNSTILE_SITEKEY", "TURNSTILE_SECRET", "YANDEX_SITEKEY", "YANDEX_SECRET"):
    os.environ[key] = "0"

from app import app
from flask import request
from chat.services import EncryptionService, FileService
from models import Chat, ChatParticipant, Message, User, db
from models.public_handle import reserve_handle


@app.after_request
def prevent_preview_cache(response):
    if request.path.startswith("/static/"):
        response.headers["Cache-Control"] = "no-store"
    return response


def repair_preview_upload_links():
    # The preview previously generated a new signing key on every launch.
    for model, field in ((User, "avatar"), (Chat, "avatar"), (Message, "file_url")):
        column = getattr(model, field)
        for row in model.query.filter(column.startswith("/api/files/")):
            current = getattr(row, field)
            match = re.fullmatch(r"/api/files/([a-f0-9]{32}\.[a-z0-9]{1,10})\?sig=[a-f0-9]+", current)
            if match and (Path(FileService.UPLOAD_DIR) / match[1]).is_file():
                signed = f"/api/files/{match[1]}?sig={FileService.sign_filename(match[1])}"
                if signed != current:
                    setattr(row, field, signed)
    db.session.commit()


def seed(reset_password=False):
    login = "tornado_preview"
    reviewer_path = instance_dir / "preview-user.id"
    stored_id = reviewer_path.read_text(encoding="ascii").strip() if reviewer_path.exists() else ""
    reviewer = db.session.get(User, int(stored_id)) if stored_id.isdecimal() else None
    reviewer = reviewer or User.query.filter_by(login=login).first()
    peer = User.query.filter_by(login="tornado_design").first()
    if not reviewer and peer:
        demo_chat = Chat.query.filter_by(name="Команда Tornado", personal=False).first()
        if demo_chat and ChatParticipant.query.filter_by(chat_id=demo_chat.id, user_id=peer.id).first():
            reviewer = db.session.get(User, demo_chat.owner_id)
    if reviewer:
        reviewer_path.write_text(str(reviewer.id), encoding="ascii")
        if not reset_password:
            return None
        password = token_urlsafe(20)
        reviewer.password_hash = generate_password_hash(password)
        db.session.commit()
        return reviewer.login, password

    crypto = EncryptionService()

    def add_user(username, display_name, password):
        private_key, public_key = crypto.generate_keys()
        user = User(
            login=username, fio=display_name, group_id="Демо",
            bio="Тестовый профиль Tornado", password_hash=generate_password_hash(password),
            public_key=public_key, private_key=private_key,
        )
        db.session.add(user)
        return user

    password = token_urlsafe(20)
    reviewer = add_user(login, "Демо Tornado", password)
    if not peer:
        peer = add_user("tornado_design", "Александра Ветрова", token_urlsafe(32))
    db.session.flush()
    for person in (reviewer, peer):
        reserve_handle("user", person.id, person.login)
    fixtures = [
        ("Личная переписка", True, "group", peer, ["Привет! Можно открыть профиль нажатием на аватар.", "Проверим отправку сообщения?"]),
        ("Команда Tornado", False, "group", reviewer, ["Здесь можно проверить меню группы и список участников.", "Давайте соберём замечания по новой версии."]),
        ("Обновления Tornado", False, "channel", peer, ["Новая версия чата уже доступна.", "Откройте меню Tornado, чтобы настроить свой профиль."]),
    ]
    for title, personal, kind, owner, texts in fixtures:
        chat = Chat(name=title, personal=personal, chat_type=kind, owner_id=owner.id)
        db.session.add(chat)
        db.session.flush()
        for user in (reviewer, peer):
            db.session.add(ChatParticipant(chat_id=chat.id, user_id=user.id, role="owner" if user==owner else "member"))
        for text in texts:
            content = crypto.encrypt_for_multiple(text, [reviewer.public_key, peer.public_key])
            db.session.add(Message(user_id=peer.id, chat_id=chat.id, content=content))
    db.session.commit()
    reviewer_path.write_text(str(reviewer.id), encoding="ascii")
    return reviewer.login, password


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--serve", action="store_true", help="Start the local preview on http://127.0.0.1:5050")
    parser.add_argument("--reset-password", action="store_true", help="Issue a new password for the preview account")
    args = parser.parse_args()
    with app.app_context():
        credentials = seed(args.reset_password)
        repair_preview_upload_links()
    if credentials:
        login, password = credentials
        print(f"Preview login: {login}\nPreview password: {password}", flush=True)
    if args.serve:
        app.run(host="127.0.0.1", port=5050, use_reloader=False)
