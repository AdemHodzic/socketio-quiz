
import { Server } from 'socket.io';

import socketHandlers from './game/socket_handlers';


import app from "./app";

const { createServer } = require('node:http');

const server = createServer(app);

server.listen(3000, () => {
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
});

const io = new Server(server, {
  cors: {
    origin: "*", 
  }
});

io.on('connection', (socket) => {

  socket.on('join', (room) => {
    socketHandlers.join(socket, room)
  });

});

io.of("/").adapter.on("join-room", async (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
  const roomSize = io.sockets.adapter.rooms.get(room)?.size;
  if (roomSize === 2) {
    console.log(`Starting game in room ${room}`);
    io.to(room).emit('start_game');

    // Get the first question
    const question = await socketHandlers.getNextQuestion(room);

    io.to(room).emit('next_question', question);
  }
});

io.of("/").adapter.on("leave-room", async (room, id) => {
  console.log(`socket ${id} has left room ${room}`);
  
  const match = await socketHandlers.end_game(room);

  io.to(room).emit('end_game', match);
});
