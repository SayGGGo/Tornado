import requests
import time
from flask import redirect, request, session, jsonify, url_for
from config import Config, logger
from models import db, User

def register_spotify(app):
    @app.route("/spotify/login")
    def spotify_login():
        if "user_id" not in session:
            return redirect(url_for("auth_login"))
        
        scope = "user-read-currently-playing user-read-playback-state user-modify-playback-state"
        auth_url = (
            f"https://accounts.spotify.com/authorize?response_type=code"
            f"&client_id={Config.SPOTIFY_CLIENT_ID}"
            f"&scope={scope}"
            f"&redirect_uri={Config.SPOTIFY_REDIRECT_URI}"
        )
        return redirect(auth_url)

    @app.route("/spotify/callback")
    def spotify_callback():
        code = request.args.get("code")
        if not code:
            return "Error: No code provided", 400
        
        response = requests.post(
            "https://accounts.spotify.com/api/token",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": Config.SPOTIFY_REDIRECT_URI,
                "client_id": Config.SPOTIFY_CLIENT_ID,
                "client_secret": Config.SPOTIFY_CLIENT_SECRET,
            },
            timeout=10
        )
        
        token_data = response.json()
        if "access_token" not in token_data:
            return f"Error: {token_data.get('error_description', 'Failed to get token')}", 400
            
        user_id = session.get("user_id")
        user = db.session.get(User, user_id)
        if user:
            user.spotify_token = token_data["access_token"]
            user.spotify_refresh_token = token_data.get("refresh_token")
            user.spotify_token_expires = int(time.time()) + token_data["expires_in"]
            user.spotify_enabled = True
            db.session.commit()
            
        return redirect("/")

    def refresh_spotify_token(user):
        if not user.spotify_refresh_token:
            return False
            
        response = requests.post(
            "https://accounts.spotify.com/api/token",
            data={
                "grant_type": "refresh_token",
                "refresh_token": user.spotify_refresh_token,
                "client_id": Config.SPOTIFY_CLIENT_ID,
                "client_secret": Config.SPOTIFY_CLIENT_SECRET,
            },
            timeout=10
        )
        
        token_data = response.json()
        if "access_token" in token_data:
            user.spotify_token = token_data["access_token"]
            user.spotify_token_expires = int(time.time()) + token_data["expires_in"]
            db.session.commit()
            return True
        return False

    @app.route("/api/spotify/status")
    def spotify_status():
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"ok": False, "error": "Unauthorized"}), 401
            
        user = db.session.get(User, user_id)
        if not user or not user.spotify_enabled or not user.spotify_token:
            return jsonify({"ok": False, "enabled": False})
            
        if user.spotify_token_expires < time.time() + 300:
            if not refresh_spotify_token(user):
                return jsonify({"ok": False, "error": "Token refresh failed"})
                
        headers = {"Authorization": f"Bearer {user.spotify_token}"}
        try:
            res = requests.get("https://api.spotify.com/v1/me/player/currently-playing", headers=headers, timeout=5)
            if res.status_code == 204:
                return jsonify({"ok": True, "active": False})
            
            data = res.json()
            if not data or "item" not in data:
                return jsonify({"ok": True, "active": False})
                
            item = data["item"]
            track_id = item.get("id")
            tempo = 120
            
            if track_id:
                try:
                    features_res = requests.get(f"https://api.spotify.com/v1/audio-features/{track_id}", headers=headers, timeout=5)
                    if features_res.status_code == 200:
                        features_data = features_res.json()
                        tempo = features_data.get("tempo", 120)
                except: pass

            return jsonify({
                "ok": True,
                "active": True,
                "playing": data.get("is_playing"),
                "track": item.get("name"),
                "artist": ", ".join([a["name"] for a in item.get("artists", [])]),
                "album": item.get("album", {}).get("name"),
                "image": item.get("album", {}).get("images", [{}])[0].get("url"),
                "progress_ms": data.get("progress_ms"),
                "duration_ms": item.get("duration_ms"),
                "tempo": tempo
            })
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)})

    @app.route("/api/spotify/control", methods=["POST"])
    def spotify_control():
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"ok": False, "error": "Unauthorized"}), 401
            
        user = db.session.get(User, user_id)
        if not user or not user.spotify_token:
            return jsonify({"ok": False, "error": "Not connected"})
            
        action = request.json.get("action")
        headers = {"Authorization": f"Bearer {user.spotify_token}"}
        
        try:
            if action == "play":
                requests.put("https://api.spotify.com/v1/me/player/play", headers=headers, timeout=5)
            elif action == "pause":
                requests.put("https://api.spotify.com/v1/me/player/pause", headers=headers, timeout=5)
            elif action == "next":
                requests.post("https://api.spotify.com/v1/me/player/next", headers=headers, timeout=5)
            elif action == "prev":
                requests.post("https://api.spotify.com/v1/me/player/previous", headers=headers, timeout=5)
            
            return jsonify({"ok": True})
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)})

    @app.route("/api/spotify/toggle", methods=["POST"])
    def spotify_toggle():
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"ok": False}), 401
        
        enabled = request.json.get("enabled", False)
        user = db.session.get(User, user_id)
        if user:
            user.spotify_enabled = enabled
            db.session.commit()
            return jsonify({"ok": True})
        return jsonify({"ok": False})
