require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const { connect } = require("./prisma/connection")

// routers
const usersRouter = require("./routes/users")

const app = express()
const PORT = 3000

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
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL, dbName: "sessions" }), // creating a mongodb session store
  cookie: {
    secure: process.env.ENVIRONMENT === "production" ? true : false,
    expires: 604800000, // expires in a week
    httpOnly: true
  },
}))
connect() // connecting database

app.use("/users", usersRouter)

app.listen(PORT, () => console.log(`> Server ready on port ${PORT}`))