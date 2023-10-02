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
  setStatus
} = require("../controllers/users")
const { loginLimit, signupLimit, resetLimit } = require("../middleware/authLimiter")
const authentication = require("../middleware/authentication")

router.get("/login", authentication, authenticateSession)
router.get("/logout", logout)

router.post("/signup", signup)
router.post("/login", login)
router.post("/googleLogin/:id", googleLogin)
router.post("/googleSignup", googleSignup)
router.post("/reset", reset)

router.put("/setStatus", authentication, setStatus)

module.exports = router