import React from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import ChatGPTIcon from './ChatGPTIcon';
import ChatUserIcon from './ChatUserIcon';

const Message = ({ message }) => {
  return (
    <Row className={`py-3 text-start ${message.message_type === "USER" ? "bg-light" : ""}`}>
      <Col xs="auto">
        {message.message_type === "USER" ? <ChatUserIcon /> : <ChatGPTIcon />}
      </Col>
      <Col xs={10}>
        {message.status === "pending" && (
          <div className="my-3"><div className="spinner centered"></div></div>
        )}
        {message.status !== "pending" && (
          <ReactMarkdown>
            {message.text}
          </ReactMarkdown>
        )}
      </Col>
    </Row>
  );
}
export default Message;
