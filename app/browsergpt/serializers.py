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
    }

class MessageSerializer(AbstractSerializer):
  def __init__(self, message):
    self.message = message

  def serialize(self):
    return {
      "id": self.message.id,
      "text": self.message.text,
      "message_type": self.message.message_type
    }

