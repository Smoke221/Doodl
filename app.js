const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const initializeSocket = require("./socketManager");
app.use(cors());
initializeSocket(io);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log("listening on *:3000");
});
