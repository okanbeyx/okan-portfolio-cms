import GlassCard from './GlassCard'
import TechBadge from './TechBadge'

function SkillGroupCard({ group, language }) {
  const title = language === 'tr' ? group.titleTr : group.titleEn
  const description =
    language === 'tr' ? group.descriptionTr : group.descriptionEn

  return (
    <GlassCard className="group h-full p-6 transition duration-300 hover:-translate-y-2 hover:border-purple-300/30 hover:shadow-purple-500/10">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-lg font-bold text-cyan-200">
        {title.charAt(0)}
      </div>

      <h3 className="text-xl font-bold text-slate-100 transition group-hover:text-cyan-200">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-400">
        {description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {group.skills.map((skill) => (
          <TechBadge key={skill}>
            {skill}
          </TechBadge>
        ))}
      </div>
    </GlassCard>
  )
}

export default SkillGroupCard