import axios from 'axios'
const api=axios.create({baseURL:import.meta.env.VITE_API_URL || '/api',timeout:30000})
export async function analyze(handles){const params=new URLSearchParams();for(const [k,v] of Object.entries(handles)) if(v?.trim()) params.set(k,v.trim());return (await api.get(`/analyze?${params.toString()}`)).data}
export async function health(){return (await api.get('/health')).data}
