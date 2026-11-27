from . import db


class PublicHandle(db.Model):
    __tablename__ = "public_handle"

    name = db.Column(db.String(64), primary_key=True)
    kind = db.Column(db.String(12), nullable=False)
    owner_id = db.Column(db.Integer, nullable=False)
    __table_args__ = (db.UniqueConstraint("kind", "owner_id"),)

class CollectibleHandle(db.Model):
    __tablename__ = "collectible_handle"
    name = db.Column(db.String(64), db.ForeignKey("public_handle.name", ondelete="CASCADE"), primary_key=True)


def reserve_handle(kind, owner_id, name):
    name = name.lower() if name else None
    current = PublicHandle.query.filter_by(kind=kind, owner_id=owner_id).first()
    if current and current.name == name:
        return
    if name and db.session.get(PublicHandle, name):
        raise ValueError("Это публичное имя уже занято")
    if current:
        db.session.delete(current)
        db.session.flush()
    if name:
        db.session.add(PublicHandle(kind=kind, owner_id=owner_id, name=name))
        db.session.flush()


def backfill_handles():
    from . import Chat, User

    for kind, rows, attribute in (
        ("user", User.query.order_by(User.id).all(), "login"),
        ("chat", Chat.query.filter_by(visibility="public", personal=False).filter(Chat.alias.isnot(None)).order_by(Chat.id).all(), "alias"),
    ):
        for row in rows:
            if PublicHandle.query.filter_by(kind=kind, owner_id=row.id).first():
                continue
            name = getattr(row, attribute).lower()
            if db.session.get(PublicHandle, name):
                base = f"{kind}_{row.id}"
                name = base
                suffix = 2
                while db.session.get(PublicHandle, name) or (
                    kind == "chat" and Chat.query.filter(db.func.lower(Chat.alias) == name, Chat.id != row.id).first()
                ):
                    name = f"{base}_{suffix}"
                    suffix += 1
                if kind == "chat":
                    row.alias = name
            reserve_handle(kind, row.id, name)
    db.session.commit()
