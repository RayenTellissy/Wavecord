const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const connect = require("./prisma/connection")

// routers
const usersRouter = require("./routes/users")

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet()) // securing http requests to the server
app.use(morgan("dev"))
connect() // connecting database

app.use("/users", usersRouter)

app.listen(PORT, () => console.log(`> Ready on port ${PORT}`))