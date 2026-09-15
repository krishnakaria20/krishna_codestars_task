import axios from 'axios'
const BASE='https://codeforces.com/api'
const get = async (endpoint, params) => {
  const {data}=await axios.get(`${BASE}/${endpoint}`,{params,timeout:12000})
  if(data.status!=='OK') throw new Error(data.comment || 'Codeforces API error')
  return data.result
}
export async function getCodeforces(handle){
  const [profile,ratings,submissions]=await Promise.all([
    get('user.info',{handles:handle}),
    get('user.rating',{handle}),
    get('user.status',{handle})
  ])
  const u=profile[0]
  const solved=new Map(), languages=new Set(), topics=new Set(), activity=new Map()
  const difficulty={easy:0,medium:0,hard:0}
  for(const s of submissions){
    if(s.programmingLanguage) languages.add(s.programmingLanguage)
    for(const tag of (s.problem?.tags||[])) topics.add(tag)
    const date=new Date((s.creationTimeSeconds||0)*1000).toISOString().slice(0,10)
    if(date!=='1970-01-01') activity.set(date,(activity.get(date)||0)+1)
    if(s.verdict==='OK'){
      const key=`${s.problem?.contestId}:${s.problem?.index}`
      if(!solved.has(key)){
        solved.set(key,s.problem)
        const r=s.problem?.rating
        if(r==null) continue
        if(r<1200) difficulty.easy++
        else if(r<1600) difficulty.medium++
        else difficulty.hard++
      }
    }
  }
  const recent=submissions.filter(s=>s.verdict==='OK').slice(0,8).map(s=>({
    platform:'codeforces', title:s.problem?.name || 'Problem', date:new Date(s.creationTimeSeconds*1000).toISOString(), detail:`${s.problem?.contestId || ''}${s.problem?.index || ''}`
  }))
  return {platform:'codeforces',status:'ok',handle,profile:{name:u.handle,rank:u.rank||'unrated',maxRank:u.maxRank||'unrated',avatar:u.titlePhoto||''},stats:{solved:solved.size,contests:ratings.length,rating:u.rating||0,maxRating:u.maxRating||0,difficulty,languages:[...languages],topics:[...topics]},ratings:ratings.map(r=>({date:new Date(r.ratingUpdateTimeSeconds*1000).toISOString(),rating:r.newRating,contest:r.contestName})),activity:[...activity.entries()].map(([date,count])=>({date,count})),recent}}
