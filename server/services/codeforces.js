const BASE_URL = 'https://codeforces.com/api'

// Codeforces returns { status: "OK", result: [...] } on success, or
// { status: "FAILED", comment: "..." } on bad handle / bad request —
// it does NOT use HTTP error codes for that, so we check `status` ourselves.
async function callApi(endpoint) {
  const res = await fetch(`${BASE_URL}/${endpoint}`)
  const json = await res.json()

  if (json.status !== 'OK') {
    throw new Error(json.comment || 'Codeforces API request failed')
  }
  return json.result
}

function normalizeProfile(handle, info, ratingHistory) {
  return {
    handle: info.handle,
    platform: 'codeforces',
    currentRating: info.rating ?? 0,
    maxRating: info.maxRating ?? 0,
    rank: info.rank ?? 'unrated',
    maxRank: info.maxRank ?? 'unrated',
    contestsCount: ratingHistory.length,
    ratingHistory: ratingHistory.map((c) => ({
      contestId: c.contestId,
      contestName: c.contestName,
      date: new Date(c.ratingUpdateTimeSeconds * 1000).toISOString(),
      oldRating: c.oldRating,
      newRating: c.newRating,
      rank: c.rank,
    })),
  }
}

// The one function the rest of the app uses — fetches both endpoints
// and hands back a single, clean, predictable object.
export async function getCodeforcesProfile(handle) {
  const [infoResult, ratingHistory] = await Promise.all([
    callApi(`user.info?handles=${handle}`),
    callApi(`user.rating?handle=${handle}`),
  ])

  return normalizeProfile(handle, infoResult[0], ratingHistory)
}
