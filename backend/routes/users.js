const router = require("express").Router()
const { signup, login, reset, authenticateSession } = require("../controllers/users")

router.get("/login", authenticateSession)

router.post("/signup", signup)
router.post("/login", login)
router.post("/reset", reset)

module.exports = router