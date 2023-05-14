import React from 'react';
import { Card } from "react-bootstrap"

export const COMMAND_SUMMARIZE_WEB_PAGE = "summarize_web_page";
const COMMANDS = [
  {
    key: COMMAND_SUMMARIZE_WEB_PAGE,
    name: "Summarize",
  },
]

const CommandCard = ({command, onClick}) => {
  return (
    <a href="#" onClick={() => onClick(command)} className="link-unstyled">
      <Card className="bg-transparent border border-white py-3 mb-1 thread-button">
        {command.name}
      </Card>
    </a>
  )
}

const Commands = ({onClick}) => {
  return <div className="commands">
    {COMMANDS.map((command) => {
      return (
        <CommandCard
          command={command}
          onClick={onClick}
        />
      )
    })}
  </div>
};

export default Commands;
