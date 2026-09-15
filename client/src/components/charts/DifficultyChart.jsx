import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'

const COLORS = { easy: '#5DCAA5', medium: '#7F77DD', hard: '#D85A30', unrated: '#5F5E5A' }

// Expects byDifficulty: { easy, medium, hard, unrated }
export default function DifficultyChart({ byDifficulty }) {
  const data = Object.entries(byDifficulty).map(([band, count]) => ({ band, count }))

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data}>
        <XAxis dataKey="band" tick={{ fill: '#5F5E5A', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.band} fill={COLORS[entry.band]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
