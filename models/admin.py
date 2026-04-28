import json
from . import db

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), default="admin")
    last_login = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    permissions = db.Column(db.Text, nullable=True)

    def get_permissions(self):
        if self.role == 'root':
            return ['all']
        try:
            return json.loads(self.permissions) if self.permissions else []
        except Exception:
            return []

    def has_permission(self, perm):
        perms = self.get_permissions()
        return 'all' in perms or perm in perms