import { useEffect, useState } from "react";
import socket from "./socket";


export default function PublicChat({ username }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("joinPublic", username);
    socket.on("publicMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("publicMessage");
  }, [username]);

  const send = () => {
    if (text.trim()) {
      socket.emit("sendPublicMessage", { sender: username, message: text });
      setText("");
    }
  };

  return (
    <div className="border p-4 rounded shadow h-96 overflow-hidden">
      <h2 className="font-semibold mb-2">🌾 Public Farmer Room</h2>
      <div className="h-64 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        className="border p-1 mr-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button className="bg-green-600 text-white p-1" onClick={send}>
        Send
      </button>
    </div>
  );
}
