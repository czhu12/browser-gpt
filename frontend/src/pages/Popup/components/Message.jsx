import React from 'react';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
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
    <div className={`py-3 text-start ${message.message_type === "USER" ? "bg-light" : ""}`}>
      <div className="px-4">
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
              code({ node, inline, className = "language-code", children, ...props }) {
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
            {message.text.replace(/\n/g, "  \n")}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
export default Message;
