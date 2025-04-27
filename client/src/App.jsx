import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

const ChatApp = ({ roomId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    // When component loads, join the room
    socket.emit('joinRoom', { roomId });

    // Listen for messages
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Clean up
    return () => {
      socket.off('message');
    };
  }, [roomId]);


  useEffect(() => {
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
  
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play();
    });
  
    return () => {
      socket.off('message');
    };
  }, [roomId]);
  

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      socket.emit('sendMessage', {
        roomId,
        message: messageInput,
        sender: userType,
      });
      setMessageInput('');
    }
  };

  return (
    <div className="chat-container">
      <h3>Chat Room: {roomId}</h3>

      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === userType ? 'self' : 'other'}`}
          >
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <div className="message-input">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
