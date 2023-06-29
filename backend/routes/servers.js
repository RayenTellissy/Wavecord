const router = require("express").Router()
const { fetchByUser } = require("../controllers/servers")

router.get("/fetchByUser", fetchByUser)

module.exports = router