export default function HeroSection({ handle, setHandle, onSearch, status, errorMessage }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-wide text-neutral-500 mb-3">
        codestars technical committee · task 2
      </p>
      <h1 className="text-4xl sm:text-5xl font-semibold mb-4 max-w-xl leading-tight">
        the climb from grey to red
      </h1>
      <p className="text-neutral-400 max-w-md mb-8 text-sm">
        enter a codeforces handle to turn a season of contests into a story.
      </p>

      <form onSubmit={onSearch} className="flex gap-2 w-full max-w-sm">
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="codeforces handle"
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-neutral-600 transition-colors"
        />
        <button
          type="submit"
          className="bg-emerald-500 text-emerald-950 text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-emerald-400 transition-colors"
        >
          search
        </button>
      </form>

      {status === 'loading' && (
        <p className="text-neutral-500 text-xs mt-4 animate-pulse">loading profile...</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-4">{errorMessage}</p>
      )}
      {status === 'done' && (
        <p className="text-neutral-600 text-xs mt-6 animate-bounce">scroll to see the story ↓</p>
      )}
    </section>
  )
}
