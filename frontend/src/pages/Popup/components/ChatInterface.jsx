import React, { useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Button, Col, Form, FormControl, InputGroup, Row } from "react-bootstrap"
import ChatGPTIcon from './ChatGPTIcon';
import ReactMarkdown from 'react-markdown';
import axios from "axios";
import ExpandableSidebar from './ExpandableSidebar';
import ThreadList from './ThreadList';

const userText = "How do I create an authentication endpoint using Flask and SQL Alchemy?"
const aiText = "Sure! Here's an example of how you can create an authentication endpoint using Flask and SQL Alchemy.\n\nFirst, you'll need to define a `User` model that represents your users. You can define this model with your desired fields and data types, such as an email and password field.\n\n```python\nfrom flask_sqlalchemy import SQLAlchemy\n\ndb = SQLAlchemy()\n\nclass User(db.Model):\n    id = db.Column(db.Integer, primary_key=True)\n    email = db.Column(db.String(255), unique=True, nullable=False)\n    password_hash = db.Column(db.String(255), nullable=False)\n```\n\nNext, you'll need to create an endpoint that accepts POST requests with the user's credentials. You can use the Flask `request` object to get the email and password from the request.\n\n```python\nfrom flask import request\n\n@app.route('/authenticate', methods=['POST'])\ndef authenticate():\n    email = request.json.get('email')\n    password = request.json.get('password')\n\n    user = User.query.filter_by(email=email).first()\n\n    if not user or not user.check_password(password):\n        return {'message': 'Invalid email or password'}, 401\n\n    # Logic to create and return JWT token\n```\n\nIn the above example, we first get the email and password from the request's JSON data. Then, we use SQL Alchemy to query for a user with the specified email. If the user is found, we check if the password matches using a method called `check_password` (which you'll need to define yourself to match your own password hashing implementation). If the password is invalid, we return a 401 error with a message indicating that the credentials are invalid.\n\nIf the user is authenticated, you can then generate and return a JWT token to the client.\n\nNote that this is just a basic example to get you started, and you'll want to add additional security measures such as rate limiting, IP whitelisting, and more depending on your application's needs."
const ChatInterface = () => {
  const { accessToken } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // 👇 Get input value
      //sendMessage(message);
    }
  };

  const [showThreads, setShowThreads] = useState(false);
  const openThreads = () => {
    setShowThreads(!showThreads);
  }

  return (
    <div className="App">
      <div className="chat-interface">
        <div className="header">
          <Row>
            <Col xs="auto">
              {showThreads && (
                <ExpandableSidebar onClose={() => setShowThreads(false)}>
                  <ThreadList />
                </ExpandableSidebar>
              )}
              <button onClick={openThreads}>=</button>
            </Col>
            <Col>
              Title of chat
            </Col>
            <Col xs="auto">
              <button>+</button>
            </Col>
          </Row>
        </div>
        <div className="main">
          <Row className="bg-secondary">
            <Col xs="auto">
              <ChatGPTIcon />
            </Col>
            <Col xs={10}>
              {userText}
            </Col>
          </Row>
          <Row>
            <Col xs="auto">
              <ChatGPTIcon />
            </Col>
            <Col xs={10}>
              <ReactMarkdown>{aiText}</ReactMarkdown>
            </Col>
          </Row>
        </div>
        <div className="footer">
          <InputGroup>
            <Form.Control
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button variant="outline-info" id="button-addon1">
              Button
            </Button>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
