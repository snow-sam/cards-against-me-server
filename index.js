import dotenv from "dotenv"
import express from 'express';

import { createServer } from "http"
import { Server } from "socket.io";

import { Dealer } from "./Dealer.js"
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
const dealersMap = new Map();

io.on("connection", (socket) => {
  socket.data = socket.handshake.query
  const { roomId } = socket.data
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

  const dealer = new Dealer(new Room())
  dealer.room.init("./mocks/answers.json", "./mocks/questions.json")
  
  roomsMap.set(room, dealer.room)
  dealersMap.set(room, dealer)
});

io.of("/").adapter.on("join-room", (room, id) => {
  if(!roomsMap.has(room)) return
  console.log(`[${room.toUpperCase()}] ${id} entered the room`);
  const dealer = dealersMap.get(room)
  const socket = io.sockets.sockets.get(id)
  dealer.introducePlayer(socket.data.id)
  console.log(dealer.room)
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