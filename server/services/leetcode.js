import axios from 'axios'

const ENDPOINT = 'https://leetcode.com/graphql'

const query = `
query userProfile($username:String!){
  matchedUser(username:$username){
    username
    profile{
      realName
      userAvatar
      country
    }
    submitStats{
      acSubmissionNum{
        difficulty
        count
        submissions
      }
      totalSubmissionNum{
        difficulty
        count
        submissions
      }
    }
    problemsSolvedBeatsStats{
      difficulty
      percentage
    }
    submissionCalendar
  }

  userContestRanking(username:$username){
    rating
    globalRanking
    attendedContestsCount
    topPercentage
  }
}
`

const recentQuery = `
query recentAcSubmissions($username:String!, $limit:Int!){
  recentAcSubmissionList(username:$username, limit:$limit){
    id
    title
    titleSlug
    timestamp
  }
}
`

export async function getLeetCode(handle) {
  const { data } = await axios.post(
    ENDPOINT,
    {
      query,
      variables: {
        username: handle
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      timeout: 15000
    }
  )

  const u = data?.data?.matchedUser

  if (!u) {
    throw new Error('LeetCode user not found or endpoint unavailable.')
  }

  const nums = u.submitStats?.acSubmissionNum || []

  const solved =
    (nums.find(x => x.difficulty === 'All') || {}).count ||
    nums.reduce(
      (n, x) => x.difficulty !== 'All' ? n + x.count : n,
      0
    )

  const difficulty = {
    easy: (nums.find(x => x.difficulty === 'Easy') || {}).count || 0,
    medium: (nums.find(x => x.difficulty === 'Medium') || {}).count || 0,
    hard: (nums.find(x => x.difficulty === 'Hard') || {}).count || 0
  }

  const cal = u.submissionCalendar
    ? Object.entries(JSON.parse(u.submissionCalendar)).map(
        ([ts, count]) => ({
          date: new Date(Number(ts) * 1000)
            .toISOString()
            .slice(0, 10),
          count
        })
      )
    : []

  const ranking = data?.data?.userContestRanking

  let recent = []

  try {
    const recentResponse = await axios.post(
      ENDPOINT,
      {
        query: recentQuery,
        variables: {
          username: handle,
          limit: 20
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 15000
      }
    )

    const submissions =
      recentResponse.data?.data?.recentAcSubmissionList || []

    recent = submissions.map(item => ({
      platform: 'leetcode',
      title: item.title,
      date: new Date(Number(item.timestamp) * 1000).toISOString(),
      url: `https://leetcode.com/problems/${item.titleSlug}/`
    }))
  } catch (error) {
    recent = []
  }

  return {
    platform: 'leetcode',
    status: 'ok',
    handle,

    profile: {
      name: u.username,
      rank: ranking?.globalRanking
        ? `#${ranking.globalRanking}`
        : 'Unranked',
      avatar: u.profile?.userAvatar || ''
    },

    stats: {
      solved,
      contests: ranking?.attendedContestsCount || 0,
      rating: Math.round(ranking?.rating || 0),
      maxRating: Math.round(ranking?.rating || 0),
      difficulty,
      languages: []
    },

    activity: cal,

    recent
  }
}