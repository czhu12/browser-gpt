import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Col, Form, InputGroup, Row } from "react-bootstrap"
import ExpandableSidebar from './ExpandableSidebar';
import ThreadList from './ThreadList';
import { BASE_URL, createDocument, createMessage, createThread, getThread } from '../../../utils/api';
import { loadActiveThread, putActiveThread } from '../../../utils/storage';
import Message from './Message';
import AddIcon from './icons/AddIcon';
import MenuIcon from './icons/MenuIcon';
import io from "socket.io-client";
import { UserContext } from '../UserContext';
import OnlineStatus from './icons/OnlineStatus';
import NewChat from './NewChat';
import Commands, { COMMAND_SUMMARIZE_WEB_PAGE } from './Commands';
import { extractContentFromPage } from '../../../utils/chrome';
import TextareaAutosize from 'react-textarea-autosize';


let socket;
const ChatInterface = () => {
  const { accessToken } = useContext(UserContext);
  const [showThreadSideBar, setShowThreadSideBar] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingMessage, _setPendingMessage] = useState({user: '', ai: ''});
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const pendingMessageRef = useRef(pendingMessage);
  const [connected, setConnected] = useState(false);
  const setPendingMessage = (newPendingMessage) => {
    pendingMessageRef.current = newPendingMessage
    _setPendingMessage(pendingMessageRef.current)
  }

  const queryClient = useQueryClient();
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const { data: activeThread } = useQuery({ queryKey: ['activeThreadId'], queryFn: loadActiveThread });

  const createThreadIfNotExists = async () => {
    let currentActiveThread = activeThread;
    if (!currentActiveThread) {
      currentActiveThread = (await createThread()).data.thread;
      activeThreadMutation.mutate(currentActiveThread);
      //await queryClient.invalidateQueries({ queryKey: ['activeThreadId'] });
    }
    return currentActiveThread;
  }

  const [inputDisabled, setInputDisabled] = useState(false);
  const sendDocument = async (content) => {
    setInputDisabled(true);
    let currentActiveThread = await createThreadIfNotExists();
    createDocument(currentActiveThread.id, content);
    setInputDisabled(false);
  }

  const sendMessage = async () => {
    setMessage("");
    let currentActiveThread = await createThreadIfNotExists();
    messageMutation.mutate({threadId: currentActiveThread.id, text: message});
  }

  const onHotAction = async (command) => {
    if (command.key === COMMAND_SUMMARIZE_WEB_PAGE) {
      const response = await extractContentFromPage();
      const content = response.content;
      if (content) {
        sendDocument(content)
      } else {
        alert("No content to summarize")
      }
    }
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
    data: threadData,
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

  useEffect(() => {
    socket = io(BASE_URL);
    socket.on('connect', function() {
      console.log("Connected to socket");
      setConnected(true);
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    socket.off(`/user/${accessToken}`);
    socket.addEventListener(`/user/${accessToken}`, onIncomingSocketMessage);
  }, [])
  const onIncomingSocketMessage = (data) => {
    const newPendingMessage = { ...pendingMessageRef.current }
    newPendingMessage.ai += JSON.parse(data).payload.token
    setPendingMessage(newPendingMessage)
  }
  // Mutations
  const messageMutation = useMutation({
    mutationFn: async (data) => {
      setPendingMessage({user: data.text, ai: ''});
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
  }, [activeThreadMutation.isLoading, threadData, messageMutation.isLoading, pendingMessage]);

  const thread = threadData?.thread;
  const messages = thread?.messages || [];

  let finalMessages = messages;
  if (messageMutation.isLoading) {
    finalMessages = finalMessages.concat([
      { message_type: "USER", text: pendingMessageRef.current.user},
      { message_type: "AI", text: pendingMessageRef.current.ai }
    ])
  }

  return (
    <div className="App">
      <div className="chat-interface">
        <div
          className={`${showThreadSideBar && "pointer"}`}
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
                <div>
                  {thread?.title || "New Chat"}
                </div>
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
            }}
          >
            {!activeThread && <NewChat></NewChat>}
            {activeThread && (
              <div>
                {finalMessages.map((message) => {
                  return (
                    <Message message={message} />
                  );
                })}
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>
        </div>
        <div className="footer">
          <InputGroup>
            <TextareaAutosize
              id="chat-input"
              className="form-control"
              disabled={inputDisabled}
              autoFocus
              value={message}
              ref={inputRef}
              onChange={(e) => {
                setMessage(e.target.value)
              }}
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
