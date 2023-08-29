const Room = require("./controllers/rooms");

function initializeSocket(io) {
  io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('newRoom', (player) => new Room(io, socket).createPrivateRoom(player))

    socket.on('draw', (dataUrl) => {
      // Broadcast the drawing data to other clients
      socket.to(socket.roomID).emit('draw', dataUrl);
    });
  })
}

module.exports = initializeSocket;
