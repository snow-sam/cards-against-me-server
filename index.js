import dotenv from "dotenv"
import express from 'express';

import { createServer } from "http"
import { Server } from "socket.io";

import { Room } from "./Room.js"

dotenv.config()

const PORT = process.env.PORT
const HOST = process.env.HOST
const SECURE_ORIGINS = process.env.SECURE_ORIGINS

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cleanupEmptyChildNamespaces: true,
  cors: { origin: SECURE_ORIGINS }
});

const roomsMap = new Map();

io.on("connection", (socket) => {
  const { roomId } = socket.handshake.query
  if (roomId) socket.join(roomId)

  // Enter a specific room
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`${socket.id} entered the room ${roomName}`);
  });

  // Leave a specific room
  socket.on('leaveRoom', (roomName) => {
    socket.leave(roomName);
    console.log(`${socket.id} left the room ${roomName}`);
  });

  socket.on("disconnect", (socket) => {
  })
});

io.of("/").adapter.on("create-room", async (room) => {
  if (!/room-\d+$/.test(room)) return
  console.log(`[${room.toUpperCase()}] ${room} successfully created!`);
  roomsMap.set(room, new Room())
  await roomsMap.get(room).init("./mocks/answers.json", "./mocks/questions.json")
});

io.of("/").adapter.on("join-room", (room, id) => {
  if(!roomsMap.has(room)) return
  console.log(`[${room.toUpperCase()}] ${id} entered the room`);
});

io.of("/").adapter.on("delete-room", (room, id) => {
  if(!roomsMap.has(room)) return
  console.log(`[${room.toUpperCase()}] ${room} was successfully deleted!`);
  roomsMap.delete(room);
});

io.of("/").adapter.on("leave-room", (room, id) => {
  if(!roomsMap.has(room)) return
  console.log(`[${room.toUpperCase()}] ${id} left the room`);
});

httpServer.listen(PORT, HOST, () => {
  console.log(`Server running in http://${HOST}:${PORT}`);
});