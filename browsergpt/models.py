from browsergpt.storage import db
import uuid
from enum import Enum

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uuid = db.Column(db.String(128), nullable=False)
    threads = db.relationship('Thread', backref='user')
    @staticmethod
    def generate_uuid():
        return str(uuid.uuid4())


class Thread(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(128), nullable=False, default="")
    messages = db.relationship('Message', backref='thread')
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "messages": [message.serialize() for message in self.messages],
        }


class MessageType(str, Enum):
    SYSTEM = 'SYSTEM'
    AI = 'AI'
    USER = 'USER'

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.Text(), nullable=False, default="")
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id'))
    message_type = db.Column(db.Enum(MessageType), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "message_type": self.message_type
        }

