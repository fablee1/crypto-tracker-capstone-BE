import { createServer } from "http"
import { Server } from "socket.io"
import app from "./server"
import { ISocketDictionary } from "./typings/sockets"

const server = createServer(app)

export const io = new Server(server, { allowEIO3: true })

export const sockets: ISocketDictionary = {}

// adding "event listeners"
io.on("connection", (socket) => {
  socket.on("listenCoinUpdates", (data) => {
    sockets[socket.id] = { socket, coins: data }
  })

  socket.on("disconnect", () => {
    delete sockets[socket.id]
  })
})

export default server
