from werkzeug.security import check_password_hash
from models import db
from models.admin import Admin
from datetime import datetime


class AdminAuthService:
    def authenticate(self, username, password):
        admin = Admin.query.filter_by(username=username).first()

        if not admin or not admin.is_active: return {"success": False, "message": "низя"}
        # print(admin.password_hash, password, check_password_hash(admin.password_hash, password))
        if check_password_hash(admin.password_hash, password):
            admin.last_login = datetime.utcnow()
            db.session.commit()
            return {"success": True, "admin_id": admin.id, "role": admin.role}

        return {"success": False, "message": "Неверные учетные данные"}