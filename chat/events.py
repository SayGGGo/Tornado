"""In-process change notifications shared by WebSocket and long polling."""
from collections import defaultdict
from threading import Condition, Lock
from uuid import uuid4

from models import ChatParticipant

epoch = uuid4().hex
_lock = Lock()
_conditions = {}
_revisions = defaultdict(int)


def _condition(user_id):
    with _lock:
        if user_id not in _conditions:
            _conditions[user_id] = Condition()
        return _conditions[user_id]


def wait_for_revision(user_id, previous, timeout=20):
    condition = _condition(user_id)
    with condition:
        condition.wait_for(lambda: _revisions[user_id] != previous, timeout=timeout)
        return _revisions[user_id]


def notify_user(user_id):
    condition = _condition(user_id)
    with condition:
        _revisions[user_id] += 1
        condition.notify_all()


def notify_chat_users(chat_id):
    recipients = ChatParticipant.query.filter_by(chat_id=chat_id).with_entities(ChatParticipant.user_id)
    for (user_id,) in recipients:
        notify_user(user_id)
