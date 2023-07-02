const router = require("express").Router()
const { signup, login, reset, authenticateSession, fetch, getRole } = require("../controllers/users")
const { loginLimit, signupLimit, resetLimit } = require("../middleware/authLimiter")

router.get("/login", authenticateSession)
router.get("/fetch/:id", fetch)
router.get("/getRole/:id", getRole)

router.post("/signup", signupLimit, signup)
router.post("/login", loginLimit, login)
router.post("/reset", resetLimit, reset)

module.exports = router