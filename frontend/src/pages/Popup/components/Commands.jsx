import React from 'react';

const Command = ({onClick}) => {
  return (
    <a href="#" onClick={onClick} className="link-unstyled">
      <Card className="bg-transparent border border-white py-3 mb-1 thread-button">
        New Thread
      </Card>
    </a>
  )
}

export const COMMANDS = [
  {
    key: "summarize_web_page",
    name: "Summarize",
  },
  {
    key: "summarize_web_page",
    name: "Summarize",
  },
  {
    key: "summarize_web_page",
    name: "Summarize",
  }
]
const Commands = ({onSelectThread}) => {
  return <div>

  </div>
};

export default Commands;
