function Footer({ t }) {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    { label: t.nav.projects, href: '/#projects' },
    { label: t.nav.skills, href: '/#skills' },
    { label: t.nav.about, href: '/#about' },
    { label: t.nav.contact, href: '/#contact' },
  ]

  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div>
          <p>
            © {currentYear} Okan Çelikcan. {t.footer.rights}
          </p>

          <p className="mt-2 text-slate-500">
            {t.footer.builtWith}
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4">
          {footerLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-slate-400 transition hover:text-cyan-300"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer