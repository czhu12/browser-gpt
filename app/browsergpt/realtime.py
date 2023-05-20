import json
import uuid
from langchain.callbacks.base import BaseCallbackHandler

class SocketIOCallback(BaseCallbackHandler):
    def __init__(self, socketio, thread):
        self.socketio = socketio
        self.thread = thread
        self.channel = f"/user/{thread.user.uuid}"

    def on_llm_new_token(self, token: str, **kwargs) -> None:
        message = {"thread_id": self.thread.id, "token": token}
        self.socketio.emit(
            self.channel,
            json.dumps({
                "payload": message,
                "uuid": str(uuid.uuid4()),
            }),
        )
        self.socketio.sleep(0)

