import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // Allow all origins (for development only)
  },
});

// Listen for connections
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // When a client joins a room
  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // When a client sends a message
  socket.on('sendMessage', ({ roomId, message, sender }) => {
    io.to(roomId).emit('message', { sender, message });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
