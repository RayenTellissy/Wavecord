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
    console.log(`joined room ${data}`)
    socket.join(data)
  })

  socket.on("send_message", data => {
    console.log(data.conversation)
    socket.to(data.conversation).emit("receive_message", data)
  })

  io.on("disconnect", socket => {
    console.log("user disconnected", socket.id)
  })
})


server.listen(PORT, () => console.log(`> Socket ready on port ${PORT}`))