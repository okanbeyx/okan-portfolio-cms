function GlassCard({ children, className = '' }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-cyan-500/10 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  )
}

export default GlassCard