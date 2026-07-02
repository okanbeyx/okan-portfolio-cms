import { useEffect, useMemo, useState } from 'react'
import { FaGithub, FaInstagram, FaLinkedin, FaGlobe, FaPhoneAlt, FaMapMarkerAlt, FaLink } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { SiGmail } from 'react-icons/si'
import { contactLinks as fallbackContactLinks } from '../../data/contact'
import { getContactItems } from '../../services/contactService'
import GlassCard from '../ui/GlassCard'
import GradientButton from '../ui/GradientButton'

function ContactSection({ t, language }) {
  const [contactItems, setContactItems] = useState([])

  useEffect(() => {
    loadContactItems()
  }, [])

  async function loadContactItems() {
    try {
      const data = await getContactItems()
      setContactItems(Array.isArray(data) ? data : [])
    } catch {
      setContactItems([])
    }
  }

  const displayContactLinks = useMemo(() => {
    const source = contactItems.length > 0 ? contactItems : fallbackContactLinks

    return source
      .filter((item) => item.isActive !== false)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map((item) => normalizeContactItem(item, language))
  }, [contactItems, language])

  const emailItem = displayContactLinks.find(
    (item) =>
      item.type === 'gmail' ||
      item.type === 'email' ||
      item.href?.startsWith('mailto:')
  )

  return (
    <section id="contact" className="scroll-mt-28 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <GlassCard className="overflow-hidden p-8 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
                {t.contact.label}
              </p>

              <h2 className="text-4xl font-bold text-slate-100 md:text-5xl">
                {t.contact.title}
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-slate-400">
                {t.contact.description}
              </p>

              <p className="mt-5 max-w-2xl rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4 text-sm leading-7 text-cyan-100">
                {t.contact.note}
              </p>

              {emailItem?.href && emailItem.href !== '#' && (
                <div className="mt-8">
                  <GradientButton href={emailItem.href}>
                    {language === 'tr' ? 'E-posta Gönder' : 'Send Email'}
                  </GradientButton>
                </div>
              )}
            </div>

            <div className="grid gap-4">
              {displayContactLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.07]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-xl text-cyan-200 transition group-hover:border-cyan-300/40 group-hover:bg-cyan-300/15">
                    <ContactIcon type={item.type} iconKey={item.iconKey} />
                  </span>

                  <span className="min-w-0">
                    <p className="text-sm font-semibold text-slate-400">
                      {item.label}
                    </p>

                    <p className="mt-2 break-words font-semibold text-slate-100 transition group-hover:text-cyan-200">
                      {item.value}
                    </p>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  )
}

function ContactIcon({ type, iconKey }) {
  const key = iconKey || type

  if (key === 'gmail') {
    return <SiGmail />
  }

  if (key === 'email') {
    return <MdEmail />
  }

  if (key === 'github') {
    return <FaGithub />
  }

  if (key === 'linkedin') {
    return <FaLinkedin />
  }

  if (key === 'instagram') {
    return <FaInstagram />
  }

  if (key === 'website') {
    return <FaGlobe />
  }

  if (key === 'phone') {
    return <FaPhoneAlt />
  }

  if (key === 'location') {
    return <FaMapMarkerAlt />
  }

  return <FaLink />
}

function normalizeContactItem(item, language) {
  const label =
    language === 'tr'
      ? item.labelTr || item.label || item.labelEn || ''
      : item.labelEn || item.label || item.labelTr || ''

  const value =
    language === 'tr'
      ? item.valueTr || item.value || item.valueEn || ''
      : item.valueEn || item.value || item.valueTr || ''

  return {
    id: item.id,
    type: item.type || item.iconKey || 'custom',
    iconKey: item.iconKey || item.type || 'custom',
    label,
    value,
    href: getContactHref(item, value),
    displayOrder: item.displayOrder,
  }
}

function getContactHref(item, value) {
  if (item.href) {
    return item.href
  }

  if (item.url) {
    return item.url
  }

  return createAutoHref(item.type || item.iconKey, value)
}

function createAutoHref(type, value) {
  const cleanValue = value?.trim()

  if (!cleanValue) {
    return '#'
  }

  if (type === 'gmail') {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanValue)}`
  }

  if (type === 'email') {
    return `mailto:${cleanValue}`
  }

  if (type === 'phone') {
    return `tel:${cleanValue}`
  }

  if (type === 'github') {
    const username = cleanValue
      .replace('https://github.com/', '')
      .replace('http://github.com/', '')
      .replace('github.com/', '')
      .replace('@', '')
      .replaceAll(' ', '')

    return `https://github.com/${username}`
  }

  if (type === 'linkedin') {
    if (cleanValue.startsWith('http')) {
      return cleanValue
    }

    const username = cleanValue
      .replace('https://www.linkedin.com/in/', '')
      .replace('http://www.linkedin.com/in/', '')
      .replace('linkedin.com/in/', '')
      .replace('@', '')
      .replaceAll(' ', '')

    return `https://www.linkedin.com/in/${username}`
  }

  if (type === 'instagram') {
    const username = cleanValue
      .replace('https://www.instagram.com/', '')
      .replace('http://www.instagram.com/', '')
      .replace('instagram.com/', '')
      .replace('@', '')
      .replaceAll(' ', '')

    return `https://www.instagram.com/${username}`
  }

  if (type === 'website') {
    return cleanValue.startsWith('http') ? cleanValue : `https://${cleanValue}`
  }

  return '#'
}

export default ContactSection