require("dotenv").config()
const express = require("express")
const http = require("http")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const { Server } = require("socket.io")

const app = express()
const PORT = 5000

app.use(cors())
app.use(morgan("dev"))
app.use(helmet())

app.get("/", (req,res) => res.send("")) // heartbeat route

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL
  }
})

io.on("connection", socket => {
  console.log("user connected", socket.id)

  socket.on("start_session", data => {
    socket.join(data.id)
  })

  socket.on("join_room", data => {
    socket.join(data)
  })

  socket.on("leave_room", data => {
    socket.leave(data)
  })
  
  socket.on("send_message", data => {
    socket.to(data.conversation).emit("receive_message", data)
  })

  socket.on("delete_message", data => {
    socket.to(data.conversation).emit("receive_delete_message", data)
  })
  
  socket.on("open_server", data => {
    socket.join(data)
  })

  socket.on("server_member_status_changed", data => {
    socket.to(data.serverRooms).emit("receive_member_status", data)
  })

  socket.on("server_member_role_updated", data => {
    socket.to(data.serverId).emit("receive_member_role_updated", data)
  })

  socket.on("server_ban_user", data => {
    socket.to(data.userId).emit("receive_server_ban", data)
  })

  socket.on("server_kick_user", data => {
    socket.to(data.userId).emit("receive_server_kick", data)
  })

  socket.on("voice_updated", data => {
    socket.to(data.serverId).emit("receive_voice_update", data)
  })

  socket.on("leave_voice", data => {
    socket.to(data.serverId).emit("receive_leave_voice", data)
  })

  socket.on("send_direct_message_notification", data => {
    socket.to(data.userId).emit("receive_direct_message_notification", data)
  })

  socket.on("send_friend_request_notification", data => {
    socket.to(data.userId).emit("receive_friend_request_notification", data)
  })
  
  io.on("disconnect", socket => {
    console.log("user disconnected", socket.id)
  })
})


server.listen(PORT, () => console.log(`> Socket ready on port ${PORT}`))