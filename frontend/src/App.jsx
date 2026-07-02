import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { uiText } from './data/uiText'
import { getSiteTexts } from './services/siteTextsService'
import { ADMIN_BASE_PATH, ADMIN_LOGIN_PATH } from './config/adminRoutes'
import BackgroundEffects from './components/layout/BackgroundEffects'
import Navbar from './components/layout/Navbar'
import HeroSection from './components/sections/HeroSection'
import ProjectsSection from './components/sections/ProjectsSection'
import SkillsSection from './components/sections/SkillsSection'
import AboutSection from './components/sections/AboutSection'
import ContactSection from './components/sections/ContactSection'
import Footer from './components/layout/Footer'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import NotFoundPage from './pages/NotFoundPage'
import EducationSection from './components/sections/EducationSection'
import SiteSplash from './components/ui/SiteSplash'
import TestimonialsSection from './components/sections/TestimonialsSection'

function PublicHome() {
  const [language, setLanguage] = useState('tr')
  const [siteTextItems, setSiteTextItems] = useState([])
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    loadSiteTexts()
  }, [])

  async function loadSiteTexts() {
    try {
      const data = await getSiteTexts()
      setSiteTextItems(data)
    } catch {
      setSiteTextItems([])
    }
  }

  const t = buildDynamicText(uiText[language], siteTextItems, language)

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route
        path={ADMIN_LOGIN_PATH}
        caseSensitive
        element={<AdminLoginPage />}
      />

      <Route
        path={ADMIN_BASE_PATH}
        caseSensitive
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App