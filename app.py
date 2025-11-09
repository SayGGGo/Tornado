from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html", title="Главная страница")


@app.errorhandler(404)
def page_not_found(e):
    return render_template('error.html', error="Страница не найдена", title="404")


@app.errorhandler(500)
def page_not_found(e):
    return render_template('error.html', error="Ошибка сервера", title="500")

if __name__ == "__main__":
    app.run(debug=True)