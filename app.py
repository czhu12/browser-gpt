from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_migrate import Migrate
from browsergpt.storage import db
from browsergpt.models import User, Thread, Message
from browsergpt.authentication import authenticated
from browsergpt.language import Chatbot


app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"

db.init_app(app)
migrate = Migrate(app, db)

@app.route("/")
def get_root():
    return f"Users: {User.query.count()} | Threads: {Thread.query.count()} | Messages: {Message.query.count()}"

@app.route("/api/users", methods=["POST"])
def create_user():
    user = User(uuid=User.generate_uuid())
    db.session.add(user)
    db.session.commit()
    return jsonify({"uuid": user.uuid})

@app.route("/api/current_user", methods=["GET"])
@authenticated
def get_current_user(current_user):
    return jsonify({"uuid": current_user.uuid})

@app.route("/api/threads", methods=["GET"])
@authenticated
def get_threads(current_user):
    threads = current_user.threads
    return jsonify({ "threads": [thread.serialize() for thread in threads] })

@app.route("/api/threads/<int:thread_id>", methods=["GET"])
@authenticated
def get_thread(current_user, thread_id):
    thread = Thread.query.filter_by(user=current_user, id=thread_id).first()
    return jsonify({ "thread": thread.serialize() })

@app.route("/api/threads/", methods=["POST"])
@authenticated
def create_new_thread(current_user):
    thread = Thread(user=current_user)
    db.session.add(thread)
    db.session.commit()
    return jsonify({ "thread": thread.serialize() })

@app.route("/api/threads/<int:thread_id>/messages", methods=["POST"])
@authenticated
def create_message(current_user, thread_id):
    thread = Thread.query.filter_by(user=current_user, id=thread_id).first()
    chatbot = Chatbot(thread, db)
    payload = request.get_json(force=True)
    chatbot.respond_to(payload['text'])

    return jsonify({ "thread": thread.serialize() })

@app.route("/api/chats/<int:chat_id>/read", methods=["POST"])
def create_summary_message(chat_id):
    payload = request.get_json(force=True)
    # Extract the message from the payload
    payload["message"]