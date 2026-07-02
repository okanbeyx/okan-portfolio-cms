function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-blue-500/15 blur-[100px]" />

      <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-purple-500/15 blur-[120px]" />

      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-[110px]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/60 to-slate-950" />
    </div>
  )
}

export default BackgroundEffects