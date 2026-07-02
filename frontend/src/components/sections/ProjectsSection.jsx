import { useState } from 'react'
import useProjects from '../../hooks/useProjects'
import ProjectCard from '../ui/ProjectCard'
import GlassCard from '../ui/GlassCard'
import ProjectDetailModal from '../ui/ProjectDetailModal'

function ProjectsSection({ t, language }) {
  const { projects, loading, error } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  return (
    <section id="projects" className="scroll-mt-28 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
            {t.projects.label}
          </p>

          <h2 className="text-4xl font-bold text-slate-100 md:text-5xl">
            {t.projects.title}
          </h2>

          <p className="mt-5 leading-8 text-slate-400">
            {t.projects.description}
          </p>
        </div>

        {loading && (
          <GlassCard className="p-6 text-slate-300">
            {language === 'tr' ? 'Projeler yükleniyor...' : 'Loading projects...'}
          </GlassCard>
        )}

        {error && (
          <GlassCard className="border-red-400/30 bg-red-400/10 p-6 text-red-200">
            {error}
          </GlassCard>
        )}

        {!loading && !error && projects.length === 0 && (
          <GlassCard className="p-6 text-slate-300">
            {language === 'tr'
              ? 'Henüz yayınlanmış proje bulunmuyor.'
              : 'No published projects found yet.'}
          </GlassCard>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                language={language}
                t={t}
                onViewDetails={() => setSelectedProjectId(project.id)}
              />
            ))}
          </div>
        )}

        <ProjectDetailModal
          projectId={selectedProjectId}
          language={language}
          t={t}
          onClose={() => setSelectedProjectId(null)}
        />
      </div>
    </section>
  )
}

export default ProjectsSection