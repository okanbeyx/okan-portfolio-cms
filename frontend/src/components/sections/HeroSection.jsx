import { useEffect, useState } from 'react'
import { getHeroContent } from '../../services/heroService'
import GradientButton from '../ui/GradientButton'
import GlassCard from '../ui/GlassCard'

function HeroSection({ t, language }) {
  const [heroContent, setHeroContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHeroContent()
  }, [])

  async function loadHeroContent() {
    try {
      setLoading(true)

      const data = await getHeroContent()
      setHeroContent(data)
    } catch {
      setHeroContent(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center px-6 pb-16 pt-32">
        <GlassCard className="max-w-3xl p-10 text-center">
          <p className="text-slate-300">
            {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </p>
        </GlassCard>
      </section>
    )
  }

  const translation = heroContent
    ? getTranslation(heroContent, language)
    : null

  const hero = translation || {
    label: t.hero.label,
    title: t.hero.title,
    subtitle: t.hero.subtitle,
    primaryButtonText: t.hero.viewProjects,
    secondaryButtonText: t.hero.github,
  }

  const primaryButtonUrl = heroContent?.primaryButtonUrl || '#projects'
  const secondaryButtonUrl = heroContent?.secondaryButtonUrl || '#'

  if (heroContent && !heroContent.isActive) {
    return null
  }

  return (
    <section className="flex min-h-screen items-center justify-center px-6 pb-16 pt-32">
      <GlassCard className="max-w-3xl p-10 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-cyan-300">
          {hero.label}
        </p>

        <h1 className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text pb-3 text-5xl font-bold leading-[1.15] text-transparent md:text-7xl">
          {hero.title}
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          {hero.subtitle}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {isUsableUrl(primaryButtonUrl) && (
            <GradientButton href={primaryButtonUrl}>
              {hero.primaryButtonText}
            </GradientButton>
          )}

          {isUsableUrl(secondaryButtonUrl) && (
            <GradientButton href={secondaryButtonUrl} variant="secondary">
              {hero.secondaryButtonText}
            </GradientButton>
          )}
        </div>
      </GlassCard>
    </section>
  )
}

function getTranslation(heroContent, language) {
  const selectedTranslation = heroContent.translations?.find(
    (translation) => translation.languageCode === language
  )

  if (selectedTranslation) {
    return selectedTranslation
  }

  const fallbackTranslation = heroContent.translations?.find(
    (translation) => translation.languageCode === 'tr'
  )

  if (fallbackTranslation) {
    return fallbackTranslation
  }

  return heroContent.translations?.[0] || null
}

function isUsableUrl(url) {
  return Boolean(url && url.trim() && url.trim() !== '#')
}

export default HeroSection