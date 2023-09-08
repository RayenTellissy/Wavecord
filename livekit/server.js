import express from 'express'
import cors from "cors"
import { AccessToken } from 'livekit-server-sdk'
import dotenv from "dotenv"
dotenv.config()

const createToken = (channelId, username) => {
  const at = new AccessToken(process.env.LK_API_KEY, process.env.LK_API_SECRET, {
    identity: username
  })
  at.addGrant({ roomJoin: true, room: channelId })

  return at.toJwt()
}

const app = express()
app.use(cors())
const port = 3001

app.get('/getToken/:channelId/:username', (req, res) => {
  const { channelId, username } = req.params
  console.log(channelId, username)
  res.send(createToken(channelId, username))
})

app.listen(port, () => {
  console.log(`> livekit server listening on port ${port}`)
})