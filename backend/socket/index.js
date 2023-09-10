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

  socket.on("join_room", data => {
    socket.join(data)
  })

  socket.on("send_message", data => {
    socket.to(data.conversation).emit("receive_message", data)
  })

  socket.on("join_voice", data => {
    socket.join(data.channelId)
    console.log(data)
    socket.to(data.channelId).emit("receive_join", data)
  })

  socket.on("leave_voice", data => {
    console.log(data)
    socket.to(data.channelId).emit("receive_leave", data)
  })

  io.on("disconnect", socket => {
    console.log("user disconnected", socket.id)
  })
})


server.listen(PORT, () => console.log(`> Socket ready on port ${PORT}`))