require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const session = require("express-session")
const Redis = require("ioredis")
// const RedisStore = require("connect-redis")(session)

const connect = require("./prisma/connection")

// routers
const usersRouter = require("./routes/users")

const app = express()
const PORT = 3000

// const redisClient = new Redis()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use(helmet()) // securing http requests to the server
app.use(morgan("dev"))
app.use(session({
  secret: process.env.COOKIE_SEED,
  name: "sid",
  // store: new RedisStore({ client: redisClient }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.ENVIRONMENT === "production" ? true : false,
    expires: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
}))
connect() // connecting database

app.use("/users", usersRouter)

app.listen(PORT, () => console.log(`> Server ready on port ${PORT}`))