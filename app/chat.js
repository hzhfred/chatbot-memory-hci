'use client';

import DropdownMenu from './components/DropdownMenu';
import RoleDropdownMenu from './components/RoleDropdownMenu';
import { runLLM } from './utils/api'; // Import API functions

const { TextArea } = Input;
import { Checkbox,Input } from 'antd';
// import type { CheckboxChangeEvent } from 'antd/es/checkbox';


import 'styles/chat.css';
import React, { useState, useEffect, useRef } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from "framer-motion";
import remarkGfm from 'remark-gfm';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { UndoIcon, KebabHorizontalIcon, TriangleRightIcon, PlusIcon, BookmarkFillIcon, BookmarkIcon,SquareIcon, StackIcon,CheckboxIcon } from '@primer/octicons-react';
import { withCoalescedInvoke } from 'next/dist/lib/coalesced-function';

export default function Chat() {
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

  /*
  //click out of edit to cancel and restore initial message
  useEffect(() => {
    document.addEventListener("mousedown", () => {
      setDropdownOpen(false);
      setRoleDropdownOpen(false);
    })
  });
  */

  useEffect(() => {
    textAreaRef.current.style.height = '20px'; // Replace with your desired initial height
  }, [])

  useEffect(() => {
    if (editMessageId && editTextAreaRef.current) {
      const textarea = editTextAreaRef.current;
      textarea.focus();

      // Resize textarea to fit content
      // textarea.style.height = '20px';
      // textarea.style.height = `${textarea.scrollHeight - 10}px`;
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
    // console.log('selected')
    // console.log(selected)
    if(checked && !selected.some(e => e.id === message.id)){
      selected.push({ id: message.id, content: message.content, role: message.role, visible: message.visible })
      // console.log(selected)
    }else{
      const unSelect = selected.filter(select => select.id !== message.id)
      setSelected(unSelect)
    }

  }
  

  const handleNewMessage = () => {

    let emptyMessage;

    if (messages.length === 0 || (messages[messages.length - 1].role === "assistant")) {
      emptyMessage = { id: uuidv4(), role: "user", content: "", visible: true };
    } else {
      emptyMessage = { id: uuidv4(), role: "assistant", content: "", visible: true };
    };

    setMessages(prevMessages => [...prevMessages, emptyMessage]);
  }

  const handleChatReset = () => {
    setMessages([]);
    setEditMessageId(null);
    setEdit("")
    setHoveredMessageId(null);
    setDropdownMessageId(null);
    setDropdownOpen(false);
    setIsTyping(false);
  };


  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(messages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMessages(items);
  };

  const handleSummarize = async () => {
    // console.log('selected')
    // console.log(selected)
    // return
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

      // const messagesnew = messages.map(msg =>
      //   selected.find(s => s.id === msg.id) ? {...msg, visible: false} : msg
      // );
      // console.log('______')
      // console.log(messagesnew)


    runLLM(messageList).then(response => { 
      console.log(response)


      const summary = { id: uuidv4(), role: "summary", content: String(response), visible: true };
      setMessages(prevMessages => [...prevMessages, summary]);

    }).then(()=>{
      // const messagesnew = messages.map(msg =>
      //   selected.find(s => s.id === msg.id) ? {...msg, visible: false} : msg
      // );
      setMessages(prevMessages => prevMessages.map(msg =>
        selected.find(s => s.id === msg.id) ? {...msg, visible: false} : msg
      ));
    });



  };

  const handleSend = async () => {

    const systemMessage = {
      role: "system",
      content: "You are a design bot that helps designers think through stakeholders, goals, obstacles, and solutions. Respond in full markdown format with emojis. Respond as conversationally and concisely as possible.",
    };

    const prompt = message.trim();
    const userMessage = { id: uuidv4(), role: "user", content: String(prompt), visible: true };
    const visibleMessages = messages.filter(msg => msg.visible && (msg.content !== ""))

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
            <Droppable droppableId="messages">
              {(provided) => (
                <ul className="message-list" {...provided.droppableProps} ref={provided.innerRef}>
                  {messages.map((msg, index) =>
                    <Draggable key={msg.id} draggableId={msg.id} index={index} >
                      {(provided) => (
                        <AnimatePresence>
                          <motion.li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            onMouseEnter={() => handleMouseEnter(msg.id)}
                            onMouseLeave={handleMouseLeave}
                            initial={{ opacity: 0, y: 10 }} // animate from
                            animate={{ opacity: 1, y: 0 }} // animate to
                            exit={{ opacity: 0, x: -10 }} // animate out
                            transition={{ duration: 0.5, ease: "easeInOut" }} // animation duration
                          >
                            <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} onMouseEnter={() => handleMouseEnter(msg.id)} onMouseLeave={handleMouseLeave}>
                              <div className={msg.visible ? 'message-wrapper' : 'message-wrapper message-hidden'}>
                                <div className="message-role">
                                  <div className='role-box'>
                                  <Checkbox onChange = {(e)=>
                                    handleSelect(e.target.checked,msg)
                                    }></Checkbox>
                                  {/* <button
                                        className="message-actions"
                                        onClick={(e) => {
                                          handleSelect(msg)
                                        }}>
                                        {selected.some(e => e.id === msg.id) ? <CheckboxIcon size={16} /> : <SquareIcon size={24} />}
                                  </button> */}
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
                                          // setSelect={handleSelect}
                                          // selected={selected}
                                        />


                                </div>
                                <div className="message-content">
                                  {editMessageId === msg.id ? (
                                    <div>
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
                                    </div>
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
                                {/* <div className="action-wrapper">
                                  {((dropdownMessageId === msg.id) || hoveredMessageId === msg.id) && (
                                    <button className="message-actions" onClick={(e) => {
                                      handleDropdownToggle(msg.id)
                                    }}>
                                      <KebabHorizontalIcon />
                                    </button>
                                  )}
                                  
                                  <button
                                        className="message-actions"
                                        onClick={(e) => {
                                          handleSelect(msg)
                                        }}>
                                        {selected.some(e => e.id === msg.id) ? <CheckboxIcon size={16} /> : <SquareIcon size={24} />}
                                  </button>
                                  
                                  <AnimatePresence>
                                    {dropdownMessageId === msg.id && dropdownOpen && (
                                      <motion.div
                                        initial={{ opacity: 0, scale: 0.95, x: -10 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, x: -10 }}
                                        transition={{ duration: 0.1 }}
                                      >
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
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div> */}
                              </div>
                            </li>
                          </motion.li>
                        </AnimatePresence>
                      )}
                    </Draggable>
                  )}
                  {provided.placeholder}
                  {isTyping && (
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </motion.div>
        <motion.div layoutId="input-container" layout transition={{ duration: 0.5 }} className="input-container">
          <div className="input-container" style={{ marginTop: 'auto' }}>
            <button title='New Chat' onClick={handleChatReset} className='input-button'><UndoIcon size={16} /></button>
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
    </div>
  );
}
