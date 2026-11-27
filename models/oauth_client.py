from . import db


class OAuthApp(db.Model):
    __tablename__ = "oauth_app"
    id = db.Column(db.String(48), primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, index=True)
    name = db.Column(db.String(80), nullable=False)
    redirect_uri = db.Column(db.String(1024), nullable=False)
    enabled = db.Column(db.Boolean, nullable=False, default=False)


class OAuthGrant(db.Model):
    __tablename__ = "oauth_grant"
    digest = db.Column(db.String(64), primary_key=True)
    app_id = db.Column(db.String(48), db.ForeignKey("oauth_app.id"), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    challenge = db.Column(db.String(43), nullable=False)
    expires = db.Column(db.BigInteger, nullable=False)


class OAuthAccessToken(db.Model):
    __tablename__ = "oauth_access_token"
    digest = db.Column(db.String(64), primary_key=True)
    app_id = db.Column(db.String(48), db.ForeignKey("oauth_app.id"), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    expires = db.Column(db.BigInteger, nullable=False)
