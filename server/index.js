const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const users = {}; // socket.id => username

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinPublic", (username) => {
    users[socket.id] = username;
    socket.join("publicRoom");
    io.to("publicRoom").emit("publicMessage", {
      sender: "System",
      message: `${username} joined the public room`
    });
  });

  socket.on("sendPublicMessage", ({ sender, message }) => {
    io.to("publicRoom").emit("publicMessage", { sender, message });
  });

  socket.on("privateMessage", ({ to, from, message }) => {
    const targetSocketId = Object.entries(users).find(
      ([, name]) => name === to
    )?.[0];
    if (targetSocketId) {
      io.to(targetSocketId).emit("privateMessage", { from, message });
    }
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.to("publicRoom").emit("publicMessage", {
      sender: "System",
      message: `${username} left the public room`
    });
  });
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
