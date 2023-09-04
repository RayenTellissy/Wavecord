require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const { connect } = require("./prisma/connection")

// routers
const usersRouter = require("./routes/users")
const serversRouter = require("./routes/servers")
const conversationsRouter = require("./routes/conversations")
const friendsRouter = require("./routes/friends")
const bugReportsRouter = require("./routes/bugReports")

const app = express()
const PORT = 3000 // server port

app.get("/", (req,res) => res.send("")) // heartbeat route

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use(helmet()) // securing http requests to the server
app.use(morgan("dev"))
connect() // connecting database

// routers
app.use("/users", usersRouter)
app.use("/servers", serversRouter)
app.use("/conversations", conversationsRouter)
app.use("/friends", friendsRouter)
app.use("/bugReports", bugReportsRouter)

app.listen(PORT, () => console.log(`> Server ready on port ${PORT}`))