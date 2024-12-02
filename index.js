import dotenv from "dotenv"
import express from 'express';

import { createServer } from "http"
import { Server } from "socket.io";

import { Room } from "./Room.js"
import { MIN_PLAYERS } from './constants.js'

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

  socket.on("getCards", (room, id, callback) => {
    const { players } = roomsMap.get(room)
    callback([...players.get(id).cards])
  })

  socket.on("sendCard", (playerId, card) => {
    const { roomId } = socket.data
    const { receiveCard, currentRound } = roomsMap.get(roomId)
    const { hasToSend, voting } = currentRound
    receiveCard(playerId, card)

    if (!hasToSend.size) {
      const mapObject = Object.fromEntries(voting);
      io.to(roomId).emit("votingFase", mapObject)
    }
  })

  socket.on("vote", (playerId, card) => {
    const { roomId } = socket.data
    const room = roomsMap.get(roomId)

    room.receiveVote(playerId, card)
    if (!room.currentRound.hasToVote.size) {
      room.startNewRound()
      io.to(roomId).emit("votingFase", [])
      io.to(roomId).emit("winner", room.getLastWinner())
      io.to(roomId).emit("newRound", room.questionDeck.peek())
    }
  })

  socket.on("disconnect", (socket) => {
  })
});

io.of("/").adapter.on("create-room", async (room) => {
  if (!/room-\d+$/.test(room)) return
  console.log(`[${room.toUpperCase()}] ${room} successfully created!`);
  roomsMap.set(room, new Room())
});

io.of("/").adapter.on("join-room", (roomId, id) => {
  if (!roomsMap.has(roomId)) return
  console.log(`[${roomId.toUpperCase()}] ${id} entered the room`);
  const socket = io.sockets.sockets.get(id)
  const room = roomsMap.get(roomId)

  room.introducePlayer(socket.data.id)

  if (room.players.size < MIN_PLAYERS || room.currentRound) return
  room.startNewRound()
  io.to(roomId).emit("newRound", room.questionDeck.peek())
});

io.of("/").adapter.on("delete-room", (room, id) => {
  if (!roomsMap.has(room)) return
  console.log(`[${room.toUpperCase()}] ${room} was successfully deleted!`);
  roomsMap.delete(room);
});

io.of("/").adapter.on("leave-room", (room, id) => {
  if (!roomsMap.has(room)) return
  console.log(`[${room.toUpperCase()}] ${id} left the room`);
});

httpServer.listen(PORT, HOST, () => {
  console.log(`Server running in http://${HOST}:${PORT}`);
});