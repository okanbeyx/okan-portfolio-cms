import { useEffect, useState } from 'react'
import { getActiveEducationItems } from '../../services/educationService'
import GlassCard from '../ui/GlassCard'

function EducationSection({ t,language }) {
  const [educationItems, setEducationItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadEducationItems()
  }, [])

  async function loadEducationItems() {
    try {
      setLoading(true)
      setError('')

      const data = await getActiveEducationItems()
      setEducationItems(data)
    } catch (err) {
      setError(err.message || 'Eğitim geçmişi alınamadı.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="education" className="scroll-mt-28 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
            {t.education?.label || (language === 'tr' ? 'Eğitim Geçmişi' : 'Education')}
          </p>

          <h2 className="text-3xl font-bold text-slate-100 md:text-4xl">
            {t.education?.title || (language === 'tr' ? 'Akademik yolculuğum.' : 'My academic journey.')}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-400">
            {t.education?.description ||
              (language === 'tr'
                ? 'Eğitim sürecimi kronolojik olarak sade bir zaman çizelgesiyle görebilirsin.'
                : 'A clean chronological timeline of my education path.')}
          </p>
        </div>

        {loading && (
          <GlassCard className="p-6 text-slate-300">
            {language === 'tr'
              ? 'Eğitim geçmişi yükleniyor...'
              : 'Loading education history...'}
          </GlassCard>
        )}

        {error && (
          <GlassCard className="border-red-400/30 bg-red-400/10 p-6 text-red-200">
            {error}
          </GlassCard>
        )}

        {!loading && !error && educationItems.length === 0 && (
          <GlassCard className="p-6 text-slate-300">
            {language === 'tr'
              ? 'Henüz eğitim kaydı bulunmuyor.'
              : 'No education records found yet.'}
          </GlassCard>
        )}

        {!loading && !error && educationItems.length > 0 && (
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-cyan-300 via-blue-400 to-purple-400 md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-8">
              {educationItems.map((item, index) => {
                const translation = getTranslation(item, language)
                const isLeft = index % 2 === 0

                return (
                  <div
                    key={item.id}
                    className="relative grid gap-4 pl-12 md:grid-cols-[1fr_48px_1fr] md:pl-0"
                  >
                    <div className="absolute left-[10px] top-6 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.8)] md:left-1/2 md:-translate-x-1/2" />

                    <div
                      className={`${
                        isLeft
                          ? 'md:col-start-1 md:text-right'
                          : 'md:col-start-3 md:text-left'
                      }`}
                    >
                      <GlassCard className="inline-block w-full max-w-md p-5 transition hover:-translate-y-1 hover:border-cyan-300/30">
                        <p className="text-sm font-semibold text-cyan-300">
                          {formatPeriod(item, language)}
                        </p>

                        <h3 className="mt-2 text-xl font-bold text-slate-100">
                          {translation.schoolName}
                        </h3>

                        {translation.department && (
                          <p className="mt-2 text-sm font-medium text-slate-300">
                            {translation.department}
                          </p>
                        )}

                        {translation.description && (
                          <p className="mt-4 text-sm leading-7 text-slate-400">
                            {translation.description}
                          </p>
                        )}
                      </GlassCard>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function getTranslation(item, language) {
  const selectedTranslation = item.translations?.find(
    (translation) => translation.languageCode === language
  )

  if (selectedTranslation) {
    return selectedTranslation
  }

  const fallbackTranslation = item.translations?.find(
    (translation) => translation.languageCode === 'tr'
  )

  if (fallbackTranslation) {
    return fallbackTranslation
  }

  return item.translations?.[0] || {
    schoolName: '',
    department: '',
    description: '',
  }
}

function formatPeriod(item, language) {
  if (item.isCurrent) {
    return language === 'tr'
      ? `${item.startYear} - Devam ediyor`
      : `${item.startYear} - Present`
  }

  if (item.endYear) {
    return `${item.startYear} - ${item.endYear}`
  }

  return `${item.startYear}`
}

export default EducationSection