const router = require("express").Router()
const { 
  signup, 
  login, 
  reset, 
  authenticateSession, 
  logout, 
  googleLogin, 
  googleSignup,
  setStatus,
  changeUsername,
  changePassword,
  removeAccount
} = require("../controllers/users")
const { loginLimit, signupLimit, resetLimit } = require("../middleware/authLimiter")
const authentication = require("../middleware/authentication")

router.get("/login", authentication, authenticateSession)
router.get("/logout", authentication, logout)

router.post("/signup", signup)
router.post("/login", login)
router.post("/googleLogin/:id", googleLogin)
router.post("/googleSignup", googleSignup)
router.post("/reset", reset)
router.post("/changeUsername", authentication, changeUsername)
router.post("/changePassword", authentication, changePassword)
router.post("/removeAccount", authentication, removeAccount)

router.put("/setStatus", authentication, setStatus)

module.exports = router