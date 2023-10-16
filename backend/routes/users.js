const router = require("express").Router()
const { 
  signup, 
  login, 
  reset, 
  authenticateSession, 
  logout, 
  providerLogin, 
  providerSignup,
  setStatus,
  changeUsername,
  changePassword,
  changeAvatar,
  removeAccount
} = require("../controllers/users")
const { loginLimit, signupLimit, resetLimit } = require("../middleware/authLimiter")
const authentication = require("../middleware/authentication")

router.get("/login", authentication, authenticateSession)
router.get("/logout", authentication, logout)

router.post("/signup", signup)
router.post("/login", login)
router.post("/providerLogin/:id", providerLogin)
router.post("/providerSignup", providerSignup)
router.post("/reset", reset)
router.post("/changeUsername", authentication, changeUsername)
router.post("/changePassword", authentication, changePassword)
router.post("/changeAvatar", authentication, changeAvatar)
router.post("/removeAccount", authentication, removeAccount)

router.put("/setStatus", authentication, setStatus)

module.exports = router