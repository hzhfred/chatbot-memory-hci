'use client';

import DropdownMenu from './components/DropdownMenu';
import RoleDropdownMenu from './components/RoleDropdownMenu';
import { runLLM } from './utils/api';
const { TextArea } = Input;
import { LoadingOutlined, SwitcherOutlined, UndoOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined className='typing-indicator' spin />;
import { Checkbox, Input, Spin } from 'antd';
import 'styles/chat.css';
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from "framer-motion";
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { UndoIcon, TriangleRightIcon, PlusIcon, StackIcon, DuplicateIcon } from '@primer/octicons-react';

export default function Chat() {
  const [chats, setChats] = useState({chat1: []});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [editMessageId, setEditMessageId] = useState(null);
  const [edit, setEdit] = useState("")
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [dropdownMessageId, setDropdownMessageId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleDropdownId, setRoleDropdownId] = useState(null);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selected, setSelected] = useState([]);
  const textAreaRef = useRef(null);
  const editTextAreaRef = useRef(null);

  useEffect(() => {
    textAreaRef.current.style.height = '20px';
  }, [])

  useEffect(() => {
    if (editMessageId && editTextAreaRef.current) {
      const textarea = editTextAreaRef.current;
      textarea.focus();

    }
  }, [editMessageId, edit]);

  const handleMouseEnter = (id) => {
    setHoveredMessageId(id);
  };

  const handleMouseLeave = () => {
    setHoveredMessageId(null);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = '20px';
    e.target.style.height = `${e.target.scrollHeight - 10}px`;
  };

  const handleEditChange = (e) => {
    setEdit(e.target.value);
    e.target.style.height = '20px';
    e.target.style.height = `${e.target.scrollHeight - 10}px`;
  };

  const handleEdit = (index, edit) => {
    const newMessages = [...messages];
    newMessages[index].content = edit;
    setMessages(newMessages);
    setEditMessageId(null);
    setEdit('');
  };

  const handleDropdownToggle = (id) => {
    if (dropdownOpen) {
      setDropdownMessageId(null);
      setDropdownOpen(false);
      if (dropdownMessageId != id) {
        setDropdownMessageId(id);
        setDropdownOpen(true);
      };
    } else {
      setDropdownMessageId(id);
      setDropdownOpen(true);
    };
  };

  const handleRoleDropdownToggle = (id) => {
    if (roleDropdownOpen) {
      setRoleDropdownId(null);
      setRoleDropdownOpen(false);
      if (roleDropdownId != id) {
        setRoleDropdownId(id);
        setRoleDropdownOpen(true);
      };
    } else {
      setRoleDropdownId(id);
      setRoleDropdownOpen(true);
    };
  };

  const handleSelect = (checked,message) => {

    if(checked && !selected.some(e => e.id === message.id)){
      selected.push({ id: message.id, content: message.content, role: message.role, visible: message.visible })
    } else {
      const unSelect = selected.filter(select => select.id !== message.id)
      setSelected(unSelect)
    }
  }
  
  const handleNewMessage = (id) => {
    let emptyMessage;
  
    if (!chats[id] || chats[id].length === 0 || (chats[id][chats[id].length - 1].role === "assistant")) {
      emptyMessage = { id: uuidv4(), role: "user", content: "", visible: true };
    } else {
      emptyMessage = { id: uuidv4(), role: "assistant", content: "", visible: true };
    };
  
    setChats({
      ...chats,
      [id]: chats[id] ? [...chats[id], emptyMessage] : [emptyMessage]
    });
  }

  const handleNewChat = (id) => {
    setChats({
      ...chats,
      [id]: [],
    });
  }
  
  const handleChatReset = () => {

    setChats({chat1: []});
    setMessages([]);
    setEditMessageId(null);
    setEdit("")
    setHoveredMessageId(null);
    setDropdownMessageId(null);
    setDropdownOpen(false);
    setIsTyping(false);
    setSelected([]);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
  
    const { source, destination } = result;
  
    if (source.droppableId !== destination.droppableId) {
      const sourceChatItems = Array.from(chats[source.droppableId]);
      const destChatItems = Array.from(chats[destination.droppableId]);
      const [removed] = sourceChatItems.splice(source.index, 1);
      destChatItems.splice(destination.index, 0, removed);
  
      const newChats = {
        ...chats,
        [source.droppableId]: sourceChatItems,
        [destination.droppableId]: destChatItems
      };
  
      setChats(newChats);
    } else {
      const chatItems = Array.from(chats[source.droppableId]);
      const [reorderedItem] = chatItems.splice(source.index, 1);
      chatItems.splice(destination.index, 0, reorderedItem);
  
      setChats({...chats, [source.droppableId]: chatItems});
    }
  };
  
  const handleSummarize = async () => {

    const summaryMessage = {
      role: "user",
      content: "Create a very concise summary of the above messages.",
    };

    const messageList = [...selected
      .filter(msg => msg.visible)
      .map(msg => ({
          role: msg.role === "summary" ? "user" : msg.role,
          content: msg.content
      })), summaryMessage];
      console.log(messageList)

    runLLM(messageList).then(response => { 
      console.log(response)


      const summary = { id: uuidv4(), role: "summary", content: String(response), visible: true };
      setMessages(prevMessages => [...prevMessages, summary]);

    }).then(()=>{

      setMessages(prevMessages => prevMessages.map(msg =>
        selected.find(s => s.id === msg.id) ? {...msg, visible: false} : msg
      ));
    });
  };

  const handleSend = async (chatId) => {

    const systemMessage = {
      role: "system",
      content: "You are a helpful assistant. Respond as concisely as possible in full markdown format.",
    };

    const prompt = message.trim();
    const userMessage = { id: uuidv4(), role: "user", content: String(prompt), visible: true };
    const visibleMessages = chats[chatId].filter(msg => msg.visible && (msg.content !== ""))

    if (prompt === "" && visibleMessages.length === 0) {
      return;
    } else {
      setMessages(prevMessages => {

        const newMessages = [...prevMessages]

        if (prompt !== "") {
          newMessages.push(userMessage);
        }

        setMessage("");

        const messageList = [systemMessage, ...newMessages
          .filter(msg => msg.visible)
          .map(msg => ({
            role: msg.role,
            content: msg.content
          }))];

        setIsTyping(true);

        runLLM(messageList).then(response => {
          setIsTyping(false);
          const assistantMessage = { id: uuidv4(), role: "assistant", content: String(response), visible: true }
          setMessages(prevMessages => [...prevMessages, assistantMessage]);
        });

        return newMessages;
      });
    }
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter wrapLines={true} style={coy} language={match[1]} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -50, x: -65 },
    visible: { opacity: 0.1, y: -200, x: -65, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -300, transition: { duration: 0.2 } }
  }

  return (
    <div className="chat-container">
      <AnimatePresence>
        {messages.length === 0 &&
          <motion.div
            className="title"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Memory Sandbox
          </motion.div>
        }
      </AnimatePresence>
      <div className="flex-container">
        <motion.div layoutId='message-list' className="message-list">
          <DragDropContext onDragEnd={handleOnDragEnd}>
          {Object.keys(chats).map((chatId) => (
            <div key={chatId} className="chat-container">
              <Droppable key={chatId} droppableId={chatId}>
                {(provided) => (
                  <ul className="message-list" {...provided.droppableProps} ref={provided.innerRef}>
                    {chats[chatId].map((msg, index) =>
                      <Draggable key={msg.id} draggableId={msg.id} index={index}>
                        {(provided) => (
                          <AnimatePresence>
                            <motion.li
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              onMouseEnter={() => handleMouseEnter(msg.id)}
                              onMouseLeave={handleMouseLeave}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                              <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} onMouseEnter={() => handleMouseEnter(msg.id)} onMouseLeave={handleMouseLeave}>
                                <div className={msg.visible ? 'message-wrapper' : 'message-wrapper message-hidden'}>
                                  <div className="message-role">
                                    <div className='role-box'>
                                    <Checkbox 
                                      onChange = {(e)=>
                                      handleSelect(e.target.checked,msg)
                                      }
                                    ></Checkbox>
                                    <span className="role" onClick={(e) => {
                                      e.stopPropagation();
                                      handleRoleDropdownToggle(msg.id)
                                    }}>
                                      {msg.role}
                                    </span>
                                    </div>
                                    <AnimatePresence>
                                      {roleDropdownId === msg.id && roleDropdownOpen && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                          transition={{ duration: 0.1 }}
                                        >
                                          <RoleDropdownMenu
                                            className='role-dropdown-menu'
                                            message={msg}
                                            onClose={handleRoleDropdownToggle}
                                          />
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                    <DropdownMenu
                                            className='dropdown-menu'
                                            message={msg}
                                            onClose={handleDropdownToggle}
                                            messages={messages}
                                            setMessages={setMessages}
                                            setDropdownMessageId={setDropdownMessageId}
                                            setDropdownOpen={setDropdownOpen}
                                            setEditMessageId={setEditMessageId}
                                            setEdit={setEdit}
                                          />
                                  </div>
                                  <div className="message-content">
                                    {editMessageId === msg.id ? (
                                        <TextArea
                                          ref={editTextAreaRef}
                                          autoSize
                                          size='small'
                                          className='edit-box'
                                          type='text'
                                          defaultValue={edit}
                                          onChange={e => { handleEditChange(e) }}
                                          onKeyDown={e => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                              e.preventDefault();
                                              handleEdit(index, edit);
                                            }
                                          }}
                                        />
                                    ) : (
                                      <div className='message-text' onClick={e => {
                                        setEdit(msg.content.toLowerCase());
                                        setEditMessageId(msg.id);
                                      }}>
                                        <div className="markdown-container">
                                          {
                                            msg.content.trim() !== '' ?
                                              <ReactMarkdown components={components} children={msg.content.toLowerCase().split('\n').map(line => line + '  ').join('\n')} remarkPlugins={remarkGfm} /> :
                                              <p className='placeholder-markdown' >type a message...</p>
                                          }
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </li>
                            </motion.li>
                          </AnimatePresence>
                        )}
                        </Draggable>
                      )}
                      {provided.placeholder}
                    </ul>
                  )}
              </Droppable>
              <motion.div layoutId="input-container" layout transition={{ duration: 0.5 }} className="input-container">
                <div className="input-container" style={{ marginTop: 'auto' }}>
                  <button title='Add Chat' onClick={handleNewChat} className='input-button'><DuplicateIcon size={16} /></button>
                  <button title='Reset Chat' onClick={handleChatReset} className='input-button'><UndoIcon size={16} /></button>
                  <button title='Add Message' onClick={handleNewMessage} className='input-button'><PlusIcon size={24} /></button>
                  <button title='Summarize' onClick={() => handleSummarize()} className='input-button'><StackIcon size={16} /></button>
                  <textarea
                    ref={textAreaRef}
                    type="text"
                    className='input-box'
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <button title='Send' onClick={handleSend} className='input-button'><TriangleRightIcon size={24} /></button>
                </div>
              </motion.div>
            </div>
            ))}
          </DragDropContext>
        </motion.div>
      </div>
    </div>
  );
}
