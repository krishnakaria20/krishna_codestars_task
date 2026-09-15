import axios from 'axios'
import * as cheerio from 'cheerio'
export async function getCodeChef(handle){
  const {data:html}=await axios.get(`https://www.codechef.com/users/${encodeURIComponent(handle)}`,{headers:{'User-Agent':'Mozilla/5.0'},timeout:15000})
  if(/404|User not found|doesn't exist/i.test(html.slice(0,5000))) throw new Error('CodeChef user not found.')
  const $=cheerio.load(html)
  const text=$('body').text().replace(/\s+/g,' ')
  const ratingMatch=text.match(/Current Rating[^0-9]*(\d{3,4})/i)
  const maxMatch=text.match(/Highest Rating[^0-9]*(\d{3,4})/i)
  const solvedMatch=text.match(/Total Problems Solved[^0-9]*(\d+)/i)
  const contestsMatch=text.match(/Contests Participated[^0-9]*(\d+)/i)
  const rating=Number(ratingMatch?.[1]||0), maxRating=Number(maxMatch?.[1]||rating)
  if(!rating && !solvedMatch) throw new Error('CodeChef profile format could not be read. The public page may have changed.')
  return {platform:'codechef',status:'ok',handle,profile:{name:handle,rank:rating?`Rating ${rating}`:'—',avatar:''},stats:{solved:Number(solvedMatch?.[1]||0),contests:Number(contestsMatch?.[1]||0),rating,maxRating,difficulty:{easy:0,medium:0,hard:0},languages:[]},activity:[],recent:[]}
}
