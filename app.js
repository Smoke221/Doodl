const express = require("express");
const cors = require("cors")
const http = require("http");
const initializeSocket = require("./socketManager");


const app = express();
app.use(cors())
const server = http.createServer(app);

initializeSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
