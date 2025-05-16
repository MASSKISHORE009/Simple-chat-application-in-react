import { useState } from "react";
import PublicChat from "./PublicChat";
import PrivateChat from "./PrivateChat";
export default function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  return joined ? (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Welcome, {username}</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <PublicChat username={username} />
        <PrivateChat username={username} />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-2 font-bold">Enter Your Username</h1>
      <input
        className="border p-2 mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button className="bg-blue-600 text-white p-2" onClick={() => setJoined(true)}>
        Join Chat
      </button>
    </div>
  );
}
