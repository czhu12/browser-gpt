from langchain.chat_models import ChatOpenAI
from browsergpt.models import MessageType, Message
from time import sleep
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage
)
import time
import os

TEST_CHAT = os.environ.get("TEST_CHAT")

class MockMessage():
  def __init__(self, content):
    self.content = content

class Chatbot:
    def __init__(self, thread, db):
        self.chat = ChatOpenAI(temperature=0)
        self.db = db
        self.thread = thread

    def _to_message_object(self, message):
        if message.message_type == MessageType.AI:
            return AIMessage(content=message.text)
        elif message.message_type == MessageType.SYSTEM:
            return SystemMessage(content=message.text)
        elif message.message_type == MessageType.USER:
            return HumanMessage(content=message.text)

    def respond_to(self, text):
        human_message = Message(text=text, thread=self.thread, message_type=MessageType.USER)
        messages = [self._to_message_object(m) for m in self.thread.messages] + [HumanMessage(content=human_message.text)]

        if TEST_CHAT:
          time.sleep(1)
          ai_text = MockMessage("-- Test --")
        else:
          ai_text = self.chat(messages)

        ai_message = Message(text=ai_text.content, thread=self.thread, message_type=MessageType.AI)
        self.db.session.add(human_message)
        self.db.session.add(ai_message)
        self.db.session.commit()
        return self.thread