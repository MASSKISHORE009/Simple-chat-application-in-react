import express from 'express';
import http from 'http';
import { Server } from 'socket.io';  // ✅ Fixed import
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);
    io.to(message.roomId).emit('receiveMessage', message);
  });

  socket.on('typing', ({ roomId, user }) => {
    socket.to(roomId).emit('userTyping', user);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
