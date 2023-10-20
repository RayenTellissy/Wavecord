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
const { changeUsernameLimit, changePasswordLimit, changeAvatarLimit, removeAccountLimit } = require("../middleware/userLimiter")
const authentication = require("../middleware/authentication")

router.get("/login", authentication, authenticateSession)
router.get("/logout", authentication, logout)

router.post("/signup", signupLimit, signup)
router.post("/login", loginLimit, login)
router.post("/providerLogin/:id", loginLimit, providerLogin)
router.post("/providerSignup", signupLimit, providerSignup)
router.post("/reset", resetLimit, reset)
router.post("/changeUsername", changeUsernameLimit, authentication, changeUsername)
router.post("/changePassword", changePasswordLimit, authentication, changePassword)
router.post("/changeAvatar", changeAvatarLimit, authentication, changeAvatar)
router.post("/removeAccount", removeAccountLimit, authentication, removeAccount)

router.put("/setStatus", authentication, setStatus)

module.exports = router