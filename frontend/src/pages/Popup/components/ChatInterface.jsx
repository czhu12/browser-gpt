import React, { useState, useEffect, useRef } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Col, Form, InputGroup, Row } from "react-bootstrap"
import ExpandableSidebar from './ExpandableSidebar';
import ThreadList from './ThreadList';
import { createMessage, createThread, getThread } from '../../../utils/api';
import { loadActiveThread, putActiveThread } from '../../../utils/storage';
import Message from './Message';
import AddIcon from './icons/AddIcon';
import MenuIcon from './icons/MenuIcon';

const ChatInterface = () => {
  const [showThreadSideBar, setShowThreadSideBar] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingMessage, setPendingMessage] = useState("");
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
  } = useQuery({
    queryKey: ['threads', (activeThread || {}).id],
    queryFn: () => getThread(activeThread.id),
    enabled: !!activeThread,
    onError: (error) => {
      if (error.code === "ERR_BAD_RESPONSE") {
        console.log("Changing thread to null");
        activeThreadMutation.mutate(null);
      }
    }
  })
  console.log(isError);

  // Mutations
  const messageMutation = useMutation({
    mutationFn: async (data) => {
      setPendingMessage(data.text);
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
  const thread = threadData?.thread;
  const messages = thread?.messages || [];

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
  });
  let finalMessages = messages;
  finalMessages = finalMessages.concat([{message_type: "USER", text: pendingMessage}, {text: "And to remove a role for a user:\n\n```python\nuser = User.query.get(1)\nrole = Role.query.get(1)\nuser.roles.remove(role)\ndb.session.commit()\n```", message_type: "AI"}])
  if (messageMutation.isLoading) {
    finalMessages = finalMessages.concat([{message_type: "USER", text: pendingMessage}, {status: "pending", message_type: "AI"}])
  }

  return (
    <div className="App">
      <div className="chat-interface">
        <div className={`${showThreadSideBar && "pointer"}`}
          onClick={() => {
            showThreadSideBar && setShowThreadSideBar(false);
          }}>
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
                <a className="text-dark" href="#" onClick={() => setShowThreadSideBar(!showThreadSideBar)}><MenuIcon /></a>
              </Col>
              <Col>
                <div>{thread?.title || "New Chat"}</div>
              </Col>
              <Col xs="auto">
                <a href="#" className="text-dark" onClick={() => {}}><AddIcon /></a>
              </Col>
            </Row>
          </div>
          <div
            className="main"
            onClick={() => {
              showThreadSideBar && setShowThreadSideBar(false);
            }}>
            {finalMessages.map((message) => {
              return (
                <Message message={message} />
              );
            })}

            <div ref={messagesEndRef}></div>
          </div>
        </div>
        <div className="footer">
          <InputGroup>
            <Form.Control
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="write something"
            />
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
