import { createServer } from "http"
import { Server } from "socket.io"
import app from "./server"
import { ISocketDictionary } from "./typings/sockets"

const server = createServer(app)

const io = new Server(server, { allowEIO3: true })

const sockets: ISocketDictionary = {}

// adding "event listeners"
io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} has connected!`)
})

export default server
