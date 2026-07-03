function GradientButton({ children, variant = 'primary', href }) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold transition duration-300 hover:-translate-y-1'

  const variants = {
    primary:
      'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-purple-500/30',
    secondary:
      'border border-white/15 bg-white/5 text-slate-200 hover:border-cyan-300/60 hover:bg-white/10',
  }

  const className = `${baseClasses} ${variants[variant]}`

  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={className}>
      {children}
    </button>
  )
}

export default GradientButton