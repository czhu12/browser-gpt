from abc import ABC

class AbstractSerializer(ABC):
  def __init__(self, data):
    pass

  def serialize(self):
    pass

class ListSerializer(AbstractSerializer):
  def __init__(self, data, klass_name):
    self.data = data
    self.klass_name = klass_name

  def serialize(self):
    return [self.klass_name(item).serialize() for item in self.data]

class ThreadSerializer(AbstractSerializer):
  def __init__(self, thread):
    self.thread = thread

  def serialize(self):
    return {
      "id": self.thread.id,
      "title": self.thread.title,
      "messages": [MessageSerializer(message).serialize() for message in self.thread.messages],
      "documents": [DocumentSerializer(document).serialize() for document in self.thread.document],
    }

class DocumentSerializer(AbstractSerializer):
  def __init__(self, document, expanded=False):
    self.document = document
    self.expanded = expanded

  def serialize(self):
    data = {
      "id": self.document.id,
    }
    if self.expanded:
      data['content'] = self.document.content
    return data

class MessageSerializer(AbstractSerializer):
  def __init__(self, message):
    self.message = message

  def serialize(self):
    return {
      "id": self.message.id,
      "text": self.message.text,
      "message_type": self.message.message_type
    }

