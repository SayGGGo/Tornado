import json

from models import ChatParticipant

RIGHTS = ("manage", "invite", "moderate", "post")


def member_rights(chat, member):
    if not chat or not member or member.blocked:
        return ()
    if member.user_id == chat.owner_id:
        return RIGHTS
    if member.role != "admin":
        return ()
    return tuple(permission for permission in json.loads(member.permissions or "[]") if permission in RIGHTS)


def has_right(chat, user_id, permission):
    if not chat or not user_id:
        return False
    member = ChatParticipant.query.filter_by(chat_id=chat.id, user_id=user_id).first()
    return permission in member_rights(chat, member)
