require("dotenv").config()
const express = require("express")
const http = require("http")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const { Server } = require("socket.io")
const axios = require("axios")

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

  socket.on("statusChanged", async (data) => {
    if(data.status === "ONLINE"){
      socket.join(data.id)
    }
    try {
      await axios.put(`${process.env.MAIN_API}/users/setStatus`, {
        id: data.id,
        status: data.status
      })
    }
    catch(error){
      console.log(error)
    }
  })

  socket.on("join_room", data => {
    socket.join(data)
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

  socket.on("voice_updated", data => {
    socket.to(data.serverId).emit("receive_voice_update", data)
  })

  socket.on("leave_voice", data => {
    socket.to(data.serverId).emit("receive_leave_voice", data)
  })

  socket.on("voice_disconnect", async (data) => {
    try {
      await axios.post(`${process.env.MAIN_API}/servers/leaveVoiceRoom`,{
        id: data.user
      })
    }
    catch(error){
      console.log(error)
    }
  })

  io.on("disconnect", socket => {
    console.log("user disconnected", socket.id)
  })
})


server.listen(PORT, () => console.log(`> Socket ready on port ${PORT}`))