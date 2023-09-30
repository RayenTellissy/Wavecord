const router = require("express").Router()
const { createTicket } = require("../controllers/bugReports")
const authentication = require("../middleware/authentication")

router.post("/createTicket", authentication, createTicket)

module.exports = router