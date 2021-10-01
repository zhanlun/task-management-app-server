import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from 'cors';
import { applyRoutes } from "./routes/index.js";
import { initDb } from "./db/init.js";

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
  }
});

app.use(express.json())
app.use(cors())

// Init DB
initDb()

// Routes
applyRoutes(app)

const PORT = process.env.PORT || 5000;

io.on('connection', socket => {
  console.log(socket.id, 'connected')

  socket.on('enter-board', (boardId) => {
    console.log('entering board.id ' + boardId + ' from socket ' + socket.id)
    socket.join(`board-${boardId}`)
  })

  socket.on('leave-board', (boardId) => {
    console.log('leaving board.id ' + boardId + ' from socket ' + socket.id)
    socket.leave(`board-${boardId}`)
  })

  socket.on('disconnect', (reason) => {
    console.log(reason)
  })

  socket.on('update-board', (data) => {
    console.log('update-board ', data)
    socket.broadcast.emit('update-board', data)
  })
})


httpServer.listen(PORT, () => {
  console.log(`Server running on Port:, http://localhost:${PORT}`)
})