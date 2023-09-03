const session = require("express-session")
const MongoStore = require("connect-mongo")

const sessionMiddleware = session({
  secret: process.env.COOKIE_SEED,
  name: "sid",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL, dbName: "sessions" }), // creating a mongodb session store
  cookie: {
    secure: false,
    expires: 604800000, // expires in a week
    httpOnly: true,
  },
})

module.exports = sessionMiddleware