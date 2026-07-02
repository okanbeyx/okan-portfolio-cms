import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackgroundEffects from '../../components/layout/BackgroundEffects'
import { isAuthenticated, loginAdmin } from '../../services/authService'
import { ADMIN_BASE_PATH } from '../../config/adminRoutes'

function AdminLoginPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    userNameOrEmail: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Admin Girişi | Okan Portfolio CMS'

    if (isAuthenticated()) {
      navigate(ADMIN_BASE_PATH)
    }
  }, [navigate])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginAdmin(formData)
      navigate(ADMIN_BASE_PATH)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-slate-100">
      <BackgroundEffects />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium text-cyan-300">Okan Portfolio CMS</p>
          <h1 className="text-3xl font-bold tracking-tight">Admin Girişi</h1>
          <p className="mt-3 text-sm text-slate-400">
            Proje içeriklerini yönetmek için giriş yap.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Kullanıcı adı veya e-posta
            </label>
            <input
              type="text"
              name="userNameOrEmail"
              value={formData.userNameOrEmail}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="Kullanıcı adı veya e-posta"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default AdminLoginPage