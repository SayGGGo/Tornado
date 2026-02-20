import os
import requests
from datetime import datetime
from bs4 import BeautifulSoup
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'T')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tornado.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

TURNSTILE_SECRET = os.getenv('TURNSTILE_SECRET', '1x0000000000000000000000000000000AA')

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fio = db.Column(db.String(150), nullable=False)
    login = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    group_id = db.Column(db.String(50), nullable=False)
    study_type = db.Column(db.String(50))
    platforms = db.Column(db.String(200))
    projects = db.Column(db.String(200))
    source = db.Column(db.String(50))
    premium = db.Column(db.Boolean, default=False)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('messages', lazy=True))


with app.app_context():
    db.create_all()


def verify_turnstile(token):
    url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    data = {
        'secret': TURNSTILE_SECRET,
        'response': token
    }
    try:
        response = requests.post(url, data=data)
        return response.json().get('success', False)
    except:
        return False


def get_groups():
    url = "https://genius-school.kuzstu.ru/%D1%80%D0%B0%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5/"
    groups = []
    try:
        response = requests.get(url, timeout=10)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, 'html.parser')
        links = soup.select('table a')
        for link in links:
            name = link.get_text(strip=True)
            if name:
                groups.append({
                    'name': name,
                    'value': name.lower().replace(' ', '_')
                })
    except Exception:
        groups = [{'name': 'Ошибка загрузки', 'value': 'error'}]
    return groups


groups_list = get_groups()


@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('chat'))
    return render_template('start.html', groups=groups_list)


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json

    token = data.get('cf-turnstile-response')
    if not token or not verify_turnstile(token):
        return jsonify({'success': False, 'message': 'Капча не пройдена'})

    required_fields = ['fio', 'login', 'password', 'password_retry', 'position']
    if not all(k in data and data[k] for k in required_fields):
        return jsonify({'success': False, 'message': 'Заполните все обязательные поля'})

    if data['password'] != data['password_retry']:
        return jsonify({'success': False, 'message': 'Пароли не совпадают'})

    if User.query.filter_by(login=data['login']).first():
        return jsonify({'success': False, 'message': 'Пользователь с таким логином уже существует'})

    new_user = User(
        fio=data['fio'],
        login=data['login'],
        password_hash=generate_password_hash(data['password']),
        group_id=data['position'],
        study_type=data.get('hiring_volume', ''),
        platforms=data.get('channels', ''),
        projects=data.get('painpoints', ''),
        source=data.get('current_ats', ''),
        premium=bool(data.get('premium_sub'))
    )

    db.session.add(new_user)
    db.session.commit()

    session['user_id'] = new_user.id
    return jsonify({'success': True, 'redirect': url_for('chat')})


@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('chat'))

    if request.method == 'POST':
        data = request.json

        token = data.get('cf-turnstile-response')
        if not token or not verify_turnstile(token):
            return jsonify({'success': False, 'message': 'Капча не пройдена'})

        user = User.query.filter_by(login=data['login']).first()

        if user and check_password_hash(user.password_hash, data['password']):
            session['user_id'] = user.id
            return jsonify({'success': True, 'redirect': url_for('chat')})

        return jsonify({'success': False, 'message': 'Неверный логин или пароль'})

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))


@app.route('/chat')
def chat():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user = User.query.get(session['user_id'])
    return render_template('chat.html', current_user=user)


@app.route('/api/messages', methods=['GET'])
def get_messages():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    last_id = request.args.get('last_id', 0, type=int)
    messages = Message.query.filter(Message.id > last_id).order_by(Message.id.asc()).all()

    result = []
    for msg in messages:
        result.append({
            'id': msg.id,
            'user_id': msg.user_id,
            'login': msg.user.login,
            'content': msg.content,
            'timestamp': msg.timestamp.strftime('%H:%M')
        })
    return jsonify(result)


@app.route('/api/messages', methods=['POST'])
def send_message():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.json
    content = data.get('content', '').strip()

    if not content:
        return jsonify({'error': 'Empty message'}), 400

    new_msg = Message(user_id=session['user_id'], content=content)
    db.session.add(new_msg)
    db.session.commit()

    return jsonify({'success': True, 'id': new_msg.id})


if __name__ == '__main__':
    app.run(debug=True, port=3000, host='0.0.0.0')