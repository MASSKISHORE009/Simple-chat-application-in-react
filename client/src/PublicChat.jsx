import { useEffect, useRef, useState } from "react";
import socket from "./socket";

export default function PublicChat({ username }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Emit join event
    socket.emit("joinPublic", username);

    // Handle incoming messages
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("publicMessage", handleMessage);

    // Cleanup
    return () => {
      socket.off("publicMessage", handleMessage);
    };
  }, [username]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (text.trim()) {
      socket.emit("sendPublicMessage", { sender: username, message: text });
      setText("");
    }
  };

  return (
    <div className="border p-4 rounded shadow h-96 overflow-hidden flex flex-col">
      <h2 className="font-semibold mb-2">🌾 Public Farmer Room</h2>
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === "System" ? "text-gray-500 italic" : ""}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center">
        <input
          className="border p-1 mr-2 flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button
          className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
          onClick={send}
          disabled={!text.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}
