from langchain.callbacks.base import BaseCallbackHandler

class SocketIOCallback(BaseCallbackHandler):
    def __init__(self, socketio, thread):
        self.socketio = socketio
        self.channel = f"/user/{thread.user.uuid}/thread/{thread.id}"

    def on_llm_new_token(self, token: str, **kwargs) -> None:
        print(f"My custom handler, token: {token}")
        self.socketio.emit("message", token)

