import { Link } from 'react-router-dom'
import BackgroundEffects from '../components/layout/BackgroundEffects'

function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-slate-100">
      <BackgroundEffects />

      <section className="relative z-10 max-w-lg rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-xl">
        <p className="text-sm font-medium text-cyan-300">404</p>
        <h1 className="mt-3 text-4xl font-bold">Sayfa bulunamadı</h1>
        <p className="mt-4 text-sm text-slate-400">
          Aradığın sayfa mevcut değil veya taşınmış olabilir.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
        >
          Ana sayfaya dön
        </Link>
      </section>
    </main>
  )
}

export default NotFoundPage