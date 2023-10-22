'use client';

import DropdownMenu from './components/DropdownMenu';
import RoleDropdownMenu from './components/RoleDropdownMenu';
import { LoadingOutlined, SwitcherOutlined, UndoOutlined, CaretDownOutlined, DownOutlined, EllipsisOutlined, BarsOutlined, AppstoreOutlined } from '@ant-design/icons';
const antIcon = <LoadingOutlined className='typing-indicator' spin />;
import { Checkbox, Input, Spin, Button, Space, FloatButton, Tooltip, Dropdown, Menu, Segmented, Col, InputNumber, Row, Slider } from 'antd';
const { TextArea } = Input;
import 'styles/chat.css';
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence, color } from "framer-motion";
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { UndoIcon, TriangleRightIcon, PlusIcon, StackIcon, DuplicateIcon, DashIcon, ZapIcon, NorthStarIcon, TrashIcon } from '@primer/octicons-react';

export default function Chat() {
  const [models, setModels] = useState({});
  const [streamingId, setStreamingId] = useState(null);
  const [loadings, setLoadings] = useState({});
  const [chats, setChats] = useState({ [`chat-${uuidv4()}`]: [] });
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState({});
  const [editMessageId, setEditMessageId] = useState(null);
  const [dropdownMessageId, setDropdownMessageId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [edit, setEdit] = useState("")
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [selected, setSelected] = useState([]);
  const [summaryPrompt, setSummaryPrompt] = useState('Create a very concise summary of the above messages.');
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const textAreaRef = useRef(null);
  const editTextAreaRef = useRef(null);

  useEffect(() => {
    if (editMessageId && editTextAreaRef.current) {
      const textarea = editTextAreaRef.current;
      textarea.focus();
    }
  }, [editMessageId, edit]);

  const hasSelectedMessage = (chatId) => {
    const chat = chats[chatId];
    const hasSelected = chat.some(message => message.selected);
    return hasSelected;
  };

  const handleSummarizeHover = (chatId) => {
    setHoveredChatId(chatId);
  };

  const handleSummarizeHoverLeave = () => {
    setHoveredChatId(null);
  };

  const handleMouseEnter = (id) => {
    setHoveredMessageId(id);
  };

  const handleMouseLeave = () => {
    setHoveredMessageId(null);
  };

  const handleInputChange = (e, chatId) => {
    const newMessage = e.target.value;
    setMessages(prevMessages => ({ ...prevMessages, [chatId]: newMessage }));
  };

  const handleEditChange = (e) => {
    setEdit(e.target.value);
    e.target.style.height = '20px';
    e.target.style.height = `${e.target.scrollHeight - 10}px`;
  };

  const handleEdit = (chatId, messageId, edit) => {
    setChats(prevChats => {
      const newChats = { ...prevChats };
      const chat = newChats[chatId];
      const messageIndex = chat.findIndex(msg => msg.id === messageId);
      if (messageIndex !== -1) {
        chat[messageIndex].content = edit;
      }
      return newChats;
    });
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

  const handleRole = (role, msgId, chatId) => {
    return () => {
      setChats(prevChats => {
        const newChats = { ...prevChats };
        const chat = newChats[chatId];
        const messageIndex = chat.findIndex(msg => msg.id === msgId);
        if (messageIndex !== -1) {
          chat[messageIndex].role = role;
        }
        return newChats;
      });
    };
  };

  const handleSelect = (checked, message, chatId) => {
    if (checked && !selected.some(e => e.id === message.id)) {
      setSelected(prevSelected => [...prevSelected, { id: message.id, content: message.content, role: message.role, visible: message.visible, child: message.child, selected: true}]);
    } else {
      setSelected(prevSelected => prevSelected.filter(select => select.id !== message.id));
    }
    // Update the 'chats' state to reflect the selection status
    setChats(prevChats => {
      // If the chatId doesn't exist, return the previous chats state
      if (!prevChats[chatId]) return prevChats;
      // Update the specific message's 'selected' property in the chat
      const updatedChat = prevChats[chatId].map(msg => {
        if (msg.id === message.id) {
          return { ...msg, selected: checked };
        }
        return msg;
      });
      // Return the updated chats state
      return { ...prevChats, [chatId]: updatedChat };
    });
  };

  const handleNewMessage = (chatId) => {

    const systemMessage = {
      id: `message-${uuidv4()}`,
      role: "system",
      content: "You are a helpful assistant. Respond as concisely as possible in full markdown format.",
      visible: true,
      child: false,
      selected: false,
    };

    let emptyMessage;

    if (!chats[chatId] || chats[chatId].length === 0 || (chats[chatId][chats[chatId].length - 1].role === "assistant")) {
      emptyMessage = { id: `message-${uuidv4()}`, role: "user", content: "", visible: true, child: false, selected: false };
    } else {
      emptyMessage = { id: `message-${uuidv4()}`, role: "assistant", content: "", visible: true, child: false, selected: false };
    };

    setChats({
      ...chats,
      [chatId]: chats[chatId].length === 0 ? [systemMessage, ...chats[chatId], emptyMessage] : [...chats[chatId], emptyMessage]
    });
  };

  const handleAddChat = (rightDirection) => {

    if (rightDirection) {
    setChats(chats => ({
      ...chats,
      [`chat-${uuidv4()}`]: [],
    }));
    } else {
      setChats(chats => ({
        [`chat-${uuidv4()}`]: [],
        ...chats,
      }));
    }
  };

  const handleSubtractChat = (chatId) => {
    const chatKeys = Object.keys(chats);
    setChats(chats => {
      if (!(chatId in chats) || chatKeys.length === 1) {
        return chats; // Return unchanged if chatId doesn't exist
      }
  
      const { [chatId]: _, ...rest } = chats;
  
      return rest;
    });
  };

  const handleTotalReset = () => {
    setChats({ chat1: [] });
    setEditMessageId(null);
    setEdit("");
    setHoveredMessageId(null);
    setDropdownMessageId(null);
    setDropdownOpen(false);
    setIsTyping(false);
    setSelected([]);
  };

  const handleChatReset = (chatId) => {
    setChats(prevChats => {
      const newChats = { ...prevChats };
      newChats[chatId] = [];
      return newChats;
    });
    setEditMessageId(null);
    setEdit("");
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

      setChats({ ...chats, [source.droppableId]: chatItems });
    }
  };

  const handleSummarize = async (chatId) => {

    setLoadings(prevLoadings => ({ ...prevLoadings, [chatId]: true }));

    const summaryPromptMessage = {
      role: "user",
      content: summaryPrompt,
    };
  
    // Get the chat instance for the provided chatId
    const chatInstance = chats[chatId];
  
    // Extract the IDs from the selected message objects
    const selectedIds = selected.map(msg => msg.id);
  
    // Construct the messageList by iterating over the chatInstance and checking if each message ID exists in the selectedIds
    const messageList = chatInstance
      .filter(msg => msg.visible)
      .filter(msg => {
        return selectedIds.includes(msg.id) && msg.visible;
      })
      .map(msg => ({
        role: msg.role === "summary" ? "user" : msg.role,
        content: msg.content
      }));
  
    // Append the summaryMessage at the start
    const summarizePrompt = [...messageList, summaryPromptMessage];
    
    const summaryId = `message-${uuidv4()}`;
    
    const summaryMessage = { id: summaryId, role: "summary", content: "", visible: true, child: false, selected: false, children: messageList, cascade: false };

    setStreamingId(summaryId);
    setChats((prevChats) => {
      return {
        ...prevChats,
        [chatId]: [...prevChats[chatId].filter(msg => !selectedIds.includes(msg.id)), summaryMessage]
      };
    });

    const response = await fetch("/api/langchain", {
      method: "POST",
      body: JSON.stringify({
        messages: summarizePrompt,
        modelName: models[chatId] || 'gpt-3.5-turbo',
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const text = new TextDecoder().decode(value);
      setChats((prevChats) => {
        // return the previous chats unchanged if there's no chat with the provided chatId
        if (!prevChats[chatId]) return prevChats;
      
        // map through the messages and update the content of the matching message.
        const updatedMessages = prevChats[chatId].map(message => 
          message.id === summaryId 
            ? { ...message, content: message.content + text }
            : message
        );
      
        return {
          ...prevChats,
          [chatId]: updatedMessages
        };
      });
      
    }

    setLoadings(prevLoadings => ({ ...prevLoadings, [chatId]: false }));
    setSelected([]);
  };

  const handleCascade = (chatId, messageId) => { 
    setChats(prevChats => {
      const newChats = { ...prevChats };
      const chat = newChats[chatId];
      const messageIndex = chat.findIndex(msg => msg.id === messageId);
      if (messageIndex !== -1) {
        chat[messageIndex].cascade = !chat[messageIndex].cascade; // toggle the value
      }
      return newChats;
    });
  };

  const handleSetModel = (modelName, chatId) => {
    setModels( prevModels => ({ ...prevModels, [chatId]: modelName }));
  };

  const handleSend = async (chatId) => {

    const prompt = messages[chatId] ? messages[chatId].trim() : "";
    const visibleMessages = chats[chatId].filter(msg => msg.visible && (msg.content !== ""));

    if (prompt === "" && visibleMessages.length === 0) {
      return;
    }

    setLoadings(prevLoadings => ({ ...prevLoadings, [chatId]: true }));

    const systemMessage = {
      id: `message-${uuidv4()}`,
      role: "system",
      content: "You are a helpful assistant. Respond as concisely as possible in full markdown format.",
      visible: true,
      child: false,
      selected: false,
    };

    const userMessage = { id: `message-${uuidv4()}`, role: "user", content: String(prompt), visible: true, child: false, selected: false };

    const currentChat = prompt !== "" ? [...chats[chatId], userMessage] : chats[chatId];

    if (chats[chatId].length === 0) {
      currentChat.unshift(systemMessage);
      setChats((prevChats) => {
        return {
          ...prevChats,
          [chatId]: [systemMessage, ...prevChats[chatId]]
        };
      });
    }

    if (prompt !== "") {
      
      setChats((prevChats) => {
        return {
          ...prevChats,
          [chatId]: [...prevChats[chatId], userMessage]
        };
      });
    }

    setMessages(prevMessages => ({ ...prevMessages, [chatId]: '' }));

    const messageList = [...currentChat
      .filter(msg => msg.visible)
      .map(msg => ({
        role: msg.role === "summary" ? "user" : msg.role,
        content: msg.content
      }))
    ];

    console.log(messageList)

    const messageId = `message-${uuidv4()}`;

    const assistantMessage = { id: messageId, role: "assistant", content: "", visible: true, child: false, selected: false };

    setStreamingId(messageId);
    setChats((prevChats) => {
      return {
        ...prevChats,
        [chatId]: [...prevChats[chatId], assistantMessage]
      };
    });

    const response = await fetch("/api/langchain", {
      method: "POST",
      body: JSON.stringify({
        messages: messageList,
        modelName: models[chatId] || 'gpt-3.5-turbo',
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const text = new TextDecoder().decode(value);
      setChats((prevChats) => {
        // return the previous chats unchanged if there's no chat with the provided chatId
        if (!prevChats[chatId]) return prevChats;
      
        // map through the messages and update the content of the matching message.
        const updatedMessages = prevChats[chatId].map(message => 
          message.id === messageId 
            ? { ...message, content: message.content + text }
            : message
        );
      
        return {
          ...prevChats,
          [chatId]: updatedMessages
        };
      });
      
    }

    setStreamingId(null);
    setLoadings(prevLoadings => ({ ...prevLoadings, [chatId]: false }));
  };

  const getTransitionDuration = (index, isOpening) => {
    let baseDuration = 0.1;
    if (index === 0) return `${baseDuration}s`; // Keep the first item unchanged
  
    let modification = 0.1 * index;
    if (isOpening) {
      return `${baseDuration - modification}s`;
    } else {
      return `${baseDuration + modification}s`;
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
    <div className="app-container">
      <AnimatePresence>
        {Object.values(chats).every(chat => chat.length === 0) &&
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
      <motion.div layoutId='message-list' className="all-message-list">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="chat-instances-container">
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
                                  <div className={
                                    (msg.role === 'summary' ? 'message-wrapper summary-message-wrapper' : 'message-wrapper') +
                                    (!msg.visible ? ' message-hidden' : '')
                                  }>
                                    
                                    <div className="message-role">
                                      
                                      <div className='role-box'>
                                        <Tooltip placement="left" title="Select" color='#505050' mouseEnterDelay='1.0'>
                                          <Checkbox
                                            checked={selected.some(e => e.id === msg.id)}
                                            onChange={(e) => handleSelect(e.target.checked, msg, chatId)}
                                          />
                                        </Tooltip>
                                        <Dropdown 
                                          placement='bottom'
                                          trigger={['click']}
                                          overlay={
                                            <Menu
                                              theme='dark'
                                              items={
                                                [
                                                  {
                                                    key: '1', 
                                                    label: 'user', 
                                                    onClick: handleRole('user', msg.id, chatId)
                                                  },
                                                  {
                                                    key: '2', 
                                                    label: 'assistant', 
                                                    onClick: handleRole('assistant', msg.id, chatId)},
                                                  {
                                                    key: '3', 
                                                    label: 'system', 
                                                    onClick: handleRole('system', msg.id, chatId)
                                                  }
                                                ]
                                              }
                                            />
                                          }
                                        >
                                          <Tooltip placement="top" title="Change Role" color='#505050' mouseEnterDelay='1.0'>
                                            <Button type='text' className='role'>{msg.role}</Button>
                                          </Tooltip>
                                        </Dropdown>
                                      </div>
                                      <DropdownMenu
                                        className='dropdown-menu'
                                        chatId={chatId}
                                        message={msg}
                                        onClose={handleDropdownToggle}
                                        chats={chats}
                                        setChats={setChats}
                                        setDropdownMessageId={setDropdownMessageId}
                                        setDropdownOpen={setDropdownOpen}
                                        setEditMessageId={setEditMessageId}
                                        setEdit={setEdit}
                                      />
                                      {msg.role == "summary" && (
                                        <div className='summary-dropdown' onClick={e => { console.log("Button clicked!"); handleCascade(chatId, msg.id); }}>
                                          <CaretDownOutlined className={msg.cascade ? 'cascade-icon cascade-icon-up' : 'cascade-icon'} />
                                        </div>
                                      )}
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
                                              handleEdit(chatId, msg.id, edit);
                                            }
                                          }}
                                        />
                                      ) : (
                                        <Tooltip placement="right" title="Edit" color='#505050' mouseEnterDelay='1.0'>
                                          <div className='message-text' onClick={e => {
                                            setEdit(msg.content.toLowerCase());
                                            setEditMessageId(msg.id);
                                          }}>
                                            <div className="markdown-container">
                                              {
                                                msg.content !== '' || streamingId === msg.id ?
                                                  <ReactMarkdown components={components} children={msg.content.toLowerCase().split('\n').map(line => line + '  ').join('\n')} remarkPlugins={remarkGfm} /> :
                                                  <p className='placeholder-markdown' >type a message...</p>
                                              }
                                            </div>
                                          </div>
                                        </Tooltip>
                                      )}
                                    </div>
                                  </div>
                                  {msg.role === "summary" && (
                                    <div className={msg.visible ? 'summary-children-container' : 'message-hidden-child summary-children-container'}>
                                    <ul>
                                      {msg.children && msg.children.map((child, index) => (
                                        <li key={child.id} id={child.id} >
                                          <div className={
                                              msg.cascade ? 'parent-message-wrapper child-message-expanded' : 'parent-message-wrapper child-message-retracted'
                                          } 
                                          style={{
                                              zIndex: msg.children.length - index, 
                                              boxShadow: `0px 5px 15px 0px rgba(0, 0, 0, ${(0.1 / msg.children.length) * (msg.children.length - index)})`,
                                              transitionDuration: getTransitionDuration(index, msg.cascade)
                                          }}>
                                            <div className="message-role">
                                              <div className='role-box'>
                                                  {child.role}
                                              </div>
                                            </div>
                                            <div className="message-content">
                                              {editMessageId === child.id ? (
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
                                                      handleEdit(chatId, child.id, edit);
                                                    }
                                                  }}
                                                />
                                              ) : (
                                                <div className='message-text' >
                                                  <div className={`markdown-container ${!msg.cascade ? 'markdown-container-contracted' : ''}`}>
                                                  {
                                                    child.content !== '' || streamingId === msg.id ?
                                                      (<ReactMarkdown 
                                                          components={components}
                                                          remarkPlugins={remarkGfm}
                                                          children={child.content.toLowerCase().split('\n').map(line => line + '  ').join('\n')}
                                                      />) : (
                                                      <p className='placeholder-markdown'>type a message...</p>)
                                                  }
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                    </div>
                                  )}
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
                <motion.div layoutId={`input-container-layout-id-${chatId}`} layout transition={{ duration: 0.5 }} className="input-container" key={`input-container-key-${chatId}`} id={`input-container-id-${chatId}`}>
                  <div className="input-container" style={{ marginTop: 'auto' }}>
                      <Tooltip placement="left" title="Reset Chat" color='#505050' mouseEnterDelay='1.0'>
                        <Button type="primary" icon={<UndoIcon size={16} />} onClick={() => handleChatReset(chatId)} className='input-button input-button-left' >
                        </Button>
                      </Tooltip>
                      <Tooltip title="Add Message" color='#505050' mouseEnterDelay='1.0'> 
                        <Button type="primary" icon={<PlusIcon size={24} />} onClick={() => handleNewMessage(chatId)} className='input-button input-button-mid' >
                        </Button>
                      </Tooltip>
                      <Tooltip title="Summarize" color='#505050' mouseEnterDelay='1.0'>
                        <Button onMouseLeave={handleSummarizeHoverLeave} onMouseEnter={(e) => handleSummarizeHover(chatId)} type="primary" onClick={() => { if (hasSelectedMessage(chatId)) handleSummarize(chatId) }} className={hasSelectedMessage(chatId) ? 'input-button input-button-mid' : 'input-button-disabled input-button input-button-mid'} icon={<StackIcon size={16} />}>
                        </Button>
                      </Tooltip>
                      <Dropdown
                        placement="bottom"
                        overlay={
                          <Space size={10} direction='vertical' className='dropdown-menu-ellipsis'>
                            <Segmented
                              defaultValue={"gpt-3.5-turbo"}
                              onChange={(selectedValue) => handleSetModel(selectedValue, chatId)}
                              options={[
                                {
                                  label: 'GPT-3.5',
                                  value: 'gpt-3.5-turbo',
                                  icon: <ZapIcon size={16} className='zap-icon'/>,
                                },
                                {
                                  label: 'GPT-4',
                                  value: 'gpt-4',
                                  icon: <NorthStarIcon size={16} className='north-star-icon'/>,
                                },
                              ]}
                            />
                            <Button 
                              style={ { width: '13em', fontWeight: "500" } }
                              type='primary'
                              icon={<TrashIcon size={16} className='trash-icon'/>}
                              danger={true}
                              onClick={() => handleSubtractChat(chatId)}
                              disabled={Object.keys(chats).length === 1}
                            >
                                Remove Chat
                            </Button>
                          </Space>
                        }
                        trigger={['hover']}
                      >
                        <Button type="primary" icon={<EllipsisOutlined size={24}/>} className='input-button input-button-right'/>
                      </Dropdown>
                      <div className={`text-area-modal ${hoveredChatId === chatId ? 'visible' : ''}`}>
                        <TextArea
                          id={`summary-prompt-text-area-id-${chatId}`}
                          defaultValue={summaryPrompt}
                          onChange={(e) => setSummaryPrompt(e.target.value)}
                          autoSize
                        />
                      </div>
                      <TextArea 
                        className='input-box' 
                        placeholder="" 
                        autoSize 
                        value={messages[chatId] || ''} 
                        onChange={(e) => handleInputChange(e, chatId)} onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(chatId);
                          }
                        }}/>
                      <Tooltip placement='right' title="Send" color='#505050' mouseEnterDelay='1.0'>
                        <Button type="primary" icon={<TriangleRightIcon size={24} />} loading={loadings[chatId]} onClick={() => handleSend(chatId)} className='input-button' >
                        </Button>
                      </Tooltip>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </DragDropContext>
      </motion.div>
      <Tooltip placement="left" title="Add Chat Right" color='#505050' mouseEnterDelay='1.0'>
        <Button type="primary" onClick={() => handleAddChat(true)} className='global-input-button-add-chat global-input-button-add-chat-right' icon={<PlusIcon size={16} />}></Button>
      </Tooltip>
      <Tooltip placement="right" title="Add Chat Left" color='#505050' mouseEnterDelay='1.0'>
        <Button type="primary" onClick={() => handleAddChat(false)} className='global-input-button-add-chat global-input-button-add-chat-left' icon={<PlusIcon size={16} />}></Button>
      </Tooltip>
      <Button type="primary" danger className='global-input-button-reset' onClick={() => handleTotalReset()} >Reset</Button>
    </div>
  );
}
