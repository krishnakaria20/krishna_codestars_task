import axios from 'axios'

// Relative base URL: Vite's proxy handles it in dev, same origin in prod.
const api = axios.create({ baseURL: '/api' })

export function getHealth() {
  return api.get('/health').then((res) => res.data)
}
