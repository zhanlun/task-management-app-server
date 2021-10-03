import { Server } from "socket.io";

class SocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
      }
    })
    this.io.on('connection', socket => {
      console.log('user connected')

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
    });
  }

  emitter(event, body, boardId) {
    if (body && boardId) {
      console.log(event, body, boardId)
      this.io.to(`board-${boardId}`).emit(event, body)
    }
  }
}

export default SocketService