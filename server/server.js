import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import {
  getCodeforcesProfile,
  getCodeforcesSubmissions,
} from './services/codeforces.js'
import { aggregateSubmissions, aggregateRatingTrend } from './utils/aggregate.js'

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
    const { handle } = req.params

    const [profile, submissions] = await Promise.all([
      getCodeforcesProfile(handle),
      getCodeforcesSubmissions(handle),
    ])

    res.json({
      ...profile,
      solved: aggregateSubmissions(submissions),
      trend: aggregateRatingTrend(profile.ratingHistory),
    })
  } catch (err) {
    res.status(404).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
