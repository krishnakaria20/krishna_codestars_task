import { useState } from 'react'
import { getCpData } from '../api/dataService'
import RatingChart from './charts/RatingChart'
import DifficultyChart from './charts/DifficultyChart'

function StatCard({ label, value }) {
  return (
    <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
      <p className="text-neutral-500 text-xs mb-1">{label}</p>
      <p className="text-xl font-medium">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const [handle, setHandle] = useState('tourist')
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | error | done

  async function handleSearch(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const result = await getCpData(handle)
      setData(result)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <p className="text-xs uppercase tracking-wide text-neutral-500">
        codestars technical committee · task 2
      </p>
      <h1 className="text-2xl font-medium mt-1 mb-6">
        competitive programming dashboard
      </h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="codeforces handle"
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-neutral-600"
        />
        <button
          type="submit"
          className="bg-emerald-500 text-emerald-950 text-sm font-medium px-4 py-2 rounded-lg"
        >
          search
        </button>
      </form>

      {status === 'loading' && <p className="text-neutral-500 text-sm">loading...</p>}
      {status === 'error' && (
        <p className="text-red-400 text-sm">couldn't find that handle — try another.</p>
      )}

      {status === 'done' && data && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="current rating" value={data.currentRating} />
            <StatCard label="max rating" value={data.maxRating} />
            <StatCard label="rank" value={data.rank} />
            <StatCard label="contests" value={data.contestsCount} />
            <StatCard label="problems solved" value={data.solved.totalSolved} />
            <StatCard label="best rank" value={data.trend.bestRank ?? '—'} />
          </div>

          <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
            <p className="text-xs text-neutral-500 mb-2">rating history</p>
            <RatingChart ratingHistory={data.ratingHistory} />
          </div>

          <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
            <p className="text-xs text-neutral-500 mb-2">problems by difficulty</p>
            <DifficultyChart byDifficulty={data.solved.byDifficulty} />
          </div>
        </div>
      )}
    </div>
  )
}
