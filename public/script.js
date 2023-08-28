const socket = io.connect()

const room = prompt('Enter a room:');

// Emit the "joinRoom" event to notify the server about joining the room
socket.emit('joinRoom', room);

// Listen for the "playerJoined" event and display the notification
socket.on('playerJoined', (message) => {
  console.log(message);
});
