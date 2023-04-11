import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { getThreads } from "../../../utils/api"
import { Card } from 'react-bootstrap';

const NewThread = ({onClick}) => {
  return (
    <a href="#" onClick={onClick} className="link-unstyled">
      <Card className="bg-transparent border border-white py-3 mb-1 thread-button">
        New Thread
      </Card>
    </a>
  )
}
const ThreadItem = ({thread, onClick}) => {
  return  (
    <a href="#" onClick={onClick} className="link-unstyled">
      <div className="py-3 mb-1 thread-button">
        Thread #{thread.id}
      </div>
    </a>
  )
}

const ThreadList = ({onSelectThread}) => {
  const { status, data, error, isFetching } = useQuery({ queryKey: ["thread-list"], queryFn: getThreads });
  return (
    <div id="thread-list">
      <NewThread onClick={() => onSelectThread(null)} />
      {data?.threads && data.threads.map((thread) => {
        return <ThreadItem thread={thread} onClick={() => {
          console.log(thread.id);
          onSelectThread(thread)
        }} />
      })}
    </div>
  )
};

export default ThreadList;
