import { useState } from 'react'

function Navbar({ t, language, setLanguage }) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.skills, href: '#skills' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.contact, href: '#contact' },
  ]

  function changeLanguage(lang) {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <header className="fixed left-0 top-0 z-50 w-full px-4 py-4 md:px-6">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-slate-950/70 px-4 py-3 shadow-lg shadow-cyan-500/5 backdrop-blur-xl md:px-6">
        <a href="#home" className="group flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/30 bg-white/5 text-lg font-bold text-cyan-200 shadow-[0_0_24px_rgba(103,232,249,0.18)] transition group-hover:border-purple-300/50 group-hover:text-purple-200">
            O
          </span>

          <span className="text-sm font-semibold tracking-wide text-slate-100 sm:text-base">
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
              onClick={() => changeLanguage('tr')}
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
              onClick={() => changeLanguage('en')}
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

        <div className="flex items-center gap-2 md:hidden">
          <div className="flex rounded-full border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => changeLanguage('tr')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                language === 'tr'
                  ? 'bg-cyan-300 text-slate-950'
                  : 'text-slate-400 hover:text-cyan-200'
              }`}
            >
              TR
            </button>

            <button
              type="button"
              onClick={() => changeLanguage('en')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                language === 'en'
                  ? 'bg-purple-300 text-slate-950'
                  : 'text-slate-400 hover:text-purple-200'
              }`}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Menüyü aç veya kapat"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 transition hover:border-cyan-300/40 hover:text-cyan-200"
          >
            <span className="text-xl leading-none">
              {isOpen ? '×' : '☰'}
            </span>
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="mx-auto mt-3 max-w-6xl rounded-3xl border border-white/10 bg-slate-950/90 p-3 shadow-xl shadow-cyan-500/10 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5 hover:text-cyan-300"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar