import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { getCodeforcesProfile } from './services/codeforces.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/cp-data/:handle', async (req, res) => {
  try {
    const profile = await getCodeforcesProfile(req.params.handle)
    res.json(profile)
  } catch (err) {
    // Codeforces gives a clear "not found" style message — pass it through
    // as a 404 rather than a generic 500, since it's a client input problem.
    res.status(404).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
