import React, { useState, useEffect, useRef } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Col, Form, InputGroup, Row } from "react-bootstrap"
import ExpandableSidebar from './ExpandableSidebar';
import ThreadList from './ThreadList';
import { BASE_URL, createMessage, createThread, getThread } from '../../../utils/api';
import { loadActiveThread, putActiveThread } from '../../../utils/storage';
import Message from './Message';
import AddIcon from './icons/AddIcon';
import MenuIcon from './icons/MenuIcon';
import io from "socket.io-client";

const ChatInterface = () => {
  useEffect(() => {
    console.log("Trying to connect to http://localhost:3001")
    const socket = io("http://localhost:3001");
    socket.on('connect', function() {
      console.log("Hello!!!!");
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }, [])
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
      //await queryClient.invalidateQueries({ queryKey: ['activeThreadId'] });
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
        activeThreadMutation.mutate(null);
      }
    }
  })


  // Mutations
  const messageMutation = useMutation({
    mutationFn: async (data) => {
      setPendingMessage(data.text);
      return await createMessage(data)
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      if (activeThread) {
        queryClient.setQueryData(['threads', activeThread.id], data)
      }
    },
  });
  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: 'instant' });
  }, [activeThreadMutation.isLoading, threadData, messageMutation.isLoading]);

  const thread = threadData?.thread;
  const messages = thread?.messages || [];

  let finalMessages = messages;
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
                <a href="#" className="text-dark" onClick={() => activeThreadMutation.mutate(null)}><AddIcon /></a>
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
