import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { AccessToken } from 'livekit-server-sdk'

const app = express()
const port = Number(process.env.PORT ?? 3000)

const API_KEY = process.env.LIVEKIT_API_KEY
const API_SECRET = process.env.LIVEKIT_API_SECRET
const LIVEKIT_URL = process.env.LIVEKIT_URL

if (!API_KEY || !API_SECRET || !LIVEKIT_URL) {
  console.warn(
    '[signa-livekit] Faltan LIVEKIT_API_KEY, LIVEKIT_API_SECRET o LIVEKIT_URL en server/.env',
  )
}

app.use(cors({ origin: true }))
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'signa-livekit-token' })
})

/**
 * Genera JWT para unirse a una sala LiveKit.
 * GET /api/livekit/token?room=&identity=
 */
app.get('/api/livekit/token', (req, res) => {
  const room = String(req.query.room ?? '').trim()
  const identity = String(req.query.identity ?? '').trim()

  if (!room || !identity) {
    return res.status(400).json({ error: 'room e identity son requeridos' })
  }

  if (!API_KEY || !API_SECRET || !LIVEKIT_URL) {
    return res.status(503).json({
      error: 'LiveKit no configurado en el servidor. Revisa server/.env',
    })
  }

  const at = new AccessToken(API_KEY, API_SECRET, {
    identity,
    ttl: '1h',
  })

  at.addGrant({
    roomJoin: true,
    room,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  })

  const token = at.toJwt()
  res.json({ token, url: LIVEKIT_URL })
})

app.listen(port, () => {
  console.log(`[signa-livekit] Token API en http://localhost:${port}/api/livekit/token`)
})
