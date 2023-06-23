const express = require("express")
const cors = require("cors")
const helmet = require("helmet")

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet()) // securing http requests to the server
app.use(morgan("dev"))

app.listen(PORT, () => console.log(`> Ready on port ${PORT}`))