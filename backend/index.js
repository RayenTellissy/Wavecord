const express = require("express")
const cors = require("cors")

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.listen(PORT, () => console.log(`> Ready on port ${PORT}`))