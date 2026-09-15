import Reveal from '../common/Reveal'

function StatCard({ label, value, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 h-full">
        <p className="text-neutral-500 text-xs mb-1">{label}</p>
        <p className="text-xl font-medium">{value}</p>
      </div>
    </Reveal>
  )
}

export default function StatsSection({ data }) {
  const stats = [
    { label: 'current rating', value: data.currentRating },
    { label: 'max rating', value: data.maxRating },
    { label: 'rank', value: data.rank },
    { label: 'contests', value: data.contestsCount },
    { label: 'problems solved', value: data.solved.totalSolved },
    { label: 'best rank', value: data.trend.bestRank ?? '—' },
  ]

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 max-w-2xl mx-auto">
      <Reveal>
        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">chapter 1</p>
        <h2 className="text-2xl font-medium mb-8">the numbers so far</h2>
      </Reveal>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.05} />
        ))}
      </div>
    </section>
  )
}
