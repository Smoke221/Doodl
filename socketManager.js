const socketIO = require('socket.io');

function initializeSocket(server) {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handling when a player joins a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        socket.broadcast.to(room).emit('playerJoined', `${socket.id} joined the room`);
    })
  });
}

module.exports = initializeSocket;
