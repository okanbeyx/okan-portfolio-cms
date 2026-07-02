import { useEffect, useState } from 'react'

function SiteSplash({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsVisible(false)
    }, 1000)

    const finishTimer = setTimeout(() => {
      onFinish?.()
    }, 1600)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(finishTimer)
    }
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center overflow-hidden bg-slate-950 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-[110px]" />
      <div className="absolute left-1/3 top-1/3 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />
      <div className="absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-purple-500/20 blur-[110px]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="relative flex flex-col items-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-cyan-300/30 bg-white/[0.06] shadow-[0_0_60px_rgba(34,211,238,0.18)] backdrop-blur-xl">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-300/20 via-blue-400/10 to-purple-400/20" />

          <span className="relative text-5xl font-black text-cyan-100">
            O
          </span>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-200">
          Okan Portfolio
        </p>

        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" />
        </div>
      </div>
    </div>
  )
}

export default SiteSplash