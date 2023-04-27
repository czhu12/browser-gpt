import React from 'react';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Col, Row } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import ChatGPTIcon from './icons/ChatGPTIcon';
import ChatUserIcon from './icons/ChatUserIcon';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import CopyCodeButton from './CopyCodeButton';


const Message = ({ message }) => {
  const Pre = ({ children }) => <pre className="blog-pre">
    {children}
    <div className="mt-2">
      <CopyCodeButton>{children}</CopyCodeButton>
    </div>
  </pre>

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
          <ReactMarkdown
            className="post-markdown"
            linkTarget='_blank'
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}

            components={{
              pre: Pre,
              code({ node, inline, className = "blog-code", children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={a11yDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
      </Col>
    </Row>
  );
}
export default Message;
