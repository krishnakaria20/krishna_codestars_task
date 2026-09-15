import Reveal from '../common/Reveal'
import DifficultyChart from '../charts/DifficultyChart'

export default function DifficultySection({ data }) {
  const { easy, medium, hard } = data.solved.byDifficulty

  return (
    <section className="min-h-screen flex flex-col justify-center px-6 max-w-2xl mx-auto">
      <Reveal>
        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">chapter 3</p>
        <h2 className="text-2xl font-medium mb-2">where the effort went</h2>
        <p className="text-neutral-400 text-sm mb-8 max-w-md">
          {easy} easy, {medium} medium, {hard} hard problems solved —{' '}
          {data.solved.totalSolved} total across the whole account.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        {data.solved.totalSolved === 0 ? (
          <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 text-center text-neutral-500 text-sm">
            no accepted submissions found for this handle yet.
          </div>
        ) : (
          <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
            <DifficultyChart byDifficulty={data.solved.byDifficulty} />
          </div>
        )}
      </Reveal>
    </section>
  )
}
