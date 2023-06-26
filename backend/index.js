require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const session = require("express-session")

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
app.use(session({
  secret: process.env.COOKIE_SEED,
  name: "sid",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.ENVIRONMENT === "production" ? true : false,
    httpOnly: true,
    expires: 1000 * 60 * 60 * 24 * 7,
    sameSite: "strict"
  }
}))
connect() // connecting database

app.get("/",(req,res)=>{
  res.send("k")
})

app.use("/users", usersRouter)

app.listen(PORT, () => console.log(`> Ready on port ${PORT}`))