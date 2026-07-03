function Footer({ t }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>
          © {currentYear} Okan Çelikcan. {t.footer.rights}
        </p>

        <p className="text-slate-500">
          {t.footer.builtWith}
        </p>
      </div>
    </footer>
  )
}

export default Footer