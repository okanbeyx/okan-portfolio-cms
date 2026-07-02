function TechBadge({ children }) {
  return (
    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-200">
      {children}
    </span>
  )
}

export default TechBadge