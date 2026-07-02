import { useEffect, useState } from 'react'
import {
  createEducationItem,
  getAllEducationItems,
  updateEducationItem,
  generateEnglishEducationTranslation,
} from '../../services/educationService'

const emptyForm = {
  translations: [
    {
      languageCode: 'tr',
      schoolName: '',
      department: '',
      description: '',
    },
  ],
  startYear: '',
  endYear: '',
  isCurrent: false,
  isActive: true,
  displayOrder: 1,
}

function AdminEducationSection() {
  const [educationItems, setEducationItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [translating, setTranslating] = useState(false)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  const isEditMode = Boolean(editingItem)

  useEffect(() => {
    loadEducationItems()
  }, [])

  async function loadEducationItems() {
    try {
      setLoading(true)
      setError('')

      const data = await getAllEducationItems()
      setEducationItems(data)
    } catch (err) {
      setError(err.message || 'Eğitim geçmişi alınamadı.')
    } finally {
      setLoading(false)
    }
  }

  function getNextDisplayOrder() {
  if (educationItems.length === 0) {
    return 1
  }

  const maxOrder = Math.max(
    ...educationItems.map((item) => Number(item.displayOrder) || 0)
  )

  return maxOrder + 1
}

  function openCreateForm() {
    setEditingItem(null)

    setFormData({
        ...emptyForm,
        displayOrder: getNextDisplayOrder(),
    })

    setIsFormOpen(true)
    }

  function openEditForm(item) {
    setEditingItem(item)
    setFormData(mapItemToForm(item))
    setIsFormOpen(true)
  }

  function closeForm() {
    setEditingItem(null)
    setFormData(emptyForm)
    setIsFormOpen(false)
  }

  function handleFieldChange(event) {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'isCurrent' && checked ? { endYear: '' } : {}),
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
          schoolName: '',
          department: '',
          description: '',
        },
      ],
    }))
  }

  async function handleGenerateEnglishTranslation() {
    const turkishTranslation = formData.translations.find(
      (translation) => translation.languageCode.trim().toLowerCase() === 'tr'
    )

    if (!turkishTranslation || !turkishTranslation.schoolName.trim()) {
      setError('İngilizce oluşturmak için önce Türkçe okul / kurum adı girilmelidir.')
      return
    }

    try {
      setTranslating(true)
      setError('')

      const result = await generateEnglishEducationTranslation({
        schoolName: turkishTranslation.schoolName,
        department: turkishTranslation.department,
        description: turkishTranslation.description,
      })

      setFormData((prev) => {
        const translations = [...prev.translations]

        const englishIndex = translations.findIndex(
          (translation) => translation.languageCode.trim().toLowerCase() === 'en'
        )

        const englishTranslation = {
          languageCode: 'en',
          schoolName: result.schoolName || '',
          department: result.department || '',
          description: result.description || '',
        }

        if (englishIndex >= 0) {
          translations[englishIndex] = englishTranslation
        } else {
          translations.push(englishTranslation)
        }

        return {
          ...prev,
          translations,
        }
      })
    } catch (err) {
      setError(err.message || 'İngilizce içerik oluşturulamadı.')
    } finally {
      setTranslating(false)
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
          schoolName: translation.schoolName.trim(),
          department: translation.department.trim(),
          description: translation.description.trim(),
        }))
        .filter(
          (translation) =>
            translation.languageCode &&
            translation.schoolName
        ),
      startYear: Number(formData.startYear),
      endYear: formData.isCurrent || !formData.endYear
        ? null
        : Number(formData.endYear),
      isCurrent: formData.isCurrent,
      isActive: formData.isActive,
      displayOrder: Number(formData.displayOrder),
    }

    if (payload.translations.length === 0) {
      setError('En az bir dil içeriği eklenmelidir.')
      return
    }

    if (!payload.startYear) {
      setError('Başlangıç yılı zorunludur.')
      return
    }

    try {
      setSaving(true)
      setError('')

      if (isEditMode) {
        await updateEducationItem(editingItem.id, payload)
      } else {
        await createEducationItem(payload)
      }

      closeForm()
      await loadEducationItems()
    } catch (err) {
      setError(err.message || 'Eğitim kaydı kaydedilemedi.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(item) {
    const nextIsActive = !item.isActive
    const title = getEducationTitle(item)

    const confirmed = window.confirm(
      `"${title}" kaydını ${nextIsActive ? 'aktif' : 'pasif'} yapmak istiyor musun?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await updateEducationItem(item.id, {
        translations: item.translations,
        startYear: item.startYear,
        endYear: item.endYear,
        isCurrent: item.isCurrent,
        isActive: nextIsActive,
        displayOrder: item.displayOrder,
      })

      await loadEducationItems()
    } catch (err) {
      setError(err.message || 'Durum güncellenemedi.')
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Eğitim Geçmişi</h2>
          <p className="mt-2 text-sm text-slate-400">
            Okul, bölüm, tarih aralığı ve açıklamaları timeline için buradan yönet.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02]"
        >
          Yeni Eğitim Kaydı
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
          Eğitim geçmişi yükleniyor...
        </div>
      )}

      {!loading && educationItems.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
          Henüz eğitim kaydı bulunmuyor.
        </div>
      )}

      {!loading && educationItems.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Okul</th>
                  <th className="px-5 py-4">Bölüm</th>
                  <th className="px-5 py-4">Tarih</th>
                  <th className="px-5 py-4">Aktif</th>
                  <th className="px-5 py-4">Sıra</th>
                  <th className="px-5 py-4 text-right">İşlem</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {educationItems.map((item) => {
                  const translation = getTranslation(item)

                  return (
                    <tr key={item.id} className="bg-slate-950/40">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-100">
                          {translation.schoolName}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {getEnglishTitle(item)}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {translation.department || '-'}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {formatPeriod(item)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            item.isActive
                              ? 'bg-emerald-400/10 text-emerald-300'
                              : 'bg-red-400/10 text-red-300'
                          }`}
                        >
                          {item.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {item.displayOrder}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(item)}
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                          >
                            Düzenle
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleActive(item)}
                            className={`rounded-xl border px-3 py-2 text-xs transition ${
                              item.isActive
                                ? 'border-red-400/30 text-red-300 hover:bg-red-500/10'
                                : 'border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/10'
                            }`}
                          >
                            {item.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-100">
                {isEditMode ? 'Eğitim Kaydını Düzenle' : 'Yeni Eğitim Kaydı'}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Türkçe içerik zorunludur. İngilizce içerik eklenirse public sitede dil değişiminde kullanılacak.
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-red-400 hover:text-red-300"
            >
              Kapat
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Input
                label="Başlangıç Yılı"
                name="startYear"
                type="number"
                min="1900"
                max="2100"
                value={formData.startYear}
                onChange={handleFieldChange}
                required
              />

              <Input
                label="Bitiş Yılı"
                name="endYear"
                type="number"
                min="1900"
                max="2100"
                value={formData.endYear}
                onChange={handleFieldChange}
                disabled={formData.isCurrent}
                placeholder={formData.isCurrent ? 'Devam ediyor' : '2026'}
              />

              <Input
                label="Sıralama"
                name="displayOrder"
                type="number"
                min="0"
                max="9999"
                value={formData.displayOrder}
                onChange={handleFieldChange}
                required
              />

              <div className="grid gap-3">
                <Checkbox
                label="Eğitim devam ediyor"
                name="isCurrent"
                checked={formData.isCurrent}
                onChange={handleFieldChange}
                />

                <Checkbox
                label="Sitede göster"
                name="isActive"
                checked={formData.isActive}
                onChange={handleFieldChange}
                />
              </div>
            </div>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-lg font-semibold text-slate-100">
                  Dil İçerikleri
                </h4>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleGenerateEnglishTranslation}
                    disabled={translating}
                    className="rounded-2xl border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {translating ? 'Çevriliyor...' : 'İngilizceyi Otomatik Oluştur'}
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
                      label="Okul / Kurum Adı"
                      value={translation.schoolName}
                      onChange={(event) =>
                        handleTranslationChange(index, 'schoolName', event.target.value)
                      }
                      placeholder="Üniversite / Lise / Ortaokul"
                      required
                    />

                    <Input
                      label="Bölüm / Alan"
                      value={translation.department}
                      onChange={(event) =>
                        handleTranslationChange(index, 'department', event.target.value)
                      }
                      placeholder="Bilgisayar Mühendisliği"
                    />
                  </div>

                  <div className="mt-4">
                    <Textarea
                      label="Açıklama"
                      value={translation.description}
                      onChange={(event) =>
                        handleTranslationChange(index, 'description', event.target.value)
                      }
                      placeholder="Bu eğitim dönemine ait kısa açıklama. Boş bırakılabilir."
                    />
                  </div>
                </div>
              ))}
            </section>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-300 transition hover:border-slate-400"
              >
                Vazgeç
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? 'Kaydediliyor...'
                  : isEditMode
                    ? 'Değişiklikleri Kaydet'
                    : 'Eğitim Kaydını Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function mapItemToForm(item) {
  return {
    translations: item.translations?.length > 0
      ? item.translations.map((translation) => ({
          languageCode: translation.languageCode || '',
          schoolName: translation.schoolName || '',
          department: translation.department || '',
          description: translation.description || '',
        }))
      : emptyForm.translations,
    startYear: item.startYear || '',
    endYear: item.endYear || '',
    isCurrent: Boolean(item.isCurrent),
    isActive: Boolean(item.isActive),
    displayOrder: item.displayOrder ?? 1,
  }
}

function getTranslation(item, languageCode = 'tr') {
  const selectedTranslation = item.translations?.find(
    (translation) => translation.languageCode === languageCode
  )

  if (selectedTranslation) {
    return selectedTranslation
  }

  return item.translations?.[0] || {
    schoolName: '-',
    department: '',
    description: '',
  }
}

function getEducationTitle(item) {
  return getTranslation(item).schoolName || `Eğitim #${item.id}`
}

function getEnglishTitle(item) {
  const english = item.translations?.find(
    (translation) => translation.languageCode === 'en'
  )

  return english?.schoolName || ''
}

function getNextDisplayOrderFromItems(items) {
  if (!items || items.length === 0) {
    return 1
  }

  const maxOrder = Math.max(
    ...items.map((item) => Number(item.displayOrder) || 0)
  )

  return maxOrder + 1
}

function formatPeriod(item) {
  if (item.isCurrent) {
    return `${item.startYear} - Devam ediyor`
  }

  if (item.endYear) {
    return `${item.startYear} - ${item.endYear}`
  }

  return `${item.startYear}`
}

function Input({ label, value, onChange, type = 'text', ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
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

export default AdminEducationSection