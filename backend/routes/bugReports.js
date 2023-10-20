const router = require("express").Router()
const { createTicket } = require("../controllers/bugReports")

const authentication = require("../middleware/authentication")
const { createTicketLimit } = require("../middleware/bugReportLimiter")

router.post("/createTicket", createTicketLimit, authentication, createTicket)

module.exports = router