function ProjectImagePlaceholder({
  title,
  category,
  className = '',
}) {
  const initials = getInitials(title)

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-3xl border border-cyan-300/15 bg-slate-900/80 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/15 via-blue-500/10 to-purple-500/15" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="absolute -left-16 top-8 h-44 w-44 rounded-full bg-cyan-400/20 blur-[70px]" />
      <div className="absolute -right-16 bottom-8 h-44 w-44 rounded-full bg-purple-400/20 blur-[70px]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-300/25 bg-white/[0.06] text-3xl font-black text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-xl">
          {initials}
        </div>

        <p className="mt-5 max-w-md text-lg font-bold text-slate-100">
          {title || 'Project'}
        </p>

        {category && (
          <p className="mt-2 text-sm text-cyan-200/80">
            {category}
          </p>
        )}
      </div>
    </div>
  )
}

function getInitials(title) {
  if (!title) {
    return 'O'
  }

  const words = title
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .split(' ')
    .filter(Boolean)

  if (words.length === 0) {
    return 'O'
  }

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export default ProjectImagePlaceholder