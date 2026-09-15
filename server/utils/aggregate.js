// Buckets a problem's rating into a difficulty band for the bar chart.
function bandFor(rating) {
  if (!rating) return 'unrated'
  if (rating < 1200) return 'easy'
  if (rating < 1800) return 'medium'
  return 'hard'
}

// Turns raw Codeforces submissions into dashboard-ready numbers:
// unique problems solved, difficulty breakdown, and a submission
// heatmap (date -> count) for the contribution-style calendar.
export function aggregateSubmissions(submissions) {
  const solvedProblems = new Map() // key: "contestId-index" -> rating
  const heatmap = {} // "YYYY-MM-DD" -> count

  for (const sub of submissions) {
    const date = new Date(sub.creationTimeSeconds * 1000)
      .toISOString()
      .slice(0, 10)
    heatmap[date] = (heatmap[date] || 0) + 1

    if (sub.verdict === 'OK') {
      const key = `${sub.problem.contestId}-${sub.problem.index}`
      if (!solvedProblems.has(key)) {
        solvedProblems.set(key, sub.problem.rating)
      }
    }
  }

  const byDifficulty = { easy: 0, medium: 0, hard: 0, unrated: 0 }
  for (const rating of solvedProblems.values()) {
    byDifficulty[bandFor(rating)] += 1
  }

  return {
    totalSolved: solvedProblems.size,
    byDifficulty,
    heatmap,
  }
}

// Simple trend stats from the rating history — best/worst rating and
// the net change across all recorded contests.
export function aggregateRatingTrend(ratingHistory) {
  if (ratingHistory.length === 0) {
    return { bestRating: 0, worstRating: 0, netChange: 0, bestRank: null }
  }

  const ratings = ratingHistory.map((c) => c.newRating)
  const bestRank = Math.min(...ratingHistory.map((c) => c.rank))

  return {
    bestRating: Math.max(...ratings),
    worstRating: Math.min(...ratings),
    netChange: ratings[ratings.length - 1] - ratingHistory[0].oldRating,
    bestRank,
  }
}
