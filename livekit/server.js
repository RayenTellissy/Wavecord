import express from 'express'
import cors from "cors"
import { AccessToken } from 'livekit-server-sdk'
import dotenv from "dotenv"
dotenv.config()

const createToken = (channelId, id, username, image) => {
  const at = new AccessToken(process.env.LK_API_KEY, process.env.LK_API_SECRET, {
    identity: username,
    metadata: JSON.stringify({
      id,
      username,
      image
    })
  })
  at.addGrant({ roomJoin: true, room: channelId })

  return at.toJwt()
}

const app = express()
app.use(express.json())
app.use(cors())
const port = 3001

app.post('/getToken', (req, res) => {
  const { channelId, id, username, image } = req.body
  res.send(createToken(channelId, id, username, image))
})

app.listen(port, () => {
  console.log(`> livekit server listening on port ${port}`)
})