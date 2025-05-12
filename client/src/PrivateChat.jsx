import { useEffect, useState } from "react";
import socket from "./socket";


export default function PrivateChat({ username }) {
  const [recipient, setRecipient] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("privateMessage", ({ from, message }) => {
      setMessages((prev) => [...prev, { from, message }]);
    });

    return () => socket.off("privateMessage");
  }, []);

  const sendPrivate = () => {
    if (recipient.trim() && text.trim()) {
      socket.emit("privateMessage", {
        to: recipient,
        from: username,
        message: text
      });
      setMessages((prev) => [...prev, { from: "You", message: text }]);
      setText("");
    }
  };

  return (
    <div className="border p-4 rounded shadow h-96 overflow-hidden">
      <h2 className="font-semibold mb-2">🤝 Private Farmer-Buyer Chat</h2>
      <div className="mb-2">
        <input
          className="border p-1 mr-2"
          placeholder="Recipient username"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>
      <div className="h-48 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.from}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        className="border p-1 mr-2"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendPrivate()}
      />
      <button className="bg-purple-600 text-white p-1" onClick={sendPrivate}>
        Send
      </button>
    </div>
  );
}
