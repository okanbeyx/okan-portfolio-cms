import { useEffect, useState } from 'react'
import { getAboutContent } from '../../services/aboutService'
import GlassCard from '../ui/GlassCard'

function AboutSection({ t, language }) {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAboutContent()
  }, [])

  async function loadAboutContent() {
    try {
      setLoading(true)

      const data = await getAboutContent()
      setAboutData(data)
    } catch {
      setAboutData(null)
    } finally {
      setLoading(false)
    }
  }

  function getText(value, fallback = '') {
    return typeof value === 'string' && value.trim().length > 0
      ? value
      : fallback
  }

  if (loading) {
    return null
  }

  if (!aboutData || aboutData.isActive === false) {
    return null
  }

  const selectedTranslation =
    aboutData.translations?.find((item) => item.languageCode === language) ||
    aboutData.translations?.find((item) => item.languageCode === 'tr')

  const label = getText(selectedTranslation?.label, t.about.label)
  const title = getText(selectedTranslation?.title, t.about.title)
  const description = getText(selectedTranslation?.description, t.about.description)
  const intro = getText(selectedTranslation?.intro)

  const focusAreas =
    aboutData.focusAreas
      ?.filter((area) => area.isActive)
      ?.sort((a, b) => a.displayOrder - b.displayOrder)
      ?.map((area) => {
        const translation =
          area.translations?.find((item) => item.languageCode === language) ||
          area.translations?.find((item) => item.languageCode === 'tr')

        return {
          id: area.id,
          title: getText(translation?.title),
          description: getText(translation?.description),
        }
      })
      ?.filter((area) => area.title && area.description) || []

  return (
    <section id="about" className="scroll-mt-28 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              {label}
            </p>

            <h2 className="text-3xl font-bold leading-tight text-slate-100 md:text-4xl">
              {title}
            </h2>

            <p className="mt-5 leading-8 text-slate-400">
              {description}
            </p>
          </div>

          <GlassCard className="p-7">
            {intro && (
              <p className="leading-8 text-slate-300">
                {intro}
              </p>
            )}

            {focusAreas.length > 0 && (
              <div className="mt-8 grid gap-4">
                {focusAreas.map((area) => (
                  <div
                    key={area.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-300/30 hover:bg-white/[0.07]"
                  >
                    <h3 className="text-lg font-bold text-slate-100">
                      {area.title}
                    </h3>

                    <p className="mt-2 leading-7 text-slate-400">
                      {area.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </section>
  )
}

export default AboutSection