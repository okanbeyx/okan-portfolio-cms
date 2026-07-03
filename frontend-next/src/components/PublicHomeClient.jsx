'use client'

import { useState } from 'react'
import { uiText } from '@/data/uiText'

import BackgroundEffects from '@/components/layout/BackgroundEffects'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SkillsSection from '@/components/sections/SkillsSection'
import EducationSection from '@/components/sections/EducationSection'
import AboutSection from '@/components/sections/AboutSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import ContactSection from '@/components/sections/ContactSection'
import Footer from '@/components/layout/Footer'
import SiteSplash from '@/components/ui/SiteSplash'

function PublicHomeClient({ initialSiteTexts = [] }) {
  const [language, setLanguage] = useState('tr')
  const [showSplash, setShowSplash] = useState(true)

  const t = buildDynamicText(uiText[language], initialSiteTexts, language)

  return (
    <>
      <main id="home" className="relative min-h-screen overflow-x-hidden text-slate-100">
        <BackgroundEffects />

        <Navbar
          t={t}
          language={language}
          setLanguage={setLanguage}
        />

        <HeroSection t={t} language={language} />

        <ProjectsSection
          t={t}
          language={language}
        />

        <SkillsSection
          t={t}
          language={language}
        />

        <EducationSection
          t={t}
          language={language}
        />

        <AboutSection
          t={t}
          language={language}
        />

        <TestimonialsSection
          t={t}
          language={language}
        />

        <ContactSection
          t={t}
          language={language}
        />

        <Footer t={t} />
      </main>

      {showSplash && (
        <SiteSplash onFinish={() => setShowSplash(false)} />
      )}
    </>
  )
}

function buildDynamicText(baseText, items, language) {
  const result = structuredClone(baseText)

  items.forEach((item) => {
    if (item.isActive === false) {
      return
    }

    const selectedTranslation =
      item.translations?.find((translation) => translation.languageCode === language) ||
      item.translations?.find((translation) => translation.languageCode === 'tr')

    const value = selectedTranslation?.value

    if (!value || !item.key) {
      return
    }

    setNestedValue(result, item.key, value)
  })

  return result
}

function setNestedValue(target, path, value) {
  const parts = path.split('.')
  let current = target

  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      current[part] = value
      return
    }

    if (!current[part]) {
      current[part] = {}
    }

    current = current[part]
  })
}

export default PublicHomeClient