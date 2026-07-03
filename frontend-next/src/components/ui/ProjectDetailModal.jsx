import { useEffect, useState } from 'react'
import { getProjectById } from '../../services/projectService'
import TechBadge from './TechBadge'
import GradientButton from './GradientButton'
import ProjectImagePlaceholder from './ProjectImagePlaceholder'

function ProjectDetailModal({ projectId, language, t, onClose }) {
  const [project, setProject] = useState(null)
  const [activeImage, setActiveImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (projectId) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [projectId])

  useEffect(() => {
    if (projectId) {
      loadProjectDetail()
    }
  }, [projectId])

  if (!projectId) {
    return null
  }

  async function loadProjectDetail() {
    try {
      setLoading(true)
      setError('')

      const data = await getProjectById(projectId)

      let images = data.images || []

      if (images.length === 0 && data.imageUrl) {
        images = [
          {
            id: 'cover-image',
            imageUrl: data.imageUrl,
            altText: data.titleTr || data.titleEn || 'Proje görseli',
            isCover: true,
          },
        ]
      }

      const projectWithImages = {
        ...data,
        images,
      }

      setProject(projectWithImages)

      const coverImage =
        images.find((image) => image.isCover) || images[0] || null

      setActiveImage(coverImage)
    } catch (err) {
      setError(err.message || 'Proje detayı alınamadı.')
    } finally {
      setLoading(false)
    }
  }

  const translation = project ? getTranslation(project, language) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/80 px-4 py-8 backdrop-blur-sm">
      <div
        onWheel={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-6xl overscroll-contain overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-300">
              {language === 'tr' ? 'Proje Detayı' : 'Project Detail'}
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-100">
              {translation?.title || '...'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-red-400 hover:text-red-300"
          >
            {language === 'tr' ? 'Kapat' : 'Close'}
          </button>
        </div>

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 text-center text-slate-400">
            {language === 'tr' ? 'Proje detayı yükleniyor...' : 'Loading project detail...'}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
            {error}
          </div>
        )}

        {!loading && project && translation && (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section>
              {activeImage ? (
  <div className="flex h-[520px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
      <img
        src={activeImage.imageUrl}
        alt={activeImage.altText || translation.title}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  ) : (
    <ProjectImagePlaceholder
      title={translation.title}
      category={translation.category}
      techStack={project.techStack}
      className="h-[520px]"
    />
  )}

              {project.images?.length > 1 && (
                <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                  {project.images.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={`flex aspect-video items-center justify-center overflow-hidden rounded-2xl border bg-slate-900 transition ${
                        activeImage?.id === image.id
                          ? 'border-cyan-400'
                          : 'border-white/10 hover:border-cyan-400/50'
                      }`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={image.altText || translation.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="flex flex-col rounded-3xl border border-white/10 bg-slate-900/40 p-6">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-xs font-semibold text-purple-200">
                  {translation.status}
                </span>

                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                  {translation.category}
                </span>
              </div>

              <p className="leading-8 text-slate-300">
                {translation.description}
              </p>

              {project.techStack?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <TechBadge key={tech}>
                      {tech}
                    </TechBadge>
                  ))}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {isUsableUrl(project.liveUrl) && (
                  <GradientButton href={project.liveUrl}>
                    {t.projects.liveDemo}
                  </GradientButton>
                )}

                {isUsableUrl(project.githubUrl) && (
                  <GradientButton href={project.githubUrl} variant="secondary">
                    {t.projects.github}
                  </GradientButton>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

function getTranslation(project, language) {
  const selectedTranslation = project.translations?.find(
    (translation) => translation.languageCode === language
  )

  if (selectedTranslation) {
    return selectedTranslation
  }

  const fallbackTranslation = project.translations?.find(
    (translation) => translation.languageCode === 'tr'
  )

  if (fallbackTranslation) {
    return fallbackTranslation
  }

  return {
    title: language === 'tr' ? project.titleTr : project.titleEn,
    category: language === 'tr' ? project.categoryTr : project.categoryEn,
    description: language === 'tr' ? project.descriptionTr : project.descriptionEn,
    status: language === 'tr' ? project.statusTr : project.statusEn,
  }
}

function isUsableUrl(url) {
  return Boolean(url && url.trim() && url.trim() !== '#')
}

export default ProjectDetailModal