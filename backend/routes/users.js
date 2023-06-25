const router = require("express").Router()
const { signup, login, reset } = require("../controllers/users")

router.post("/signup", signup)
router.post("/login", login)
router.post("/reset", reset)

module.exports = router