import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Expects ratingHistory: [{ contestName, newRating, date }, ...]
export default function RatingChart({ ratingHistory }) {
  const data = ratingHistory.map((c) => ({
    name: c.contestName,
    rating: c.newRating,
  }))

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        <XAxis dataKey="name" hide />
        <YAxis
          domain={['dataMin - 100', 'dataMax + 100']}
          tick={{ fill: '#5F5E5A', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: '#1a1a1e', border: 'none', borderRadius: 8 }}
          labelStyle={{ color: '#888780' }}
        />
        <Line
          type="monotone"
          dataKey="rating"
          stroke="#F0997B"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
