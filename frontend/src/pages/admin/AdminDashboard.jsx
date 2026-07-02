import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackgroundEffects from '../../components/layout/BackgroundEffects'
import { getAdminUser, logoutAdmin } from '../../services/authService'
import {
  createProject,
  getAllProjects,
  updateProject,
} from '../../services/projectService'
import ProjectFormModal from './ProjectFormModal'
import ProjectImagesModal from './ProjectImagesModal'
import AdminEducationSection from './AdminEducationSection'
import AdminHeroSection from './AdminHeroSection'
import AdminAboutSection from './AdminAboutSection'
import AdminSkillsSection from './AdminSkillsSection'
import AdminSiteTextsSection from './AdminSiteTextsSection'
import AdminContactSection from './AdminContactSection'
import AdminTestimonialsSection from './AdminTestimonialsSection'
import { ADMIN_LOGIN_PATH } from '../../config/adminRoutes'


const ADMIN_SECTIONS = [
  {
    key: 'projects',
    label: 'Projeler',
    description: 'Portföyde gösterilecek projeleri yönet.',
  },
  {
    key: 'hero',
    label: 'Hero Alanı',
    description: 'Ana giriş başlığı, alt başlık ve butonları yönet.',
  },
  {
    key: 'about',
    label: 'Hakkımda',
    description: 'Hakkımda metni ve odak alanlarını yönet.',
  },
  {
    key: 'skills',
    label: 'Teknik Yetenekler',
    description: 'Teknoloji grupları ve yetenekleri yönet.',
  },
  {
    key: 'education',
    label: 'Eğitim Geçmişi',
    description: 'Timeline şeklinde eğitim geçmişini yönet.',
  },
  {
    key: 'contact',
    label: 'İletişim',
    description: 'E-posta, GitHub, LinkedIn ve konum bilgilerini yönet.',
  },
  {
    key: 'testimonials',
    label: 'Yorumlar',
    description: 'Ziyaretçi yorumlarını onayla, düzenle ve yayına al.',
  },
  {
    key: 'siteTexts',
    label: 'Site Metinleri',
    description: 'Navbar, footer ve genel UI metinlerini yönet.',
  },
]



function AdminDashboard() {
  const navigate = useNavigate()
  const admin = getAdminUser()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState('projects')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  const [editingProject, setEditingProject] = useState(null)
  const [updating, setUpdating] = useState(false)

  const [imageProject, setImageProject] = useState(null)
  const [changingStatusId, setChangingStatusId] = useState(null)

  useEffect(() => {
    document.title = 'Yönetim Paneli | Okan Portfolio CMS'
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      setLoading(true)
      setError('')

      const data = await getAllProjects()
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    logoutAdmin()
    navigate(ADMIN_LOGIN_PATH)
  }

  async function handleToggleActive(project) {
    const nextIsActive = !project.isActive

    const confirmed = window.confirm(
      `"${project.titleTr}" projesini ${
        nextIsActive ? 'aktif hale getirmek' : 'pasif hale getirmek'
      } istiyor musun?`
    )

    if (!confirmed) {
      return
    }

    try {
      setChangingStatusId(project.id)
      setError('')

      await updateProject(project.id, {
        translations: project.translations,
        techStack: project.techStack,
        githubUrl: project.githubUrl,
        liveUrl: project.liveUrl,
        imageUrl: project.imageUrl,
        isFeatured: project.isFeatured,
        isActive: nextIsActive,
        displayOrder: project.displayOrder,
      })

      await fetchProjects()
    } catch (err) {
      setError(err.message)
    } finally {
      setChangingStatusId(null)
    }
  }

  async function handleCreateProject(projectData) {
    try {
      setCreating(true)
      setError('')

      const createdProject = await createProject(projectData)

      setIsCreateModalOpen(false)
      await fetchProjects()
      setImageProject(createdProject)
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  async function handleUpdateProject(projectData) {
    if (!editingProject) {
      return
    }

    try {
      setUpdating(true)
      setError('')

      await updateProject(editingProject.id, projectData)

      setEditingProject(null)
      await fetchProjects()
    } catch (err) {
      setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-6 py-8 text-slate-100">
      <BackgroundEffects />

      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-cyan-300">Okan Portfolio CMS</p>
            <h1 className="mt-1 text-3xl font-bold">Admin Panel</h1>
            <p className="mt-2 text-sm text-slate-400">
              Hoş geldin, {admin?.fullName || admin?.userName || 'Admin'}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-red-400 hover:text-red-300"
          >
            Çıkış Yap
          </button>
        </div>

        <div className="mb-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {ADMIN_SECTIONS.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveSection(section.key)}
              className={`rounded-3xl border p-5 text-left transition hover:-translate-y-1 ${
                activeSection === section.key
                  ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-100'
                  : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/30 hover:bg-white/[0.07]'
              }`}
            >
              <span className="block text-base font-semibold">
                {section.label}
              </span>

              <span className="mt-2 block text-sm leading-6 text-slate-400">
                {section.description}
              </span>
            </button>
          ))}
        </div>

      {activeSection === 'projects' && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Projeler</h2>
              <p className="mt-2 text-sm text-slate-400">
                Portföyde gösterilecek projeleri buradan yöneteceğiz.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              Yeni Proje Ekle
            </button>
          </div>

          {loading && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
              Projeler yükleniyor...
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
              {error}
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
              Henüz proje bulunmuyor.
            </div>
          )}
          

          {!loading && projects.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-4">Proje</th>
                      <th className="px-5 py-4">Kategori</th>
                      <th className="px-5 py-4">Durum</th>
                      <th className="px-5 py-4">Öne Çıkan</th>
                      <th className="px-5 py-4">Aktif</th>
                      <th className="px-5 py-4">Sıra</th>
                      <th className="px-5 py-4 text-right">İşlem</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {projects.map((project) => (
                      <tr key={project.id} className="bg-slate-950/40">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-100">
                            {project.titleTr}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {project.titleEn}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {project.categoryTr}
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {project.statusTr}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              project.isFeatured
                                ? 'bg-cyan-400/10 text-cyan-300'
                                : 'bg-slate-700/50 text-slate-400'
                            }`}
                          >
                            {project.isFeatured ? 'Evet' : 'Hayır'}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              project.isActive
                                ? 'bg-emerald-400/10 text-emerald-300'
                                : 'bg-red-400/10 text-red-300'
                            }`}
                          >
                            {project.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {project.displayOrder}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingProject(project)}
                              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                            >
                              Düzenle
                            </button>

                            <button
                              type="button"
                              onClick={() => setImageProject(project)}
                              className="rounded-xl border border-cyan-400/30 px-3 py-2 text-xs text-cyan-300 transition hover:bg-cyan-400/10"
                            >
                              Görseller
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleActive(project)}
                              disabled={changingStatusId === project.id}
                              className={`rounded-xl border px-3 py-2 text-xs transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                project.isActive
                                  ? 'border-red-400/30 text-red-300 hover:bg-red-500/10'
                                  : 'border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/10'
                              }`}
                            >
                              {changingStatusId === project.id
                                ? 'Güncelleniyor...'
                                : project.isActive
                                  ? 'Pasif Yap'
                                  : 'Aktif Yap'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>)}

        {activeSection === 'hero' && (
          <AdminHeroSection />
        )}
        {activeSection === 'about' && (
          <AdminAboutSection />
        )}

        {activeSection === 'skills' && (
          <AdminSkillsSection />
        )}

        {activeSection === 'education' && (
          <AdminEducationSection />
        )}

        {activeSection === 'siteTexts' && (
          <AdminSiteTextsSection />
        )}

        {activeSection === 'contact' && (
          <AdminContactSection />
        )}

        {activeSection === 'testimonials' && (
          <AdminTestimonialsSection />
        )}

        {activeSection !== 'projects' &&
          activeSection !== 'education' &&
          activeSection !== 'hero' &&
          activeSection !== 'about' &&
          activeSection !== 'skills' &&
          activeSection !== 'siteTexts' &&
          activeSection !== 'contact' &&
          activeSection !== 'testimonials' && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Yakında
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-100">
                {ADMIN_SECTIONS.find((section) => section.key === activeSection)?.label}
              </h2>

              <p className="mt-4 max-w-2xl leading-8 text-slate-400">
                Bu alan sıradaki CMS modüllerinden biri olarak dinamik hale getirilecek.
                Önce admin panel iskeleti hazırlanıyor, sonra backend ve frontend bağlantıları tek tek eklenecek.
              </p>
            </div>
          )}
      </section>

      <ProjectFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
        saving={creating}
      />

      <ProjectFormModal
        isOpen={Boolean(editingProject)}
        project={editingProject}
        mode="edit"
        onClose={() => setEditingProject(null)}
        onSubmit={handleUpdateProject}
        saving={updating}
      />

      <ProjectImagesModal
        isOpen={Boolean(imageProject)}
        project={imageProject}
        onClose={() => setImageProject(null)}
        onChanged={fetchProjects}
      />
    </main>
  )
}

export default AdminDashboard