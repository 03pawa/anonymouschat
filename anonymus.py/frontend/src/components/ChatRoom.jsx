import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let socket;

const ChatRoom = ({ userId, sessionId, onDisconnect }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connected, setConnected] = useState(false);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    // Use the same origin for production, localhost for development
    const backendUrl = window.location.origin;
    
    socket = io(backendUrl);
    
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('join', userId);
    });
    
    socket.on('matched', (data) => {
      setConnected(true);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: data.message,
        sender: 'system'
      }]);
    });
    
    socket.on('message', (data) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: data.message,
        sender: 'partner',
        timestamp: data.timestamp
      }]);
    });
    
    socket.on('partner-disconnected', () => {
      setPartnerDisconnected(true);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Your chat partner has disconnected.',
        sender: 'system'
      }]);
    });
    
    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.emit('message', { message: newMessage });
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toISOString()
      }]);
      setNewMessage('');
    }
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
    }
    onDisconnect();
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>Anonymous Chat</h2>
        <button onClick={handleDisconnect} className="disconnect-btn">
          Disconnect
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-content">
              {msg.text}
            </div>
            {msg.timestamp && (
              <div className="message-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {partnerDisconnected ? (
        <div className="disconnected-message">
          <p>Your chat partner has left the conversation.</p>
          <button onClick={handleDisconnect}>Return to Registration</button>
        </div>
      ) : (
        <form onSubmit={sendMessage} className="message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={!connected}
          />
          <button type="submit" disabled={!connected || !newMessage.trim()}>
            Send
          </button>
        </form>
      )}
      
      <div className="chat-info">
        <p>Your identity is protected. Illegal activities will result in account prohibition.</p>
      </div>
    </div>
  );
};

export default ChatRoom;