import datetime
from tarfile import ReadError
from flask import Flask, render_template, request, redirect, url_for, Response, flash
from flask_admin import Admin
import json
from dotenv import load_dotenv
import os
from luckytools import LuckyTools
from functools import wraps


load_dotenv()
app = Flask(__name__)

DEBUG_MODE = os.getenv("STRIPE_SK")
ENABLE_STRIPE = os.getenv("ENABLE_STRIPE") == "true"
STRIPE_PK = os.getenv("STRIPE_PK")
STRIPE_SK = os.getenv("STRIPE_SK")
ADMIN_PASS = os.getenv("ADMIN_PASS")

if ENABLE_STRIPE and STRIPE_SK:
    import stripe
    stripe.api_key = STRIPE_SK

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

admin = Admin(app, name="TORNADO")

@app.route("/")
def index():
    with open("menu.json", "r", encoding="utf-8") as file:
        menu = json.load(file)
    categories = {}
    for item in menu:
        category_name = item["category"]
        if category_name not in categories:
            categories[category_name] = []
        categories[category_name].append(item)

    category_names_list = list(categories.keys())

    return render_template("index.html", title="Главная страница", categories=categories,
                           category_names=category_names_list)


@app.route("/balance")
def balance():
    return render_template("balance.html",
                           title="Пополнение баланса",
                           STRIPE_PK=STRIPE_PK,
                           ENABLE_STRIPE=ENABLE_STRIPE)


@app.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        data = request.get_json()
        amount = int(data.get("amount"))

        if amount < 100:
            amount = 100

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "rub",
                    "product_data": {
                        "name": "Пополнение баланса Tornado",
                    },
                    "unit_amount": amount * 100,
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=url_for("success", _external=True),
            cancel_url=url_for("cancel", _external=True),
        )
        return {"id": checkout_session.id}
    except:
        return None


@app.route("/success")
def success():
    return render_template("payment_status.html", title="Успешно",
                           message="Оплата прошла успешно!", status="success")


@app.route("/cancel")
def cancel():
    return render_template("payment_status.html", title="Отмена оплаты",
                           message="Оплата отменена или не удалась.", status="cancel")


@app.errorhandler(404)
def page_not_found(e):
    return render_template("error.html", error="Страница не найдена", title="✕ 404")


@app.errorhandler(500)
def page_not_found(e):
    return render_template("error.html", error="Ошибка сервера", title="✕ 500")


def load_menu():
    from parser import pars

    tools.fade_print("Загружаем меню...", time_show=0.01, white_tag=True)
    menu = pars()
    with open("menu.json", "w", encoding="utf-8") as file:
        json.dump(menu, file, indent=4, ensure_ascii=False)
    tools.fade_print("Успешная загрузка", time_show=0.01, white_tag=True)


if __name__ == "__main__":
    tools = LuckyTools("⌊ TORNADO ⌉ »", prefix_short="⌊ TORNADO ⌉", show_init=False)

    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        try:
            if os.path.exists("server_info.json"):
                with open("server_info.json", "r", encoding="utf-8") as file:
                    data = json.load(file)
                    last_run = data["last_run"]

                    last_run_date = datetime.datetime.fromisoformat(last_run).date()
                    current_date = datetime.datetime.now().date()
                    if current_date > last_run_date:
                        load_menu()

            last_run = datetime.datetime.now().isoformat()
            with open("server_info.json", "w", encoding="utf-8") as file:
                json.dump({"last_run": last_run}, file, indent=4, ensure_ascii=False)

        except FileNotFoundError:
            tools.fade_print("✕ Ошибка при работе с server_info.json", white_tag=True, time_show=3, color="ff0000")
            with open("server_info.json", "w", encoding="utf-8") as file:
                last_run = datetime.datetime.now().isoformat()
                json.dump({"last_run": last_run}, file, indent=4, ensure_ascii=False)


        try:
            with open("menu.json", "r", encoding="utf-8") as file:
                menu = json.load(file)
            tools.fade_print("Меню успешно загружено", time_show=0.01, white_tag=True)
        except FileNotFoundError:
            tools.fade_print("✕ Файл menu.json не найден", white_tag=True, time_show=3, color="ff0000")
            try:
                load_menu()
            except ImportError:
                pass
            except Exception:
                tools.fade_print("✕ Возникла ошибка при парсе", white_tag=True, time_show=3, color="ff0000")
        except ReadError:
            tools.fade_print("✕ Невозможно прочитать файл menu.json", white_tag=True, time_show=3, color="ff0000")
        except Exception:
            tools.fade_print("✕ Возникла ошибка с файлом menu.json", white_tag=True, time_show=3, color="ff0000")

        if DEBUG_MODE:
            tools.fade_print("Дебаг включен", white_tag=True, time_show=1, color="fcba03")
        tools.fade_print("Запуск сервера...", time_show=0.01, white_tag=True)
    try:
        app.run(debug=DEBUG_MODE)
    except Exception:
        tools.fade_print("✕ Ошибка сервера", white_tag=True, time_show=3, color="ff0000")
