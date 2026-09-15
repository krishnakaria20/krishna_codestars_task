import axios from 'axios'
export async function getAtCoder(handle){
  const {data}=await axios.get(`https://atcoder.jp/users/${encodeURIComponent(handle)}/history/json`,{headers:{'User-Agent':'Mozilla/5.0'},timeout:15000})
  if(!Array.isArray(data)) throw new Error('AtCoder profile not found or history endpoint unavailable.')
  const ratings=data.map(x=>({date:new Date(x.EndTime||x.Timestamp||x.Date).toISOString(),rating:Number(x.NewRating??x.Rating??0),contest:x.ContestName||''})).filter(x=>!Number.isNaN(new Date(x.date).getTime()))
  const latest=ratings.at(-1)?.rating||0
  const activity=ratings.map(x=>({date:x.date.slice(0,10),count:1}))
  return {platform:'atcoder',status:'ok',handle,profile:{name:handle,rank:latest?`Rating ${latest}`:'Unrated',avatar:''},stats:{solved:0,contests:ratings.length,rating:latest,maxRating:Math.max(0,...ratings.map(x=>x.rating)),difficulty:{easy:0,medium:0,hard:0},languages:[]},ratings,activity,recent:ratings.slice(-8).reverse().map(x=>({platform:'atcoder',title:x.contest||'Contest',date:x.date,detail:`Rating ${x.rating}`}))}
}
