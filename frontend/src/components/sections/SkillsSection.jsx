import { useEffect, useState } from 'react'
import { skillGroups } from '../../data/skills'
import { getSkills } from '../../services/skillsService'
import SkillGroupCard from '../ui/SkillGroupCard'

function SkillsSection({ t, language }) {
  const [dynamicSkillGroups, setDynamicSkillGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSkills()
  }, [])

  async function loadSkills() {
    try {
      setLoading(true)

      const data = await getSkills()
      setDynamicSkillGroups(normalizeSkillGroups(data))
    } catch {
      setDynamicSkillGroups([])
    } finally {
      setLoading(false)
    }
  }

  function normalizeSkillGroups(groups) {
    return groups
      .filter((group) => group.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((group) => {
        const tr =
          group.translations?.find((item) => item.languageCode === 'tr') || {}

        const en =
          group.translations?.find((item) => item.languageCode === 'en') || {}

        return {
          id: group.id,
          titleTr: tr.title || '',
          titleEn: en.title || tr.title || '',
          descriptionTr: tr.description || '',
          descriptionEn: en.description || tr.description || '',
          skills:
            group.skills
              ?.filter((skill) => skill.isActive)
              ?.sort((a, b) => a.displayOrder - b.displayOrder)
              ?.map((skill) => skill.name) || [],
        }
      })
      .filter((group) => {
        return (
          group.titleTr ||
          group.titleEn ||
          group.descriptionTr ||
          group.descriptionEn ||
          group.skills.length > 0
        )
      })
  }

  if (loading) {
    return null
  }

  const groups =
    dynamicSkillGroups.length > 0 ? dynamicSkillGroups : skillGroups

  return (
    <section id="skills" className="scroll-mt-28 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
            {t.skills.label}
          </p>

          <h2 className="text-4xl font-bold text-slate-100 md:text-5xl">
            {t.skills.title}
          </h2>

          <p className="mt-5 leading-8 text-slate-400">
            {t.skills.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <SkillGroupCard
              key={group.id}
              group={group}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkillsSection