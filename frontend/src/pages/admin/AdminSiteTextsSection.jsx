import { useEffect, useState } from 'react'
import {
  generateEnglishSiteTextTranslation,
  getAdminSiteTexts,
  updateSiteTexts,
} from '../../services/siteTextsService'

function AdminSiteTextsSection() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [translatingKey, setTranslatingKey] = useState('')
  const [bulkTranslating, setBulkTranslating] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadSiteTexts()
  }, [])

  async function loadSiteTexts() {
    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')

      const data = await getAdminSiteTexts()
      setItems(normalizeItems(data))
    } catch (err) {
      setError(err.message || 'Site metinleri alınamadı.')
    } finally {
      setLoading(false)
    }
  }

  function normalizeItems(data) {
    return data
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((item) => {
        const tr =
          item.translations?.find((translation) => translation.languageCode === 'tr') || {
            languageCode: 'tr',
            value: '',
          }

        const en =
          item.translations?.find((translation) => translation.languageCode === 'en') || {
            languageCode: 'en',
            value: '',
          }

        return {
          ...item,
          translations: {
            tr,
            en,
          },
        }
      })
  }

  function handleValueChange(itemKey, languageCode, value) {
    setItems((current) =>
      current.map((item) =>
        item.key === itemKey
          ? {
              ...item,
              translations: {
                ...item.translations,
                [languageCode]: {
                  ...item.translations[languageCode],
                  value,
                },
              },
            }
          : item
      )
    )
  }

  function buildPayload() {
    return items.map((item) => ({
      id: item.id,
      key: item.key,
      groupKey: item.groupKey,
      label: item.label,
      isActive: item.isActive,
      displayOrder: item.displayOrder,
      translations: [
        {
          languageCode: 'tr',
          value: item.translations.tr.value,
        },
        {
          languageCode: 'en',
          value: item.translations.en.value,
        },
      ],
    }))
  }

  async function handleGenerateEnglish(itemKey) {
    const item = items.find((currentItem) => currentItem.key === itemKey)

    if (!item) {
      return
    }

    const trValue = item.translations.tr.value?.trim()

    if (!trValue) {
      setError('İngilizce oluşturmak için önce Türkçe metin girilmelidir.')
      return
    }

    try {
      setTranslatingKey(itemKey)
      setError('')
      setSuccessMessage('')

      const result = await generateEnglishSiteTextTranslation({
        key: item.key,
        label: item.label,
        value: trValue,
      })

      handleValueChange(item.key, 'en', result.value || '')
      setSuccessMessage(`"${item.label}" için İngilizce metin oluşturuldu. Kaydetmeyi unutma.`)
    } catch (err) {
      setError(err.message || 'İngilizce metin oluşturulamadı.')
    } finally {
      setTranslatingKey('')
    }
  }

  async function handleGenerateAllEnglish() {
    const confirmed = window.confirm(
      'Tüm Türkçe site metinlerinden İngilizce içerik oluşturulsun mu? Mevcut İngilizce alanların üzerine yazılır.'
    )

    if (!confirmed) {
      return
    }

    try {
      setBulkTranslating(true)
      setError('')
      setSuccessMessage('')

      let updatedItems = [...items]

      for (const item of items) {
        const trValue = item.translations.tr.value?.trim()

        if (!trValue) {
          continue
        }

        const result = await generateEnglishSiteTextTranslation({
          key: item.key,
          label: item.label,
          value: trValue,
        })

        updatedItems = updatedItems.map((currentItem) =>
          currentItem.key === item.key
            ? {
                ...currentItem,
                translations: {
                  ...currentItem.translations,
                  en: {
                    languageCode: 'en',
                    value: result.value || '',
                  },
                },
              }
            : currentItem
        )

        setItems(updatedItems)
      }

      setSuccessMessage('Tüm İngilizce site metinleri oluşturuldu. Kaydetmeyi unutma.')
    } catch (err) {
      setError(err.message || 'Toplu İngilizce metin oluşturulamadı.')
    } finally {
      setBulkTranslating(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccessMessage('')

      const updatedItems = await updateSiteTexts(buildPayload())
      setItems(normalizeItems(updatedItems))
      setSuccessMessage('Site metinleri başarıyla kaydedildi.')
    } catch (err) {
      setError(err.message || 'Site metinleri kaydedilemedi.')
    } finally {
      setSaving(false)
    }
  }

  const groupedItems = items.reduce((groups, item) => {
    const key = item.groupKey || 'other'

    return {
      ...groups,
      [key]: [...(groups[key] || []), item],
    }
  }, {})

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl">
        <p className="text-sm text-slate-300">Site metinleri yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">
            Site Metinleri CMS
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Navbar, bölüm başlıkları, açıklamalar, butonlar ve footer metinleri buradan yönetilir.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateAllEnglish}
          disabled={bulkTranslating}
          className="rounded-2xl border border-emerald-400/40 px-5 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {bulkTranslating ? 'Tümü çevriliyor...' : 'Tüm İngilizceleri Otomatik Oluştur'}
        </button>
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
        {Object.entries(groupedItems).map(([groupKey, groupItems]) => (
          <section
            key={groupKey}
            className="rounded-3xl border border-white/10 bg-slate-950/40 p-5"
          >
            <h3 className="mb-5 text-lg font-semibold text-cyan-300">
              {getGroupTitle(groupKey)}
            </h3>

            <div className="space-y-5">
              {groupItems.map((item) => (
                <div
                  key={item.key}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-100">
                        {item.label}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.key}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGenerateEnglish(item.key)}
                      disabled={translatingKey === item.key || bulkTranslating}
                      className="rounded-xl border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {translatingKey === item.key
                        ? 'Çevriliyor...'
                        : 'İngilizceyi Otomatik Oluştur'}
                    </button>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <TextArea
                      label="Türkçe"
                      value={item.translations.tr.value}
                      onChange={(value) =>
                        handleValueChange(item.key, 'tr', value)
                      }
                    />

                    <TextArea
                      label="İngilizce"
                      value={item.translations.en.value}
                      onChange={(value) =>
                        handleValueChange(item.key, 'en', value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || bulkTranslating}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Site Metinlerini Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">
        {label}
      </span>

      <textarea
        value={value}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm leading-7 text-slate-100 outline-none transition focus:border-cyan-400"
      />
    </label>
  )
}

function getGroupTitle(groupKey) {
  const titles = {
  nav: 'Navbar',
  projects: 'Projeler Bölümü',
  skills: 'Teknik Yetenekler Bölümü',
  education: 'Eğitim Bölümü',
  about: 'Hakkımda Bölümü',
  testimonials: 'Yorumlar Bölümü',
  contact: 'İletişim Bölümü',
  footer: 'Footer',
 }

  return titles[groupKey] || groupKey
}

export default AdminSiteTextsSection