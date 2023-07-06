const router = require("express").Router()
const { 
  signup, 
  login, 
  reset, 
  authenticateSession, 
  fetch, 
  logout, 
  googleLogin, 
  googleSignup, 
  fetchImage 
} = require("../controllers/users")
const { loginLimit, signupLimit, resetLimit } = require("../middleware/authLimiter")
const authentication = require("../middleware/authentication")

router.get("/login", authentication, authenticateSession)
router.get("/fetch/:id", fetch)
router.get("/logout", authentication, logout)
router.get("/fetchImage/:id", fetchImage)

router.post("/signup", signupLimit, signup)
router.post("/login", loginLimit, login)
router.post("/googleLogin/:id", googleLogin)
router.post("/googleSignup", googleSignup)
router.post("/reset", resetLimit, reset)

module.exports = router