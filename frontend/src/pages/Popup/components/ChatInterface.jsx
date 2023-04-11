import React, { useState, useEffect, useRef } from 'react';
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
  const messagesEndRef = useRef(null);

  const queryClient = useQueryClient();
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
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
    mutationFn: async (data) => {
      activeThreadMutation.mutate({id: data.threadId});
      await createMessage(data)
    },
    onSuccess: () => {
      // Invalidate and refetch
      if (activeThread) {
        queryClient.invalidateQueries({ queryKey: ['threads', activeThread.id] });
      }
    },
  });
  const messages = threadData?.thread.messages || [];

  // This function will be called whenever the component updates
  useEffect(() => {
    console.log("scrolling!")
    //messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
  });

  return (
    <div className="App">
      <div className="chat-interface">
        <div className="header">
          <Row>
            <Col xs="auto">
              {showThreadSideBar && (
                <ExpandableSidebar onClose={() => setShowThreadSideBar(false)}>
                  <ThreadList onSelectThread={(thread) => {
                    activeThreadMutation.mutate(thread);
                    setShowThreadSideBar(false);
                  }} />
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

          { messageMutation.isLoading && <div className="my-3"><div className="spinner centered"></div></div> }
          <div ref={messagesEndRef}></div>
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
