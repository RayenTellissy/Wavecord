const router = require("express").Router()
const { fetchByUser, fetch, createServer, leaveServer, joinServer } = require("../controllers/servers")

router.get("/fetchByUser/:id", fetchByUser)
router.get("/fetch/:id", fetch)

router.post("/create/:id", createServer)
router.post("/join", joinServer)

router.delete("/leave", leaveServer)

module.exports = router