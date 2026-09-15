import {useState} from 'react'
import {motion} from 'framer-motion'
import Dashboard from './components/Dashboard.jsx'
import {analyze} from './api/dataService.js'

const defaults={codeforces:'tourist',leetcode:'',codechef:'',atcoder:''}
function App(){
 const [handles,setHandles]=useState(defaults),[data,setData]=useState(null),[loading,setLoading]=useState(false),[error,setError]=useState('')
 const update=(key,value)=>setHandles(h=>({...h,[key]:value}))
 async function submit(e){e.preventDefault();setError('');setLoading(true);try{const result=await analyze(handles);if(!Object.values(result.platforms).some(p=>p.status==='ok')) throw new Error('No connected platform could be loaded. Check the handles and try again.');setData(result)}catch(err){setError(err.response?.data?.message||err.message||'Something went wrong.')}finally{setLoading(false)}}
 return <div className="app">
  <nav className="nav"><div className="brand"><span className="brand-dot"/>CP<span>Pulse</span></div><div className="nav-right"><span>Live analytics</span><span className="status-dot"/>API connected</div></nav>
  {!data ? <main className="landing">
   <motion.div className="hero" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}}>
    <div className="eyebrow">COMPETITIVE PROGRAMMING • YEAR IN REVIEW</div>
    <h1>One dashboard.<br/><em>Every platform.</em></h1>
    <p className="hero-copy">Turn your competitive programming history into a data-rich story across Codeforces, LeetCode, CodeChef and AtCoder.</p>
   </motion.div>
   <motion.form className="connect-card" onSubmit={submit} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.15}}>
    <div className="card-head"><div><div className="section-kicker">01 / CONNECT</div><h2>Bring your profiles together</h2></div><div className="live-pill">● LIVE DATA</div></div>
    <div className="handle-grid">
     {Object.entries({codeforces:'Codeforces',leetcode:'LeetCode',codechef:'CodeChef',atcoder:'AtCoder'}).map(([key,label])=><label className="handle-field" key={key}><span>{label}</span><div className="input-wrap"><b>{key==='codeforces'?'CF':key==='leetcode'?'LC':key==='codechef'?'CC':'AC'}</b><input value={handles[key]} onChange={e=>update(key,e.target.value)} placeholder={`${label} username`} /></div></label>)}
    </div>
    {error && <div className="error-box">{error}</div>}
    <button className="primary-btn" disabled={loading}>{loading?<><span className="spinner"/>Analyzing profiles...</>:'Analyze my CP journey →'}</button>
    <div className="hint">Enter one or more handles. Platforms that cannot be reached are isolated and won't block the rest.</div>
   </motion.form>
   <div className="platform-strip"><span>PUBLIC DATA SOURCES</span><b>CODEFORCES</b><b>LEETCODE</b><b>CODECHEF</b><b>ATCODER</b></div>
  </main> : <Dashboard data={data} onBack={()=>setData(null)} />}
 </div>
}
export default App
