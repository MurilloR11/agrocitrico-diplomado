import os
import re
from threading import Lock
from urllib.parse import quote_plus

from flask import Flask, g, jsonify, redirect, render_template, request, session, url_for
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from werkzeug.security import check_password_hash, generate_password_hash

try:
    from gpt4all import GPT4All
except ImportError:
    GPT4All = None

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "agrocitrico-dev-secret-key")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


def build_mysql_uri():
    user = os.environ.get("MYSQL_USER", "root")
    password = os.environ.get("MYSQL_PASSWORD", "")
    host = os.environ.get("MYSQL_HOST", "localhost")
    port = os.environ.get("MYSQL_PORT", "3306")
    database = os.environ.get("MYSQL_DATABASE", "agrocitrico")
    socket = os.environ.get("MYSQL_SOCKET")

    auth = quote_plus(user)
    if password:
        auth = f"{auth}:{quote_plus(password)}"

    query = f"?unix_socket={quote_plus(socket)}" if socket else ""
    return f"mysql+pymysql://{auth}@{host}:{port}/{quote_plus(database)}{query}"


if not app.config["SQLALCHEMY_DATABASE_URI"]:
    app.config["SQLALCHEMY_DATABASE_URI"] = build_mysql_uri()

db = SQLAlchemy(app)
migrate = Migrate(app, db)

MODEL_NAME = "Meta-Llama-3-8B-Instruct.Q4_0.gguf"
_model = None
_model_lock = Lock()
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
GUEST_ENDPOINTS = {"login", "register"}
PROTECTED_ENDPOINTS = {"dashboard"}


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        server_default=db.func.now(),
        onupdate=db.func.now(),
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


def get_model():
    global _model
    if GPT4All is None:
        raise RuntimeError("La dependencia gpt4all no esta instalada.")
    if _model is None:
        _model = GPT4All(MODEL_NAME)
    return _model


def is_valid_email(value):
    return bool(EMAIL_RE.match(value.strip()))


@app.before_request
def auth_middleware():
    endpoint = request.endpoint

    if endpoint in GUEST_ENDPOINTS and session.get("user_id"):
        return redirect(url_for("dashboard"))

    if endpoint in PROTECTED_ENDPOINTS:
        user_id = session.get("user_id")
        if not user_id:
            return redirect(url_for("login"))

        user = db.session.get(User, user_id)
        if user is None:
            session.clear()
            return redirect(url_for("login"))

        g.current_user = user


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    errors = {}
    form = {"email": ""}

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        form["email"] = email

        if not is_valid_email(email):
            errors["email"] = "Ingresa un correo electronico valido"
        if not password.strip():
            errors["password"] = "La contrasena no puede estar vacia"

        if not errors:
            try:
                user = User.query.filter_by(email=email).first()
            except SQLAlchemyError:
                errors["email"] = "No se pudo consultar la base de datos"
            else:
                if user is None or not user.check_password(password):
                    errors["email"] = "Correo o contrasena incorrectos"
                    errors["password"] = "Correo o contrasena incorrectos"
                else:
                    session.clear()
                    session["user_id"] = user.id
                    session["user_name"] = user.fullname
                    return redirect(url_for("dashboard"))

    return render_template("login.html", errors=errors, form=form)


@app.route("/register", methods=["GET", "POST"])
def register():
    errors = {}
    form = {"fullname": "", "email": ""}

    if request.method == "POST":
        fullname = request.form.get("fullname", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        password_confirm = request.form.get("password_confirm", "")
        form.update({"fullname": fullname, "email": email})

        if not fullname:
            errors["fullname"] = "Ingresa tu nombre completo"
        if not is_valid_email(email):
            errors["email"] = "Ingresa un correo electronico valido"
        if len(password) < 8:
            errors["password"] = "La contrasena debe tener al menos 8 caracteres"
        if password_confirm != password or not password_confirm:
            errors["password_confirm"] = "Las contrasenas no coinciden"

        if not errors:
            user = User(fullname=fullname, email=email)
            user.set_password(password)
            db.session.add(user)
            try:
                db.session.commit()
            except IntegrityError:
                db.session.rollback()
                errors["email"] = "Este correo ya esta registrado"
            except SQLAlchemyError:
                db.session.rollback()
                errors["email"] = "No se pudo guardar el usuario en la base de datos"
            else:
                session.clear()
                session["user_id"] = user.id
                session["user_name"] = user.fullname
                return redirect(url_for("dashboard"))

    return render_template("register.html", errors=errors, form=form)


@app.route("/dashboard")
def dashboard():
    user = g.current_user
    stats = [
        {"label": "Labores activas", "value": "3", "detail": "Riego, fertilizacion y fumigacion"},
        {"label": "Alertas proximas", "value": "2", "detail": "Una labor vence hoy y otra manana"},
        {"label": "Humedad suelo", "value": "68%", "detail": "Lectura estable para cultivo de limon"},
        {"label": "Ultima cosecha", "value": "42 kg", "detail": "Registro de la semana actual"},
    ]
    tasks = [
        {"name": "Riego por goteo", "date": "Hoy", "status": "Prioritario"},
        {"name": "Revision de plagas", "date": "Manana", "status": "Pendiente"},
        {"name": "Fertilizacion organica", "date": "En 4 dias", "status": "Programado"},
    ]
    sensors = [
        {"name": "Temperatura", "value": "27 C", "trend": "Rango adecuado"},
        {"name": "Humedad ambiental", "value": "74%", "trend": "Alta por la manana"},
        {"name": "Humedad del suelo", "value": "68%", "trend": "Sin riego urgente"},
    ]

    return render_template(
        "dashboard.html",
        user=user,
        stats=stats,
        tasks=tasks,
        sensors=sensors,
    )


@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/ia")
def ia():
    return render_template("ia.html")


@app.post("/ia/chat")
def ia_chat():
    data = request.get_json(silent=True) or {}
    prompt = data.get("message", "").strip()

    if not prompt:
        return jsonify({"error": "El mensaje no puede estar vacio."}), 400

    try:
        with _model_lock:
            model = get_model()
            with model.chat_session():
                reply = model.generate(prompt, max_tokens=1024)
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 503
    except Exception as exc:
        return jsonify({"error": f"No se pudo generar la respuesta: {exc}"}), 500

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(debug=True)
