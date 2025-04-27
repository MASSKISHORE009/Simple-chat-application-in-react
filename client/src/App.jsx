import { useState, useEffect } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const App = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [room, setRoom] = useState('');  // NEW: to store the room
  const [joined, setJoined] = useState(false); // NEW: to track if joined

  useEffect(() => {
    socket.on('message', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const joinRoom = () => {
    if (room.trim() !== '') {
      socket.emit('joinRoom', room);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (messageInput.trim() !== '' && room) {
      socket.emit('sendMessageToRoom', { room, message: messageInput });
      setMessageInput('');
    }
  };

  return (
    <div>
      <h1>Simple Chat App with Rooms</h1>

      {!joined ? (
        <div>
          <input
            type="text"
            value={room}
            placeholder="Enter Room Name..."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            value={messageInput}
            placeholder="Type your message..."
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}

      <section>
        {messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </section>
    </div>
  );
};

export default App;
