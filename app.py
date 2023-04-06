import os
import re
import requests
import json
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route("/")
def get_root():
    return "Welcome!!"

@app.route("/chat/<chat_id>/message", methods=["POST"])
def create_service(chat_id):
    pass

@app.route("/chat/<chat_id>/summarize", methods=["POST"])
def create_service(chat_id):
    payload = request.get_json(force=True)
    # Extract the message from the payload
    payload["message"]