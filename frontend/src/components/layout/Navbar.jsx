function Navbar({ t, language, setLanguage }) {
  const navItems = [
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.skills, href: '#skills' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.contact, href: '#contact' },
  ]

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-6 py-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-slate-950/60 px-6 py-3 shadow-lg shadow-cyan-500/5 backdrop-blur-xl">
        <a href="#home" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/30 bg-white/5 text-lg font-bold text-cyan-200 shadow-[0_0_24px_rgba(103,232,249,0.18)] transition group-hover:border-purple-300/50 group-hover:text-purple-200">
            O
          </span>

          <span className="font-semibold tracking-wide text-slate-100">
            Okan Çelikcan
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-cyan-300"
            >
              {item.label}
            </a>
          ))}

          <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setLanguage('tr')}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                language === 'tr'
                  ? 'bg-cyan-300 text-slate-950'
                  : 'text-slate-400 hover:text-cyan-200'
              }`}
            >
              TR
            </button>

            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                language === 'en'
                  ? 'bg-purple-300 text-slate-950'
                  : 'text-slate-400 hover:text-purple-200'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar