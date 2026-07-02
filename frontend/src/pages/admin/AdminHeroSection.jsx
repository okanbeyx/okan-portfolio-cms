import { useEffect, useState } from 'react'
import {
  getAdminHeroContent,
  updateHeroContent,
  generateEnglishHeroTranslation,
} from '../../services/heroService'

const emptyForm = {
  translations: [
    {
      languageCode: 'tr',
      label: '',
      title: '',
      subtitle: '',
      primaryButtonText: '',
      secondaryButtonText: '',
    },
  ],
  primaryButtonUrl: '#projects',
  secondaryButtonUrl: '#',
  isActive: true,
}

function AdminHeroSection() {
  const [formData, setFormData] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [translatingEnglish, setTranslatingEnglish] = useState(false)
  const [translationError, setTranslationError] = useState('')

  useEffect(() => {
    loadHeroContent()
  }, [])

  async function loadHeroContent() {
    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')

      const data = await getAdminHeroContent()
      setFormData(mapHeroToForm(data))
    } catch (err) {
      setError(err.message || 'Hero alanı alınamadı.')
    } finally {
      setLoading(false)
    }
  }

  function handleFieldChange(event) {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleTranslationChange(index, field, value) {
    setFormData((prev) => {
      const updatedTranslations = [...prev.translations]

      updatedTranslations[index] = {
        ...updatedTranslations[index],
        [field]: value,
      }

      return {
        ...prev,
        translations: updatedTranslations,
      }
    })
  }

  function addEnglishTranslation() {
    const hasEnglish = formData.translations.some(
      (translation) => translation.languageCode.trim().toLowerCase() === 'en'
    )

    if (hasEnglish) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      translations: [
        ...prev.translations,
        {
          languageCode: 'en',
          label: '',
          title: '',
          subtitle: '',
          primaryButtonText: '',
          secondaryButtonText: '',
        },
      ],
    }))
  }

  async function handleGenerateEnglishTranslation() {
  const turkishTranslation = formData.translations.find(
    (translation) => translation.languageCode.trim().toLowerCase() === 'tr'
  )

  if (!turkishTranslation) {
    setTranslationError('Önce Türkçe hero içeriği eklenmelidir.')
    return
  }

  if (
    !turkishTranslation.label.trim() ||
    !turkishTranslation.title.trim() ||
    !turkishTranslation.subtitle.trim() ||
    !turkishTranslation.primaryButtonText.trim() ||
    !turkishTranslation.secondaryButtonText.trim()
  ) {
    setTranslationError('İngilizce oluşturmak için Türkçe hero alanlarının tamamı doldurulmalıdır.')
    return
  }

  try {
    setTranslatingEnglish(true)
    setTranslationError('')
    setError('')
    setSuccessMessage('')

    const englishTranslation = await generateEnglishHeroTranslation({
      label: turkishTranslation.label,
      title: turkishTranslation.title,
      subtitle: turkishTranslation.subtitle,
      primaryButtonText: turkishTranslation.primaryButtonText,
      secondaryButtonText: turkishTranslation.secondaryButtonText,
    })

    setFormData((prev) => {
      const hasEnglish = prev.translations.some(
        (translation) => translation.languageCode.trim().toLowerCase() === 'en'
      )

      if (hasEnglish) {
        return {
          ...prev,
          translations: prev.translations.map((translation) => {
            if (translation.languageCode.trim().toLowerCase() !== 'en') {
              return translation
            }

            return {
              ...translation,
              languageCode: 'en',
              label: englishTranslation.label || '',
              title: englishTranslation.title || '',
              subtitle: englishTranslation.subtitle || '',
              primaryButtonText: englishTranslation.primaryButtonText || '',
              secondaryButtonText: englishTranslation.secondaryButtonText || '',
            }
          }),
        }
      }

      return {
        ...prev,
        translations: [
          ...prev.translations,
          {
            languageCode: 'en',
            label: englishTranslation.label || '',
            title: englishTranslation.title || '',
            subtitle: englishTranslation.subtitle || '',
            primaryButtonText: englishTranslation.primaryButtonText || '',
            secondaryButtonText: englishTranslation.secondaryButtonText || '',
          },
        ],
      }
    })
  } catch (err) {
    setTranslationError(err.message || 'Hero İngilizce içeriği oluşturulamadı.')
  } finally {
    setTranslatingEnglish(false)
  }
}

  function removeTranslation(index) {
    setFormData((prev) => ({
      ...prev,
      translations: prev.translations.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      translations: formData.translations
        .map((translation) => ({
          languageCode: translation.languageCode.trim().toLowerCase(),
          label: translation.label.trim(),
          title: translation.title.trim(),
          subtitle: translation.subtitle.trim(),
          primaryButtonText: translation.primaryButtonText.trim(),
          secondaryButtonText: translation.secondaryButtonText.trim(),
        }))
        .filter(
          (translation) =>
            translation.languageCode &&
            translation.label &&
            translation.title &&
            translation.subtitle &&
            translation.primaryButtonText &&
            translation.secondaryButtonText
        ),
      primaryButtonUrl: formData.primaryButtonUrl.trim() || '#projects',
      secondaryButtonUrl: formData.secondaryButtonUrl.trim() || '#',
      isActive: formData.isActive,
    }

    if (payload.translations.length === 0) {
      setError('En az bir dil içeriği eklenmelidir.')
      return
    }

    try {
      setSaving(true)
      setError('')
      setTranslationError('')
      setSuccessMessage('')

      const updatedHero = await updateHeroContent(payload)
      setFormData(mapHeroToForm(updatedHero))
      setSuccessMessage('Hero alanı başarıyla güncellendi.')
    } catch (err) {
      setError(err.message || 'Hero alanı kaydedilemedi.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-slate-300 backdrop-blur-xl">
        Hero alanı yükleniyor...
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Hero Alanı</h2>
          <p className="mt-2 text-sm text-slate-400">
            Anasayfanın en üstündeki başlık, açıklama ve butonları buradan yönet.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerateEnglishTranslation}
            disabled={translatingEnglish}
            className="rounded-2xl border border-emerald-400/40 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {translatingEnglish ? 'Oluşturuluyor...' : 'İngilizceyi Otomatik Oluştur'}
          </button>

          <button
            type="button"
            onClick={addEnglishTranslation}
            className="rounded-2xl border border-cyan-400/40 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10"
          >
            + İngilizce Ekle
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-200">
          {successMessage}
        </div>
      )}

      {translationError && (
        <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {translationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-5">
          <h3 className="mb-4 text-lg font-semibold text-slate-100">
            Buton Linkleri
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Birincil Buton Linki"
              name="primaryButtonUrl"
              value={formData.primaryButtonUrl}
              onChange={handleFieldChange}
              placeholder="#projects"
              required
            />

            <Input
              label="İkincil Buton Linki"
              name="secondaryButtonUrl"
              value={formData.secondaryButtonUrl}
              onChange={handleFieldChange}
              placeholder="https://github.com/..."
              required
            />
          </div>

          <div className="mt-4">
            <Checkbox
              label="Hero alanını sitede göster"
              name="isActive"
              checked={formData.isActive}
              onChange={handleFieldChange}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-100">
            Dil İçerikleri
          </h3>

          {formData.translations.map((translation, index) => (
            <div
              key={`${translation.languageCode}-${index}`}
              className="rounded-3xl border border-white/10 bg-slate-900/50 p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-cyan-300">
                    Dil #{index + 1}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Hero metinlerinin tek dil karşılığı.
                  </p>
                </div>

                {formData.translations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTranslation(index)}
                    className="rounded-xl border border-red-400/30 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/10"
                  >
                    Kaldır
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  label="Dil Kodu"
                  value={translation.languageCode}
                  onChange={(event) =>
                    handleTranslationChange(index, 'languageCode', event.target.value)
                  }
                  placeholder="tr"
                  required
                />

                <Input
                  label="Üst Etiket"
                  value={translation.label}
                  onChange={(event) =>
                    handleTranslationChange(index, 'label', event.target.value)
                  }
                  placeholder="Portföy CMS"
                  required
                />

                <Input
                  label="Ana Başlık"
                  value={translation.title}
                  onChange={(event) =>
                    handleTranslationChange(index, 'title', event.target.value)
                  }
                  placeholder="Okan Çelikcan"
                  required
                />
              </div>

              <div className="mt-4">
                <Textarea
                  label="Alt Başlık"
                  value={translation.subtitle}
                  onChange={(event) =>
                    handleTranslationChange(index, 'subtitle', event.target.value)
                  }
                  placeholder="Bilgisayar Mühendisi | Full-Stack Developer..."
                  required
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  label="Birincil Buton Metni"
                  value={translation.primaryButtonText}
                  onChange={(event) =>
                    handleTranslationChange(index, 'primaryButtonText', event.target.value)
                  }
                  placeholder="Projeleri Gör"
                  required
                />

                <Input
                  label="İkincil Buton Metni"
                  value={translation.secondaryButtonText}
                  onChange={(event) =>
                    handleTranslationChange(index, 'secondaryButtonText', event.target.value)
                  }
                  placeholder="GitHub"
                  required
                />
              </div>
            </div>
          ))}
        </section>

        <div className="flex justify-end border-t border-white/10 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Kaydediliyor...' : 'Hero Alanını Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}

function mapHeroToForm(hero) {
  return {
    translations: hero.translations?.length > 0
  ? [...hero.translations]
      .sort((a, b) => {
        const order = { tr: 1, en: 2 }
        return (order[a.languageCode] || 99) - (order[b.languageCode] || 99)
      })
      .map((translation) => ({
          languageCode: translation.languageCode || '',
          label: translation.label || '',
          title: translation.title || '',
          subtitle: translation.subtitle || '',
          primaryButtonText: translation.primaryButtonText || '',
          secondaryButtonText: translation.secondaryButtonText || '',
        }))
      : emptyForm.translations,
    primaryButtonUrl: hero.primaryButtonUrl || '#projects',
    secondaryButtonUrl: hero.secondaryButtonUrl || '#',
    isActive: Boolean(hero.isActive),
  }
}

function Input({ label, value, onChange, type = 'text', ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
        {...props}
      />
    </label>
  )
}

function Textarea({ label, value, onChange, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        rows="4"
        className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
        {...props}
      />
    </label>
  )
}

function Checkbox({ label, name, checked, onChange }) {
  return (
    <label className="flex min-h-[48px] items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-cyan-400"
      />
      {label}
    </label>
  )
}

export default AdminHeroSection