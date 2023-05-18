from dotenv import load_dotenv
load_dotenv()

import click
from flask import Flask, request, jsonify, render_template
from browsergpt.storage import db, initialize_db
from browsergpt.models import User, Thread, Message, Document
from browsergpt.authentication import authenticated, raise_404_if_none
from browsergpt.language import Chatbot
from browsergpt.realtime import SocketIOCallback
from browsergpt.serializers import ListSerializer, ThreadSerializer
from flask_socketio import SocketIO
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_basicauth import BasicAuth


class AuthenticatedModelView(ModelView):
    def is_accessible(self):
        return basic_auth.authenticate()


app = Flask(__name__, static_url_path='', static_folder='web/static', template_folder='web/templates')

initialize_db(app, db)

app.config['SECRET_KEY'] = 'secret!'
admin = Admin(app, name='microblog', template_mode='bootstrap3')
admin.add_view(AuthenticatedModelView(User, db.session))
admin.add_view(AuthenticatedModelView(Thread, db.session))
admin.add_view(AuthenticatedModelView(Message, db.session))
admin.add_view(AuthenticatedModelView(Document, db.session))

basic_auth = BasicAuth(app)

def check_credentials(username, password):
    # Check if the username and password are correct
    return username == 'admin' and password == 'password'

basic_auth.check_credentials = check_credentials

socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def get_root():
    return render_template(
        'index.html',
        users_count=User.query.count(),
        threads_count=Thread.query.count(),
        messages_count=Message.query.count(),
        chrome_url="https://chrome.google.com/webstore/detail/imtranslator-translator-d/noaijdpnepcgjemiklgfkcfbkokogabh?hl=en"
    )

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
    serializer = ListSerializer(threads, ThreadSerializer)
    return jsonify({ "threads": serializer.serialize() })

@app.route("/api/threads/<int:thread_id>", methods=["GET"])
@authenticated
def get_thread(current_user, thread_id):
    thread = Thread.query.filter_by(user=current_user, id=thread_id).first()
    if thread is None:
        return jsonify({ "error": "Thread not found" }), 404
    return jsonify({ "thread": ThreadSerializer(thread).serialize() })

@app.route("/api/threads", methods=["POST"])
@authenticated
def create_new_thread(current_user):
    thread = Thread(user=current_user)
    db.session.add(thread)
    db.session.commit()
    return jsonify({ "thread": ThreadSerializer(thread).serialize() })

@app.route("/api/threads/<int:thread_id>/messages", methods=["POST"])
@authenticated
def create_message(current_user, thread_id):
    thread = Thread.query.filter_by(user=current_user, id=thread_id).first()
    raise_404_if_none(thread)
    payload = request.get_json(force=True)
    if not thread.title:
      thread.title = Thread.create_title(payload['text'])
      db.session.add(thread)
      db.session.commit()
    chatbot = Chatbot(thread, db)
    chatbot.respond_to(payload['text'], callbacks=[SocketIOCallback(socketio, thread)])

    return jsonify({ "thread": ThreadSerializer(thread).serialize() })

@app.route("/api/threads/<int:thread_id>/documents", methods=["POST"])
@authenticated
def create_document(current_user, thread_id):
    thread = Thread.query.filter_by(user=current_user, id=thread_id).first()
    raise_404_if_none(thread)
    payload = request.get_json(force=True)
    document = Document(content=payload['content'], thread=thread)
    # Create document vector in background?
    db.session.add(document)
    db.session.commit()

    return jsonify({ "thread": ThreadSerializer(thread).serialize() })



@click.command()
@click.option('--port', default=3001, help='port to run the app on')
@click.option('--host', default="0.0.0.0", help='host to run the app on')
@click.option('--debug', '-d', default=False, is_flag=True, help="Debug mode enabled")
def main(port, host, debug):
    print(f"Starting application on {host}:{port}")
    socketio.run(app, host=host, port=port, debug=debug)

if __name__ == "__main__":
    main()
