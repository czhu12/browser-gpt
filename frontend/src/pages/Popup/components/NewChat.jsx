import React from 'react';
import Commands, { COMMAND_SUMMARIZE_WEB_PAGE } from './Commands';

const NewChat = () => {
  return (
    <div className="mt-5 pt-5">
      <Commands onClick={async (command) => {
        if (command.key === COMMAND_SUMMARIZE_WEB_PAGE) {
          const tab = await chrome.tabs.query({active: true, currentWindow: true});
          debugger;
          const response = await chrome.tabs.sendMessage(tab[0].id, {action: "EXTRACT"});
          console.log(response)
        }
      }} />
    </div>
  )
};

export default NewChat;
