from flask import render_template, request, jsonify, session, redirect, url_for, abort
from functools import wraps
from datetime import datetime
from models import db
from models.admin import Admin
from .services import AdminAuthService
from utils.security import CaptchaManager, SecurityManager
from config import Config
from sqlalchemy import or_
import os, json, time


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        admin_id = session.get("admin_id")
        if not admin_id:
            return redirect(url_for("admin_login", next=request.url))

        try: admin = db.session.get(Admin, int(admin_id))
        except: admin = None

        if not admin or not admin.is_active:
            session.pop("admin_id", None)
            return redirect(url_for("admin_login"))

        return f(*args, **kwargs)
    return decorated_function

def root_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        admin_id = session.get("admin_id")
        try: admin = db.session.get(Admin, int(admin_id)) if admin_id else None
        except: admin = None
        if not admin or admin.role != 'root':
            return jsonify({"error": "Root access required"}), 403
        return f(*args, **kwargs)
    return decorated_function

_version_cache = {"value": None, "ts": 0}

def _get_github_version():
    if time.time() - _version_cache["ts"] < 3600 and _version_cache["value"]:
        return _version_cache["value"]
    try:
        import requests as _req
        repo = Config.GITHUB_REPO
        r = _req.get(f"https://api.github.com/repos/{repo}/releases/latest", timeout=5,
                     headers={"Accept": "application/vnd.github+json"})
        if r.status_code == 200:
            tag = r.json().get("tag_name", "—")
            _version_cache["value"] = tag
            _version_cache["ts"] = time.time()
            return tag
        r2 = _req.get(f"https://api.github.com/repos/{repo}/tags", timeout=5,
                      headers={"Accept": "application/vnd.github+json"})
        if r2.status_code == 200:
            tags = r2.json()
            tag = tags[0]["name"] if tags else "—"
            _version_cache["value"] = tag
            _version_cache["ts"] = time.time()
            return tag
    except Exception:
        pass
    return _version_cache.get("value") or "—"

def register_admin(app):
    auth_service = AdminAuthService()

    if Config.ADMIN_SESSION_IND == "0": Config.ADMIN_SESSION_IND = "admin"

    @app.route(f"/{Config.ADMIN_SESSION_IND}/login", methods=["GET", "POST"])
    def admin_login():
        if "admin_id" in session:
            return redirect(url_for("admin_dashboard"))

        if request.method == "POST":
            data = request.json or {}
            username = data.get("username")
            password = data.get("password")
            captcha_token = data.get("captcha_token")

            provider, more = CaptchaManager.get_active_provider()
            captcha_payload = {"smart-token" if provider == "yandex" else "cf-turnstile-response": captcha_token }

            if not SecurityManager.verify_captcha(captcha_payload):
                return jsonify({"success": False, "message": "Капча не решена"}), 403

            result = auth_service.authenticate(username, password)
            if result.get("success"):
                session.permanent = True
                session["admin_id"] = result["admin_id"]
            return jsonify(result)

        provider, site_key = CaptchaManager.get_active_provider()
        return render_template(
            "admin/login.html",
            captcha_provider=provider,
            site_key=site_key,
            key=Config.ADMIN_SESSION_IND
        )

    @app.route(f"/{Config.ADMIN_SESSION_IND}/logout")
    def admin_logout():
        session.clear()
        return redirect(url_for("admin_login"))

    @app.route(f"/{Config.ADMIN_SESSION_IND}/")
    @app.route(f"/{Config.ADMIN_SESSION_IND}/dashboard")
    @admin_required
    def admin_dashboard():
        from models.server import Settings
        admin = db.session.get(Admin, session["admin_id"])
        settings = Settings.query.first()
        return render_template("admin/dashboard.html", active_tab="dashboard", admin=admin, settings=settings, key=Config.ADMIN_SESSION_IND)

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/users")
    @admin_required
    def admin_users_api():
        from models import User
        page = request.args.get('page', 1, type=int)
        q = request.args.get('q', '').strip()
        per_page = 20
        query = User.query
        if q:
            query = query.filter(or_(User.login.ilike(f'%{q}%'), User.fio.ilike(f'%{q}%')))
        total = query.count()
        users_list = query.order_by(User.id.desc()).offset((page - 1) * per_page).limit(per_page).all()
        now = datetime.utcnow()
        result = []
        for u in users_list:
            avatar = u.avatar if getattr(u, 'avatar', None) else f"https://ui-avatars.com/api/?name={u.login}&background=random&color=fff&rounded=true"
            from datetime import timedelta
            online = bool(u.last_seen and (now - u.last_seen).total_seconds() < 120)
            result.append({
                "id": u.id, "login": u.login, "fio": u.fio or u.login,
                "premium": bool(getattr(u, 'premium', False)), "avatar": avatar,
                "online": online,
                "last_seen": u.last_seen.strftime("%d.%m.%Y %H:%M") if u.last_seen else "никогда",
            })
        return jsonify({"users": result, "total": total, "page": page, "pages": max(1, (total + per_page - 1) // per_page)})

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/users/<int:user_id>/toggle-premium", methods=["POST"])
    @admin_required
    def admin_toggle_user_premium(user_id):
        from models import User
        u = db.session.get(User, user_id)
        if not u:
            return jsonify({"error": "Not found"}), 404
        u.premium = not bool(getattr(u, 'premium', False))
        db.session.commit()
        return jsonify({"success": True, "premium": u.premium})

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/stats")
    @admin_required
    def admin_stats():
        return admin_stats_with_reports()

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/settings/premium-only", methods=["POST"])
    @admin_required
    def admin_toggle_premium_only():
        from models.server import Settings
        data = request.json or {}
        enabled = bool(data.get("enabled", False))
        settings = Settings.query.first()
        if not settings:
            settings = Settings()
            db.session.add(settings)
        settings.premium_only_messaging = enabled
        db.session.commit()
        return jsonify({"success": True, "premium_only_messaging": settings.premium_only_messaging})

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/version")
    @admin_required
    def admin_version():
        return jsonify({"version": _get_github_version(), "repo": Config.GITHUB_REPO})

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/env", methods=["GET"])
    @admin_required
    @root_required
    def admin_get_env():
        env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        if not os.path.exists(env_path):
            return jsonify({"content": "", "exists": False})
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                content = f.read()
            return jsonify({"content": content, "exists": True})
        except Exception:
            return jsonify({"error": "Internal server error"}), 500

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/env", methods=["POST"])
    @admin_required
    @root_required
    def admin_save_env():
        data = request.json or {}
        content = data.get("content", "")
        env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        try:
            with open(env_path, "w", encoding="utf-8") as f:
                f.write(content)
            return jsonify({"success": True})
        except Exception:
            return jsonify({"error": "Internal server error"}), 500

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/admins", methods=["GET"])
    @admin_required
    @root_required
    def admin_list_admins():
        admins = Admin.query.all()
        result = []
        for a in admins:
            result.append({
                "id": a.id, "username": a.username, "role": a.role,
                "is_active": a.is_active,
                "permissions": a.get_permissions(),
                "last_login": a.last_login.strftime("%d.%m.%Y %H:%M") if a.last_login else None,
            })
        return jsonify({"admins": result})

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/admins", methods=["POST"])
    @admin_required
    @root_required
    def admin_create_admin():
        from werkzeug.security import generate_password_hash
        data = request.json or {}
        username = (data.get("username") or "").strip()
        password = (data.get("password") or "").strip()
        role = (data.get("role") or "admin").strip()
        permissions = data.get("permissions", [])

        if not username or not password:
            return jsonify({"error": "Логин и пароль обязательны"}), 400
        if Admin.query.filter_by(username=username).first():
            return jsonify({"error": "Пользователь уже существует"}), 409
        if role == 'root':
            return jsonify({"error": "Нельзя создать root через API"}), 403

        a = Admin(
            username=username,
            password_hash=generate_password_hash(password),
            role=role,
            is_active=True,
            permissions=json.dumps(permissions) if permissions else None,
        )
        db.session.add(a)
        db.session.commit()
        return jsonify({"success": True, "id": a.id})

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/admins/<int:admin_id>", methods=["DELETE"])
    @admin_required
    @root_required
    def admin_delete_admin(admin_id):
        a = db.session.get(Admin, admin_id)
        if not a:
            return jsonify({"error": "Not found"}), 404
        if a.role == 'root':
            return jsonify({"error": "Нельзя удалить root"}), 403
        db.session.delete(a)
        db.session.commit()
        return jsonify({"success": True})

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/admins/<int:admin_id>/toggle", methods=["POST"])
    @admin_required
    @root_required
    def admin_toggle_admin(admin_id):
        a = db.session.get(Admin, admin_id)
        if not a:
            return jsonify({"error": "Not found"}), 404
        if a.role == 'root':
            return jsonify({"error": "Нельзя деактивировать root"}), 403
        a.is_active = not a.is_active
        db.session.commit()
        return jsonify({"success": True, "is_active": a.is_active})

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/users/<int:user_id>/detail")
    @admin_required
    def admin_user_detail(user_id):
        from models import User, Message
        from models.report import UserReport
        from datetime import timedelta
        u = db.session.get(User, user_id)
        if not u:
            return jsonify({"error": "Not found"}), 404
        now = datetime.utcnow()
        online = bool(u.last_seen and (now - u.last_seen).total_seconds() < 120)
        avatar = u.avatar if getattr(u, 'avatar', None) else f"https://ui-avatars.com/api/?name={u.login}&background=random&color=fff&rounded=true"
        msg_count = Message.query.filter_by(user_id=u.id, is_deleted=False).count()
        report_count = UserReport.query.filter_by(reported_user_id=u.id).count()
        open_reports = UserReport.query.filter_by(reported_user_id=u.id, status='pending').count()
        return jsonify({
            "id": u.id, "login": u.login, "fio": u.fio or u.login,
            "bio": u.bio or "", "avatar": avatar,
            "online": online,
            "last_seen": u.last_seen.strftime("%d.%m.%Y %H:%M") if u.last_seen else "никогда",
            "premium": bool(getattr(u, 'premium', False)),
            "is_banned": bool(getattr(u, 'is_banned', False)),
            "ban_reason": u.ban_reason or "",
            "ban_expires": u.ban_expires.strftime("%d.%m.%Y %H:%M") if u.ban_expires else None,
            "ide_connected": bool(getattr(u, 'ide_connected', False)),
            "spotify_enabled": bool(getattr(u, 'spotify_enabled', False)),
            "group_id": u.group_id or "",
            "study_type": u.study_type or "",
            "msg_count": msg_count,
            "report_count": report_count,
            "open_reports": open_reports,
            "platforms": u.platforms or "",
            "projects": u.projects or "",
        })

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/users/<int:user_id>/ban", methods=["POST"])
    @admin_required
    def admin_ban_user(user_id):
        from models import User
        from datetime import timedelta
        u = db.session.get(User, user_id)
        if not u:
            return jsonify({"error": "Not found"}), 404
        if u.is_banned:
            u.is_banned = False
            u.ban_reason = None
            u.ban_expires = None
        else:
            data = request.json or {}
            u.is_banned = True
            reason = (data.get("reason") or "").strip()
            duration = data.get("duration")
            u.ban_reason = reason or None
            if duration and int(duration) > 0:
                u.ban_expires = datetime.utcnow() + timedelta(hours=int(duration))
            else:
                u.ban_expires = None
        db.session.commit()
        return jsonify({
            "success": True, "is_banned": u.is_banned,
            "ban_reason": u.ban_reason,
            "ban_expires": u.ban_expires.strftime("%d.%m.%Y %H:%M") if u.ban_expires else None,
        })

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/reports")
    @admin_required
    def admin_reports():
        from models.report import UserReport
        from models import User
        page = request.args.get('page', 1, type=int)
        status = request.args.get('status', 'pending')
        per_page = 20
        query = UserReport.query
        if status != 'all':
            query = query.filter_by(status=status)
        total = query.count()
        reports = query.order_by(UserReport.id.desc()).offset((page - 1) * per_page).limit(per_page).all()
        result = []
        for r in reports:
            reported = db.session.get(User, r.reported_user_id)
            reporter = db.session.get(User, r.reporter_id) if r.reporter_id else None
            result.append({
                "id": r.id,
                "reporter": reporter.login if reporter else "авто",
                "reporter_id": r.reporter_id,
                "reported": reported.login if reported else f"#{r.reported_user_id}",
                "reported_id": r.reported_user_id,
                "reported_avatar": (reported.avatar if reported and reported.avatar else f"https://ui-avatars.com/api/?name={reported.login if reported else 'U'}&background=random&color=fff&rounded=true") if reported else "",
                "reason": r.reason,
                "threat_level": r.threat_level,
                "is_auto": r.is_auto,
                "trigger_word": r.trigger_word or "",
                "status": r.status,
                "created_at": r.created_at.strftime("%d.%m.%Y %H:%M"),
                "context": r.get_context(),
                "chat_id": r.chat_id,
            })
        return jsonify({
            "reports": result, "total": total, "page": page,
            "pages": max(1, (total + per_page - 1) // per_page)
        })

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/reports/<int:report_id>/status", methods=["POST"])
    @admin_required
    def admin_update_report(report_id):
        from models.report import UserReport
        r = db.session.get(UserReport, report_id)
        if not r:
            return jsonify({"error": "Not found"}), 404
        data = request.json or {}
        new_status = data.get("status")
        if new_status not in ('pending', 'reviewed', 'dismissed'):
            return jsonify({"error": "Invalid status"}), 400
        r.status = new_status
        db.session.commit()
        return jsonify({"success": True})

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/settings/anti-profanity", methods=["POST"])
    @admin_required
    def admin_toggle_anti_profanity():
        from models.server import Settings
        data = request.json or {}
        enabled = bool(data.get("enabled", False))
        settings = Settings.query.first()
        if not settings:
            settings = Settings()
            db.session.add(settings)
        settings.anti_profanity_enabled = enabled
        db.session.commit()
        return jsonify({"success": True, "anti_profanity_enabled": settings.anti_profanity_enabled})

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/settings/profanity-report", methods=["POST"])
    @admin_required
    def admin_toggle_profanity_report():
        from models.server import Settings
        data = request.json or {}
        enabled = bool(data.get("enabled", False))
        settings = Settings.query.first()
        if not settings:
            settings = Settings()
            db.session.add(settings)
        settings.profanity_auto_report = enabled
        db.session.commit()
        return jsonify({"success": True, "profanity_auto_report": settings.profanity_auto_report})

    @app.route(f"/{Config.ADMIN_SESSION_IND}/api/settings/anti67", methods=["POST"])
    @admin_required
    def admin_toggle_anti67():
        from models.server import Settings
        data = request.json or {}
        enabled = bool(data.get("enabled", False))
        settings = Settings.query.first()
        if not settings:
            settings = Settings()
            db.session.add(settings)
        settings.anti67_enabled = enabled
        db.session.commit()
        return jsonify({"success": True, "anti67_enabled": settings.anti67_enabled})

    def admin_stats_with_reports():
        from models import User, Chat, Message
        from models.server import Settings
        from models.report import UserReport
        from datetime import timedelta
        from sqlalchemy import func

        now = datetime.utcnow()
        user_count = User.query.count()
        chat_count = Chat.query.count()
        msg_count = Message.query.count()
        online_count = User.query.filter(User.last_seen >= now - timedelta(minutes=2)).count()
        premium_count = User.query.filter(User.premium == True).count()

        msg_days = []
        for i in range(13, -1, -1):
            d = now - timedelta(days=i)
            ds = d.replace(hour=0, minute=0, second=0, microsecond=0)
            de = d.replace(hour=23, minute=59, second=59, microsecond=999999)
            cnt = Message.query.filter(Message.timestamp >= ds, Message.timestamp <= de).count()
            msg_days.append({"date": d.strftime("%d.%m"), "count": cnt})

        active_days = []
        for i in range(6, -1, -1):
            d = now - timedelta(days=i)
            ds = d.replace(hour=0, minute=0, second=0, microsecond=0)
            de = d.replace(hour=23, minute=59, second=59, microsecond=999999)
            cnt = User.query.filter(User.last_seen >= ds, User.last_seen <= de).count()
            active_days.append({"date": d.strftime("%d.%m"), "count": cnt})

        personal_count = Chat.query.filter_by(personal=True).count()
        group_count = Chat.query.filter_by(personal=False).count()

        recent_users = User.query.order_by(User.id.desc()).limit(10).all()
        recent_data = []
        for u in recent_users:
            avatar = u.avatar if getattr(u, 'avatar', None) else f"https://ui-avatars.com/api/?name={u.login}&background=random&color=fff&rounded=true&bold=true"
            recent_data.append({"login": u.login, "fio": u.fio or u.login, "premium": bool(getattr(u, 'premium', False)), "avatar": avatar})

        srv_settings = Settings.query.first()
        premium_only = srv_settings.premium_only_messaging if srv_settings else False
        anti67 = srv_settings.anti67_enabled if srv_settings else False

        pending_reports = UserReport.query.filter_by(status='pending').count()
        auto_reports = UserReport.query.filter_by(is_auto=True).count()

        anti_profanity = srv_settings.anti_profanity_enabled if srv_settings else False
        profanity_auto_report = srv_settings.profanity_auto_report if srv_settings else True

        return jsonify({
            "users": user_count, "chats": chat_count, "messages": msg_count,
            "online": online_count, "premium": premium_count,
            "messages_chart": msg_days, "active_users_chart": active_days,
            "chat_types": {"personal": personal_count, "group": group_count},
            "recent_users": recent_data, "premium_only": premium_only,
            "anti67": anti67,
            "anti_profanity": anti_profanity,
            "profanity_auto_report": profanity_auto_report,
            "pending_reports": pending_reports,
            "auto_reports": auto_reports,
        })