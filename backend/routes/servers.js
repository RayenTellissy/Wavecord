const router = require("express").Router()
const { fetchByUser, fetch } = require("../controllers/servers")

router.get("/fetchByUser/:id", fetchByUser)
router.get("/fetch/:id", fetch)

module.exports = router