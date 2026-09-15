import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { getCodeforces } from './services/codeforces.js'
import { getLeetCode } from './services/leetcode.js'
import { getCodeChef } from './services/codechef.js'
import { getAtCoder } from './services/atcoder.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

app.get('/api/health', (req,res) => res.json({status:'ok', time:new Date().toISOString()}))

app.get('/api/analyze', async (req,res) => {
  const handles = {
    codeforces: (req.query.codeforces || '').trim(),
    leetcode: (req.query.leetcode || '').trim(),
    codechef: (req.query.codechef || '').trim(),
    atcoder: (req.query.atcoder || '').trim()
  }
  if (!Object.values(handles).some(Boolean)) return res.status(400).json({message:'Enter at least one platform handle.'})

  const jobs = [
    ['codeforces', handles.codeforces, getCodeforces],
    ['leetcode', handles.leetcode, getLeetCode],
    ['codechef', handles.codechef, getCodeChef],
    ['atcoder', handles.atcoder, getAtCoder]
  ]

  const settled = await Promise.all(jobs.map(async ([name,handle,fn]) => {
    if (!handle) return [name, {platform:name, status:'not_connected', handle:null}]
    try { return [name, await fn(handle)] }
    catch (error) { return [name, {platform:name, status:'unavailable', handle, message:error.message || 'Unable to fetch this platform.'}] }
  }))

  const platforms = Object.fromEntries(settled)
  const available = Object.values(platforms).filter(x => x.status === 'ok')
  const combined = {
    totalSolved: available.reduce((n,p) => n + (p.stats?.solved || 0), 0),
    totalContests: available.reduce((n,p) => n + (p.stats?.contests || 0), 0),
    activePlatforms: available.length,
    platformCount: 4,
    difficulty: {
      easy: available.reduce((n,p)=>n+(p.stats?.difficulty?.easy||0),0),
      medium: available.reduce((n,p)=>n+(p.stats?.difficulty?.medium||0),0),
      hard: available.reduce((n,p)=>n+(p.stats?.difficulty?.hard||0),0)
    },
    languages: [...new Set(available.flatMap(p => p.stats?.languages || []))].slice(0,12),
    activity: mergeActivity(available),
    ratings: available.filter(p=>p.stats?.rating != null && p.stats.rating > 0).map(p=>({platform:p.platform,rating:p.stats.rating})),
    highestRating: Math.max(0,...available.map(p=>p.stats?.maxRating||0)),
    topics: [...new Set(available.flatMap(p=>p.stats?.topics||[]))].slice(0,16),
    streak: calculateStreak(available.flatMap(p=>p.activity||[])),
    productiveMonth: calculateProductiveMonth(available.flatMap(p=>p.activity||[])),
    recent: available.flatMap(p=>p.recent || []).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,10)
  }
  res.json({generatedAt:new Date().toISOString(), handles, platforms, combined})
})

function calculateStreak(activity) {
  const dates = new Set(activity.filter(x=>x.count>0).map(x=>x.date))
  let best=0,current=0
  const all=[...dates].sort()
  for(let i=0;i<all.length;i++){
    if(i===0 || (new Date(all[i])-new Date(all[i-1]))===86400000) current++
    else current=1
    best=Math.max(best,current)
  }
  return best
}
function calculateProductiveMonth(activity) {
  const counts={}
  for(const x of activity) { const month=x.date.slice(0,7); counts[month]=(counts[month]||0)+x.count }
  const best=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]
  return best ? {month:best[0],count:best[1]} : null
}

function mergeActivity(platforms) {
  const map = new Map()
  for (const p of platforms) for (const d of (p.activity || [])) map.set(d.date,(map.get(d.date)||0)+d.count)
  return [...map.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([date,count])=>({date,count}))
}

app.listen(PORT, () => console.log(`CP Pulse server running on http://localhost:${PORT}`))
