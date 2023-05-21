import os
import time
from langchain.chat_models import ChatOpenAI
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage,
)
from langchain.text_splitter import RecursiveCharacterTextSplitter

from browsergpt.models import MessageType, Message

from langchain.prompts.chat import HumanMessagePromptTemplate
from langchain.schema import Document
from langchain import PromptTemplate
from langchain.vectorstores import Annoy
from langchain.embeddings import OpenAIEmbeddings


RETRIEVAL_PROMPT_TEMPLATE = """
Knowledge: {knowledge}

User Input: {user_input}
"""
RETRIEVAL_PROMPT = HumanMessagePromptTemplate(
    prompt=PromptTemplate(
        input_variables=["knowledge", "user_input"],
        template=RETRIEVAL_PROMPT_TEMPLATE,
    )
)


TEST_CHAT = os.environ.get("TEST_CHAT") == "1"

class MockMessage():
  def __init__(self, content):
    self.content = content

class Chatbot:
    def __init__(self, thread, db):
        self.db = db
        self.thread = thread

    def _to_message_object(self, message):
        if message.message_type == MessageType.AI:
            return AIMessage(content=message.text)
        elif message.message_type == MessageType.SYSTEM:
            return SystemMessage(content=message.text)
        elif message.message_type == MessageType.USER:
            return HumanMessage(content=message.text)

    def respond_to(self, user_input, callbacks=[]):
        chat = ChatOpenAI(temperature=0, streaming=True, callbacks=callbacks)
        save_message = Message(text=user_input, thread=self.thread, message_type=MessageType.USER)
        human_message = self.create_human_message(user_input)
        messages = [self._to_message_object(m) for m in self.thread.messages] + [human_message]

        if TEST_CHAT:
          time.sleep(1)
          ai_text = MockMessage("-- Test --")
        else:
          ai_text = chat(messages)

        ai_message = Message(text=ai_text.content, thread=self.thread, message_type=MessageType.AI)
        self.db.session.add(save_message)
        self.db.session.add(ai_message)
        self.db.session.commit()
        return self.thread

    def create_human_message(self, user_input):
        if len(self.thread.documents) > 0:
            documents = [Document(page_content=d.content) for d in self.thread.documents]
            annoy_index = create_annoy_index(documents)
            relevant_documents = annoy_index.similarity_search(user_input)
            human_message = RETRIEVAL_PROMPT.format(user_input=user_input, knowledge="\n".join([d.page_content for d in relevant_documents]))
            return human_message
        else:
            return HumanMessage(content=user_input)


def create_annoy_index(raw_documents):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    documents = text_splitter.split_documents(raw_documents)
    embeddings_func = OpenAIEmbeddings()
    return Annoy.from_documents(documents, embeddings_func)
