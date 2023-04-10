import React, { useState, useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap"
import ExpandableSidebar from './ExpandableSidebar';
import ThreadList from './ThreadList';
import { createMessage, createThread, getThread } from '../../../utils/api';
import { loadActiveThread, putActiveThread } from '../../../utils/storage';
import Message from './Message';

const ChatInterface = () => {
  const [showThreadSideBar, setShowThreadSideBar] = useState(false);
  const [message, setMessage] = useState("");

  const queryClient = useQueryClient();
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log("enter not implemented yet!")
    }
  };

  const { data: activeThread } = useQuery({ queryKey: ['activeThreadId'], queryFn: loadActiveThread });

  const sendMessage = async () => {
    let currentActiveThread = activeThread;
    setMessage("");
    if (!currentActiveThread) {
      currentActiveThread = (await createThread()).data.thread;
      activeThreadMutation.mutate(currentActiveThread);
      queryClient.invalidateQueries({ queryKey: ['activeThreadId'] });
    }
    messageMutation.mutate({threadId: currentActiveThread.id, text: message});
  }

  const activeThreadMutation = useMutation({
    mutationFn: putActiveThread,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['activeThreadId'] });
    },
  });

  // Queries
  const {
    isError,
    data: threadData,
    isFetching,
    isRefetching
  } = useQuery({ queryKey: ['threads', (activeThread || {}).id], queryFn: () => getThread(activeThread.id), enabled: !!activeThread})

  // Mutations
  const messageMutation = useMutation({
    mutationFn: (data) => {
      activeThreadMutation.mutate({id: data.threadId});
      createMessage(data)
    },
    onSuccess: () => {
      // Invalidate and refetch
      if (activeThread) {
        queryClient.invalidateQueries({ queryKey: ['threads', activeThread.id] });
      }
    },
  });
  const messages = threadData?.thread.messages || [];

  return (
    <div className="App">
      <div className="chat-interface">
        <div className="header">
          <Row>
            <Col xs="auto">
              {showThreadSideBar && (
                <ExpandableSidebar onClose={() => setShowThreadSideBar(false)}>
                  <ThreadList onSelectThread={(thread) => activeThreadMutation.mutate(thread)} />
                </ExpandableSidebar>
              )}
              <button onClick={() => setShowThreadSideBar(!showThreadSideBar)}>=</button>
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
          {messages.map((message) => {
            console.log(message);
            return (
              <Message message={message} />
            );
          })}
        </div>
        <div className="footer">
          <InputGroup>
            <Form.Control
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button variant="primary" onClick={sendMessage}>
              Send
            </Button>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
