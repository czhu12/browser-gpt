import React from 'react';
import { Badge, Card } from "react-bootstrap"

export const COMMAND_READ_WEB_PAGE = "READ_WEB_PAGE";
const COMMANDS = [
  {
    key: COMMAND_READ_WEB_PAGE,
    name: "Read",
  },
]

const CommandCard = ({command, onClick}) => {
  return (
    <Badge>
      <a href="#" onClick={() => onClick(command)} className="link-unstyled">
        {command.name}
      </a>
    </Badge>
  )
}

const Commands = ({onClick}) => {
  return <div className="commands text-start">
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
