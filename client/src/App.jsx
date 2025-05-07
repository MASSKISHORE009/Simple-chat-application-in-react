import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './index.css';

const socket = io('http://localhost:5000');

function App() {
  const [roomId] = useState('chat-room');
  const [userId] = useState('User_' + Math.floor(Math.random() * 230));
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.emit('joinRoom', { roomId });

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => {
        // Avoid duplicate messages
        if (!prev.some((msg) => msg.text === message.text && msg.time === message.time && msg.sender === message.sender)) {
          return [...prev, message];
        }
        return prev;
      });
    });

    socket.on('userTyping', (user) => {
      if (user !== userId) {
        setTypingUser(user);
        setTimeout(() => setTypingUser(null), 2000);
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userTyping');
    };
  }, [roomId, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      const message = {
        roomId,
        sender: userId,
        text: trimmedText,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      socket.emit('sendMessage', message);
      setText('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', { roomId, user: userId });
  };

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 border-b bg-blue-600 text-white">
          <h2 className="text-lg font-semibold">Room: {roomId}</h2>
          <p className="text-sm">You are {userId}</p>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={`${msg.time}-${msg.sender}-${i}`}
              className={`p-3 rounded-xl max-w-[75%] ${
                msg.sender === userId
                  ? 'ml-auto bg-blue-500 text-white'
                  : 'mr-auto bg-gray-200 text-black'
              }`}
            >
              <div className="text-xs font-bold">{msg.sender}</div>
              <div className="text-sm">{msg.text}</div>
              <div className="text-[10px] text-right mt-1">{msg.time}</div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {typingUser && (
          <div className="px-4 text-sm text-gray-500 italic">{typingUser} is typing...</div>
        )}

        <form
          className="flex p-4 border-t gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
            className="flex-1 px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
