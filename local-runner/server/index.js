let boardGame = {
  state: {},
  joinable: true,
  finished: false,
  players: [],
  version: 0
};

const express = require('express')
const { createServer } = require('http')
const bodyParser = require('body-parser')
const { Server } = require("socket.io")

var jsonParser = bodyParser.json()

const app = express()
const httpServer = createServer(app)
const port = 8080

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
})

app.get('/', (req, res) => {
  res.status(200).json(boardGame);
})

app.post('/', jsonParser, (req, res) => {
  boardGame = req.body;
  boardGame.version += 1;
  io.sockets.emit("room:latestState", boardGame);
  res.status(200).json(null);
})

io.on("connection", socket => {
  socket.emit("room:latestState", boardGame);
});

httpServer.listen(port);