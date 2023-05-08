from browsergpt.storage import db
import uuid
from enum import Enum
import sqlalchemy as sa


class MessageType(str, Enum):
    SYSTEM = 'SYSTEM'
    AI = 'AI'
    USER = 'USER'


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uuid = db.Column(db.String(128), nullable=False)

    threads = db.relationship('Thread', backref='user')

    @staticmethod
    def generate_uuid():
        return str(uuid.uuid4())


class Thread(db.Model):
    __tablename__ = 'threads'
    __tableargs__ = (
        sa.Index('threads_user_id_idx', 'user_id'),
    )
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(128), nullable=False, default="")
    messages = db.relationship('Message', backref='thread')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    @staticmethod
    def create_title(text):
        if len(text) > 20:
            return text[:20] + "..."
        return text


class Message(db.Model):
    __tablename__ = 'messages'
    __tableargs__ = (
        sa.Index('messages_thread_id_idx', 'thread_id'),
    )
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.Text(), nullable=False, default="")
    thread_id = db.Column(db.Integer, db.ForeignKey('threads.id'))
    message_type = db.Column(db.Enum(MessageType), nullable=False)
