import React from 'react';
import { Col, Row } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import ChatGPTIcon from './ChatGPTIcon';
import ChatUserIcon from './ChatUserIcon';

const Message = ({message}) => {
  return (
    <Row className={`text-start ${message.message_type === "USER" ? "bg-secondary" : "bg-light"}`}>
      <Col xs="auto">
        {message.message_type === "USER" ? <ChatUserIcon /> : <ChatGPTIcon />}
      </Col>
      <Col xs={10}>
        <ReactMarkdown>
          {message.text}
        </ReactMarkdown>
      </Col>
    </Row>
  );
}
export default Message;
