const shortid = require("shortid");
const games = {}
class Room {
  constructor(io, socket) {
    this.io = io;
    this.socket = socket;
  }

  createPrivateRoom(player) {
    const { socket } = this;
    const id = shortid.generate();
    games[id] = {
      rounds: 2,
      time: 40 * 1000,
      customWords: [],
      language: "English",
    };
    games[id][socket.id] = {};
    games[id][socket.id].score = 0;
    games[id][socket.id].name = player.name;
    games[id][socket.id].avatar = player.avatar;
    console.log(games);
    socket.player = player;
    socket.roomID = id;
    socket.join(id);
    socket.emit("newRoom", { gameID: id });
  }

  async joinRoom(data) {
    const { io, socket } = this;
    const roomID = data.id;
    const players = Array.from(await io.in(roomID).allSockets());
    games[roomID][socket.id] = {};
    games[roomID][socket.id].score = 0;
    games[roomID][socket.id].name = data.player.name;
    games[roomID][socket.id].avatar = data.player.avatar;
    socket.player = data.player;
    socket.join(roomID);
    socket.roomID = roomID;
    socket.to(roomID).emit("joinRoom", data.player);
    socket.emit(
      "otherPlayers",
      players.reduce((acc, id) => {
        if (socket.id !== id) {
          const { player } = io.of("/").sockets.get(id);
          acc.push(player);
        }
        return acc;
      }, [])
    );
  }
}

module.exports = Room;
