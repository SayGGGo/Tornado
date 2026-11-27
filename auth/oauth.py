import base64
import hashlib
import re
import secrets
import time
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from flask import abort, current_app, jsonify, redirect, render_template, request, session, url_for
from itsdangerous import BadSignature, URLSafeTimedSerializer

from models import OAuthAccessToken, OAuthApp, OAuthGrant, User, db

_TOKEN_LIFETIME = 3600


def digest(value):
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def valid_redirect(value):
    if not isinstance(value, str) or len(value) > 1024 or not value.isascii():
        return False
    if any(ord(char) <= 32 or char == "\\" for char in value):
        return False
    try:
        url = urlsplit(value)
        return bool(url.hostname and not url.username and not url.password and not url.fragment and
                    (url.scheme == "https" or (url.scheme == "http" and url.hostname in {"127.0.0.1", "::1", "localhost"})))
    except ValueError:
        return False


def no_store(response):
    response.headers["Cache-Control"] = "no-store"
    response.headers["Referrer-Policy"] = "no-referrer"
    return response


def serialize(client):
    return dict(id=client.id, name=client.name, redirect_uri=client.redirect_uri, enabled=client.enabled)


def register_oauth(app):
    def owner():
        user_id = session.get("user_id")
        if not user_id:
            abort(401)
        return user_id

    @app.route("/api/developer/apps", methods=["GET","POST"])
    def applications():
        user_id = owner()
        if request.method == "GET":
            return no_store(jsonify([serialize(client) for client in OAuthApp.query.filter_by(owner_id=user_id).order_by(OAuthApp.name)]))
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            return jsonify(error="Ожидаются настройки приложения в формате JSON"), 400
        name, uri = data.get("name"), data.get("redirect_uri")
        if not isinstance(name, str) or not 1 <= len(name.strip()) <= 80:
            return jsonify(error="Введите название приложения от 1 до 80 символов.", field="name"), 400
        if not valid_redirect(uri):
            return jsonify(error="Введите HTTPS-адрес без фрагмента. Для localhost можно использовать HTTP.", field="redirect_uri"), 400
        if OAuthApp.query.filter_by(owner_id=user_id).count() >= 30:
            return jsonify(error="Достигнут лимит приложений"), 400
        client = OAuthApp(id=secrets.token_urlsafe(24), owner_id=user_id, name=name.strip(), redirect_uri=uri)
        db.session.add(client)
        db.session.commit()
        return no_store(jsonify(serialize(client))), 201

    @app.put("/api/developer/apps/<client_id>")
    def update_application(client_id):
        user_id = owner()
        client = OAuthApp.query.filter_by(id=client_id, owner_id=user_id).first_or_404()
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            return jsonify(error="Ожидаются настройки приложения в формате JSON"), 400
        if "enabled" in data:
            if type(data["enabled"]) is not bool:
                return jsonify(error="Некорректное состояние OAuth"), 400
            client.enabled = data["enabled"]
        if data.get("revoke") is True or not client.enabled:
            OAuthGrant.query.filter_by(app_id=client.id).delete()
            OAuthAccessToken.query.filter_by(app_id=client.id).delete()
        db.session.commit()
        return no_store(jsonify(serialize(client)))

    @app.route("/oauth/authorize", methods=["GET","POST"])
    def oauth_authorize():
        user_id = session.get("user_id")
        if not user_id:
            if request.method == "POST":
                abort(401)
            return redirect(url_for("login", next=request.script_root + request.full_path.rstrip("?")))
        serializer = URLSafeTimedSerializer(current_app.secret_key, salt="tornado-oauth-consent")
        if request.method == "GET":
            client_id = request.args.get("client_id", "")
            uri = request.args.get("redirect_uri", "")
            challenge = request.args.get("code_challenge", "")
            state = request.args.get("state", "")
            if (request.args.get("response_type") != "code" or request.args.get("scope", "profile") != "profile" or
                request.args.get("code_challenge_method") != "S256" or not re.fullmatch(r"[A-Za-z0-9_-]{43}", challenge)
                or not 1 <= len(state) <= 1024):
                abort(400)
            client = OAuthApp.query.filter_by(id=client_id, enabled=True, redirect_uri=uri).first_or_404()
            csrf = session.setdefault("oauth_csrf", secrets.token_urlsafe(24))
            signed = serializer.dumps([user_id, client.id, uri, challenge, state, csrf])
            return no_store(current_app.make_response(render_template("oauth_consent.html", client=client, consent=signed)))
        try:
            actor, client_id, uri, challenge, state, csrf = serializer.loads(request.form.get("consent", ""), max_age=600)
            if actor != user_id or not secrets.compare_digest(csrf, session.get("oauth_csrf", "")):
                abort(403)
        except BadSignature:
            abort(400)
        client = OAuthApp.query.filter_by(id=client_id, enabled=True, redirect_uri=uri).first_or_404()
        session.pop("oauth_csrf", None)
        query = [(key,value) for key,value in parse_qsl(urlsplit(client.redirect_uri).query, keep_blank_values=True)
                 if key not in {"code","state","error"}]
        if request.form.get("decision") == "allow":
            code = secrets.token_urlsafe(32)
            OAuthGrant.query.filter(OAuthGrant.expires <= int(time.time())).delete()
            db.session.add(OAuthGrant(digest=digest(code), app_id=client.id, user_id=user_id,
                                      challenge=challenge, expires=int(time.time())+120))
            db.session.commit()
            query.append(("code",code))
        else:
            query.append(("error","access_denied"))
        destination = urlsplit(client.redirect_uri)._replace(query=urlencode([*query,("state",state)]))
        return no_store(redirect(urlunsplit(destination), code=303))

    @app.post("/oauth/token")
    def oauth_token():
        value = request.form.get("code", "")
        verifier = request.form.get("code_verifier", "")
        client_id = request.form.get("client_id", "")
        if request.form.get("grant_type") != "authorization_code":
            return no_store(jsonify(error="unsupported_grant_type")), 400
        if not re.fullmatch(r"[A-Za-z0-9._~-]{43,128}", verifier) or not 1 <= len(value) <= 128:
            return no_store(jsonify(error="invalid_grant")), 400
        client = OAuthApp.query.filter_by(id=client_id, enabled=True, redirect_uri=request.form.get("redirect_uri")).first()
        grant = db.session.get(OAuthGrant, digest(value))
        now = int(time.time())
        challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode("ascii")).digest()).decode("ascii").rstrip("=")
        if not client or not grant or grant.app_id != client.id or grant.expires <= now or not secrets.compare_digest(grant.challenge, challenge):
            return no_store(jsonify(error="invalid_grant")), 400
        user_id = grant.user_id
        if OAuthGrant.query.filter_by(digest=grant.digest, app_id=client.id).delete() != 1:
            db.session.rollback()
            return no_store(jsonify(error="invalid_grant")), 400
        token = secrets.token_urlsafe(36)
        OAuthAccessToken.query.filter(OAuthAccessToken.expires <= now).delete()
        db.session.add(OAuthAccessToken(digest=digest(token), app_id=client.id, user_id=user_id, expires=now+_TOKEN_LIFETIME))
        db.session.commit()
        return no_store(jsonify(access_token=token,token_type="Bearer",expires_in=_TOKEN_LIFETIME,scope="profile"))

    @app.get("/oauth/userinfo")
    def oauth_userinfo():
        scheme, _, value = request.headers.get("Authorization", "").partition(" ")
        token = db.session.get(OAuthAccessToken, digest(value)) if scheme.lower() == "bearer" and 1 <= len(value) <= 128 else None
        if token and token.expires > int(time.time()):
            client = db.session.get(OAuthApp, token.app_id)
            user = db.session.get(User, token.user_id)
            if client and client.enabled and user:
                return no_store(jsonify(sub=str(user.id), name=user.fio, preferred_username=user.login))
        response = no_store(jsonify(error="invalid_token"))
        response.headers["WWW-Authenticate"] = 'Bearer error="invalid_token"'
        return response, 401
