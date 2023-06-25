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

const io = new Server(server)

io.on("connect", socket => {
  
})


server.listen(PORT, () => console.log(`> Socket ready on port ${PORT}`))