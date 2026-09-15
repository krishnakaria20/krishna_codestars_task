import Reveal from '../common/Reveal'
import RatingChart from '../charts/RatingChart'

export default function RatingSection({ data }) {
  return (
    <section className="min-h-screen flex flex-col justify-center px-6 max-w-2xl mx-auto">
      <Reveal>
        <p className="text-xs uppercase tracking-wide text-neutral-500 mb-2">chapter 2</p>
        <h2 className="text-2xl font-medium mb-2">the rating curve</h2>
        <p className="text-neutral-400 text-sm mb-8 max-w-md">
          {data.ratingHistory.length === 0
            ? "no contest history to chart yet — the numbers above are all this account has."
            : `net change of ${data.trend.netChange >= 0 ? '+' : ''}${data.trend.netChange} across ${data.contestsCount} contests. peak rating of ${data.trend.bestRating}.`}
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        {data.ratingHistory.length === 0 ? (
          <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800 text-center text-neutral-500 text-sm">
            no rated contests yet — this account hasn't competed in a rated round.
          </div>
        ) : (
          <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
            <RatingChart ratingHistory={data.ratingHistory} />
          </div>
        )}
      </Reveal>
    </section>
  )
}
