// 1. Import packages
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';

// 2. Configuration
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
  },
});

// 3. Middleware
app.use(cors());

// 4. Socket.io logic
io.on('connection', (socket) => {
  console.log("New client connected");

  socket.on("message", (message) => {
    console.log('Message received:', message);
    io.emit("message", message); // broadcast message to all clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// 5. Run the server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
