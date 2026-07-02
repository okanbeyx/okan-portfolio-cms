import { useEffect, useState } from 'react'
import {
  getAdminAboutContent,
  updateAboutContent,
  generateEnglishAboutTranslation,
} from '../../services/aboutService'

function createEmptyForm() {
  return {
    isActive: true,
    translations: {
      tr: {
        languageCode: 'tr',
        label: '',
        title: '',
        description: '',
        intro: '',
      },
      en: {
        languageCode: 'en',
        label: '',
        title: '',
        description: '',
        intro: '',
      },
    },
    focusAreas: [],
  }
}

function createEmptyFocusArea(displayOrder) {
  return {
    localId: `${Date.now()}-${Math.random()}`,
    id: 0,
    isActive: true,
    displayOrder,
    translations: {
      tr: {
        languageCode: 'tr',
        title: '',
        description: '',
      },
      en: {
        languageCode: 'en',
        title: '',
        description: '',
      },
    },
  }
}

function AdminAboutSection() {
  const [form, setForm] = useState(createEmptyForm())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [translating, setTranslating] = useState(false)
  const [showEnglishFields, setShowEnglishFields] = useState(false)

  useEffect(() => {
    loadAboutContent()
  }, [])

  async function loadAboutContent() {
    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')

      const data = await getAdminAboutContent()
      const normalizedForm = normalizeAboutData(data)

      setForm(normalizedForm)
      setShowEnglishFields(hasEnglishContent(normalizedForm))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function normalizeAboutData(data) {
    const emptyForm = createEmptyForm()

    const trTranslation =
      data.translations?.find((item) => item.languageCode === 'tr') ||
      emptyForm.translations.tr

    const enTranslation =
      data.translations?.find((item) => item.languageCode === 'en') ||
      emptyForm.translations.en

    const focusAreas =
      data.focusAreas
        ?.sort((a, b) => a.displayOrder - b.displayOrder)
        ?.map((area) => {
          const trArea =
            area.translations?.find((item) => item.languageCode === 'tr') || {
              languageCode: 'tr',
              title: '',
              description: '',
            }

          const enArea =
            area.translations?.find((item) => item.languageCode === 'en') || {
              languageCode: 'en',
              title: '',
              description: '',
            }

          return {
            localId: `existing-${area.id}`,
            id: area.id,
            isActive: area.isActive,
            displayOrder: area.displayOrder,
            translations: {
              tr: trArea,
              en: enArea,
            },
          }
        }) || []

    return {
      isActive: data.isActive ?? true,
      translations: {
        tr: trTranslation,
        en: enTranslation,
      },
      focusAreas,
    }
  }

  function hasEnglishContent(normalizedForm) {
    const mainEnglish = normalizedForm.translations.en

    const hasMainEnglish =
      mainEnglish.label?.trim() ||
      mainEnglish.title?.trim() ||
      mainEnglish.description?.trim() ||
      mainEnglish.intro?.trim()

    const hasFocusEnglish = normalizedForm.focusAreas.some((area) => {
      const english = area.translations.en

      return english.title?.trim() || english.description?.trim()
    })

    return Boolean(hasMainEnglish || hasFocusEnglish)
  }

  function handleMainChange(languageCode, field, value) {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [languageCode]: {
          ...current.translations[languageCode],
          [field]: value,
        },
      },
    }))
  }

  function handleFocusAreaChange(localId, field, value) {
    setForm((current) => ({
      ...current,
      focusAreas: current.focusAreas.map((area) =>
        area.localId === localId
          ? {
              ...area,
              [field]: field === 'displayOrder' ? Number(value) : value,
            }
          : area
      ),
    }))
  }

  function handleFocusTranslationChange(localId, languageCode, field, value) {
    setForm((current) => ({
      ...current,
      focusAreas: current.focusAreas.map((area) =>
        area.localId === localId
          ? {
              ...area,
              translations: {
                ...area.translations,
                [languageCode]: {
                  ...area.translations[languageCode],
                  [field]: value,
                },
              },
            }
          : area
      ),
    }))
  }

  function handleAddFocusArea() {
    const nextOrder =
      form.focusAreas.length > 0
        ? Math.max(
            ...form.focusAreas.map((area) => Number(area.displayOrder) || 0)
          ) + 1
        : 1

    setForm((current) => ({
      ...current,
      focusAreas: [...current.focusAreas, createEmptyFocusArea(nextOrder)],
    }))
  }

  function handleRemoveFocusArea(localId) {
    const confirmed = window.confirm('Bu odak alanını silmek istiyor musun?')

    if (!confirmed) {
      return
    }

    setForm((current) => ({
      ...current,
      focusAreas: current.focusAreas.filter((area) => area.localId !== localId),
    }))
  }

  function buildPayload() {
    return {
      isActive: form.isActive,
      translations: [
        {
          languageCode: 'tr',
          label: form.translations.tr.label,
          title: form.translations.tr.title,
          description: form.translations.tr.description,
          intro: form.translations.tr.intro,
        },
        {
          languageCode: 'en',
          label: form.translations.en.label,
          title: form.translations.en.title,
          description: form.translations.en.description,
          intro: form.translations.en.intro,
        },
      ],
      focusAreas: form.focusAreas.map((area, index) => ({
        id: area.id || 0,
        isActive: area.isActive,
        displayOrder: Number(area.displayOrder) || index + 1,
        translations: [
          {
            languageCode: 'tr',
            title: area.translations.tr.title,
            description: area.translations.tr.description,
          },
          {
            languageCode: 'en',
            title: area.translations.en.title,
            description: area.translations.en.description,
          },
        ],
      })),
    }
  }

  async function handleGenerateEnglish() {
    try {
      setTranslating(true)
      setError('')
      setSuccessMessage('')

      const result = await generateEnglishAboutTranslation({
        label: form.translations.tr.label,
        title: form.translations.tr.title,
        description: form.translations.tr.description,
        intro: form.translations.tr.intro,
        focusAreas: form.focusAreas.map((area) => ({
          title: area.translations.tr.title,
          description: area.translations.tr.description,
        })),
      })

      setForm((current) => ({
        ...current,
        translations: {
          ...current.translations,
          en: {
            languageCode: 'en',
            label: result.label || '',
            title: result.title || '',
            description: result.description || '',
            intro: result.intro || '',
          },
        },
        focusAreas: current.focusAreas.map((area, index) => ({
          ...area,
          translations: {
            ...area.translations,
            en: {
              languageCode: 'en',
              title: result.focusAreas?.[index]?.title || '',
              description: result.focusAreas?.[index]?.description || '',
            },
          },
        })),
      }))

      setShowEnglishFields(true)
      setSuccessMessage('İngilizce içerik otomatik oluşturuldu. Kaydetmeyi unutma.')
    } catch (err) {
      setError(err.message)
    } finally {
      setTranslating(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccessMessage('')

      const updatedData = await updateAboutContent(buildPayload())
      const normalizedForm = normalizeAboutData(updatedData)

      setForm(normalizedForm)
      setShowEnglishFields(hasEnglishContent(normalizedForm))
      setSuccessMessage('Hakkımda alanı başarıyla güncellendi.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl">
        <p className="text-sm text-slate-300">Hakkımda alanı yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">
            Hakkımda CMS
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Hakkımda başlığı, açıklaması, ana metni ve odak kartları buradan yönetilir.
          </p>
        </div>

        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                isActive: event.target.checked,
              }))
            }
            className="h-4 w-4 accent-cyan-400"
          />
          Sitede göster
        </label>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-5">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/40 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Hakkımda İçerikleri
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Türkçe içeriği yaz, İngilizceyi otomatik oluştur veya manuel düzenle.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleGenerateEnglish}
                disabled={translating}
                className="rounded-2xl border border-emerald-400/40 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {translating ? 'Çevriliyor...' : 'İngilizceyi Otomatik Oluştur'}
              </button>

              <button
                type="button"
                onClick={() => setShowEnglishFields(true)}
                className="rounded-2xl border border-cyan-400/40 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
              >
                + İngilizce Ekle
              </button>
            </div>
          </div>

          <div className={`grid gap-5 ${showEnglishFields ? 'lg:grid-cols-2' : ''}`}>
            <LanguageMainFields
              title="Türkçe İçerik"
              data={form.translations.tr}
              languageCode="tr"
              onChange={handleMainChange}
            />

            {showEnglishFields && (
              <LanguageMainFields
                title="İngilizce İçerik"
                data={form.translations.en}
                languageCode="en"
                onChange={handleMainChange}
              />
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Odak Alanları
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Full-stack, güvenlik, AI gibi kartları buradan ekleyip düzenleyebilirsin.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddFocusArea}
              className="rounded-2xl border border-cyan-400/40 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
            >
              Yeni Odak Alanı Ekle
            </button>
          </div>

          {form.focusAreas.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-400">
              Henüz odak alanı eklenmedi.
            </div>
          )}

          <div className="space-y-5">
            {form.focusAreas.map((area) => (
              <div
                key={area.localId}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={area.isActive}
                        onChange={(event) =>
                          handleFocusAreaChange(
                            area.localId,
                            'isActive',
                            event.target.checked
                          )
                        }
                        className="h-4 w-4 accent-cyan-400"
                      />
                      Sitede göster
                    </label>

                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      Sıra
                      <input
                        type="number"
                        min="1"
                        value={area.displayOrder}
                        onChange={(event) =>
                          handleFocusAreaChange(
                            area.localId,
                            'displayOrder',
                            event.target.value
                          )
                        }
                        className="w-20 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFocusArea(area.localId)}
                    className="rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                  >
                    Sil
                  </button>
                </div>

                <div className={`grid gap-5 ${showEnglishFields ? 'lg:grid-cols-2' : ''}`}>
                  <FocusAreaFields
                    title="Türkçe Kart"
                    data={area.translations.tr}
                    languageCode="tr"
                    localId={area.localId}
                    onChange={handleFocusTranslationChange}
                  />

                  {showEnglishFields && (
                    <FocusAreaFields
                      title="İngilizce Kart"
                      data={area.translations.en}
                      languageCode="en"
                      localId={area.localId}
                      onChange={handleFocusTranslationChange}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Hakkımda Alanını Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}

function LanguageMainFields({ title, data, languageCode, onChange }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
      <h3 className="mb-5 text-lg font-semibold text-cyan-300">
        {title}
      </h3>

      <div className="space-y-4">
        <InputField
          label="Küçük Üst Yazı"
          value={data.label}
          onChange={(value) => onChange(languageCode, 'label', value)}
        />

        <InputField
          label="Başlık"
          value={data.title}
          onChange={(value) => onChange(languageCode, 'title', value)}
        />

        <TextareaField
          label="Kısa Açıklama"
          value={data.description}
          rows={3}
          onChange={(value) => onChange(languageCode, 'description', value)}
        />

        <TextareaField
          label="Ana Hakkımda Metni"
          value={data.intro}
          rows={6}
          onChange={(value) => onChange(languageCode, 'intro', value)}
        />
      </div>
    </div>
  )
}

function FocusAreaFields({ title, data, languageCode, localId, onChange }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-cyan-300">
        {title}
      </h4>

      <div className="space-y-3">
        <InputField
          label="Başlık"
          value={data.title}
          onChange={(value) =>
            onChange(localId, languageCode, 'title', value)
          }
        />

        <TextareaField
          label="Açıklama"
          value={data.description}
          rows={4}
          onChange={(value) =>
            onChange(localId, languageCode, 'description', value)
          }
        />
      </div>
    </div>
  )
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
      />
    </div>
  )
}

function TextareaField({ label, value, rows, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">
        {label}
      </label>

      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm leading-7 text-slate-100 outline-none transition focus:border-cyan-400"
      />
    </div>
  )
}

export default AdminAboutSection