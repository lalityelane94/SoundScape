const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join:room", ({ roomId, userId, userName }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = { users: {} };
    rooms[roomId].users[socket.id] = { userId, userName, cursor: { x: 0, y: 0 } };
    io.to(roomId).emit("room:users", Object.values(rooms[roomId].users));
  });

  socket.on("cursor:move", ({ roomId, x, y, userId, userName }) => {
    if (rooms[roomId]?.users[socket.id]) {
      rooms[roomId].users[socket.id].cursor = { x, y };
    }
    socket.to(roomId).emit("cursor:move", { socketId: socket.id, x, y, userId, userName });
  });

  socket.on("step:toggle", ({ roomId, trackId, stepIndex }) => {
    socket.to(roomId).emit("step:toggle", { trackId, stepIndex });
  });

  socket.on("bpm:change", ({ roomId, bpm }) => {
    socket.to(roomId).emit("bpm:change", { bpm });
  });

  socket.on("playback:sync", ({ roomId, isPlaying, currentStep }) => {
    socket.to(roomId).emit("playback:sync", { isPlaying, currentStep });
  });

  socket.on("ai:generated", ({ roomId, aiTrack }) => {
    socket.to(roomId).emit("ai:generated", { aiTrack });
  });

  socket.on("disconnect", () => {
    Object.keys(rooms).forEach((roomId) => {
      if (rooms[roomId]?.users[socket.id]) {
        delete rooms[roomId].users[socket.id];
        io.to(roomId).emit("room:users", Object.values(rooms[roomId].users));
        socket.to(roomId).emit("cursor:leave", { socketId: socket.id });
      }
    });
    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Socket.io server running on port ${PORT}`));
