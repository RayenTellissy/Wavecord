require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const { connect } = require("./prisma/connection")
const sessionMiddleware = require("./middleware/sessionMiddleware")

// routers
const usersRouter = require("./routes/users")
const serversRouter = require("./routes/servers")
const contactsRouter = require("./routes/contacts")
const conversationsRouter = require("./routes/conversations")

const app = express()
const PORT = 3000 // server port

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use(helmet()) // securing http requests to the server
app.use(morgan("dev"))
app.use(sessionMiddleware) // express session
connect() // connecting database

// routers
app.use("/users", usersRouter)
app.use("/servers", serversRouter)
app.use("/contacts", contactsRouter)
app.use("/conversations", conversationsRouter)

app.listen(PORT, () => console.log(`> Server ready on port ${PORT}`))