import GlassCard from './GlassCard'
import TechBadge from './TechBadge'
import GradientButton from './GradientButton'
import ProjectImagePlaceholder from './ProjectImagePlaceholder'

function ProjectCard({ project, language, t, onViewDetails }) {
  const translation = getTranslation(project, language)

  const title = translation.title
  const category = translation.category
  const description = translation.description
  const status = translation.status

  const hasImage = isUsableValue(project.imageUrl)
  const hasLiveUrl = isUsableUrl(project.liveUrl)
  const hasGithubUrl = isUsableUrl(project.githubUrl)

  return (
    <GlassCard className="group flex h-full flex-col overflow-hidden p-0 transition duration-300 hover:-translate-y-2 hover:border-cyan-300/30 hover:shadow-purple-500/10">
      {hasImage ? (
        <div className="relative flex aspect-video items-center justify-center overflow-hidden border-b border-white/10 bg-slate-950/80">
          <img
            src={project.imageUrl}
            alt={title}
            className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
        </div>
      ) : (
        <ProjectImagePlaceholder
          title={title}
          category={category}
          techStack={project.techStack}
          className="aspect-video rounded-none border-x-0 border-t-0"
        />
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="rounded-full border border-purple-300/20 bg-purple-300/10 px-3 py-1 text-xs font-semibold text-purple-200">
            {status}
          </span>

          <span className="text-right text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            {category}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-slate-100 transition group-hover:text-cyan-200">
          {title}
        </h3>

        <p className="mt-4 flex-1 leading-7 text-slate-400">
          {description}
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

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onViewDetails}
            className="rounded-2xl border border-cyan-400/40 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/10"
          >
            {language === 'tr' ? 'Detayları Gör' : 'View Details'}
          </button>

          {hasLiveUrl && (
            <GradientButton href={project.liveUrl}>
              {t.projects.liveDemo}
            </GradientButton>
          )}

          {hasGithubUrl && (
            <GradientButton href={project.githubUrl} variant="secondary">
              {t.projects.github}
            </GradientButton>
          )}
        </div>
      </div>
    </GlassCard>
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

function isUsableValue(value) {
  return Boolean(value && value.trim() && value.trim() !== '#')
}

export default ProjectCard