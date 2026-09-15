import { useEffect, useState } from 'react'
import { getHealth } from './api/dataService'

function App() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    getHealth()
      .then(() => setStatus('connected'))
      .catch(() => setStatus('offline'))
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
      <p className="text-xs uppercase tracking-wide text-neutral-500">
        codestars technical committee · task 2
      </p>
      <h1 className="text-2xl font-medium text-center">
        competitive programming dashboard
      </h1>
      <div className="flex items-center gap-2 rounded-full border border-neutral-800 px-4 py-2 text-sm">
        <span
          className={`h-2 w-2 rounded-full ${
            status === 'connected'
              ? 'bg-emerald-400'
              : status === 'offline'
                ? 'bg-red-400'
                : 'bg-amber-400'
          }`}
        />
        backend: {status}
      </div>
    </div>
  )
}

export default App
