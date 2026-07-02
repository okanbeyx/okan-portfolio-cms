import { useEffect, useState } from 'react'
import { generateEnglishProjectTranslation } from '../../services/projectService'

const STATUS_OPTIONS = [
  {
    key: 'in_progress',
    tr: 'Geliştiriliyor',
    en: 'In Progress',
  },
  {
    key: 'completed',
    tr: 'Tamamlandı',
    en: 'Completed',
  },
  {
    key: 'updating',
    tr: 'Güncelleniyor',
    en: 'Updating',
  },
  {
    key: 'maintenance',
    tr: 'Bakımda',
    en: 'Under Maintenance',
  },
  {
    key: 'archived',
    tr: 'Yayından Kaldırıldı',
    en: 'Archived',
  },
  {
    key: 'planned',
    tr: 'Planlanıyor',
    en: 'Planned',
  },
]

const initialFormData = {
  translations: [
    {
      languageCode: 'tr',
      title: '',
      description: '',
      category: '',
    },
  ],
  statusKey: 'in_progress',
  techStackText: '',
  githubUrl: '',
  liveUrl: '',
  imageUrl: null,
  isFeatured: true,
  isActive: true,
  displayOrder: 1,
}

function ProjectFormModal({
  isOpen,
  project = null,
  mode = 'create',
  onClose,
  onSubmit,
  saving,
}) {
  const [formData, setFormData] = useState(initialFormData)
  const [translatingEnglish, setTranslatingEnglish] = useState(false)
  const [translationError, setTranslationError] = useState('')

  const isEditMode = mode === 'edit'

  useEffect(() => {
    if (!isOpen) {
      return
    }

    if (isEditMode && project) {
      setFormData(mapProjectToFormData(project))
      return
    }

    setFormData(initialFormData)
  }, [isOpen, isEditMode, project])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [isOpen])

  if (!isOpen) {
    return null
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
          title: '',
          description: '',
          category: '',
        },
      ],
    }))
  }

    async function handleGenerateEnglishTranslation() {
      const turkishTranslation = formData.translations.find(
        (translation) => translation.languageCode.trim().toLowerCase() === 'tr'
      )

      if (!turkishTranslation) {
        setTranslationError('Önce Türkçe içerik bloğu eklenmelidir.')
        return
      }

      if (
        !turkishTranslation.title.trim() ||
        !turkishTranslation.description.trim() ||
        !turkishTranslation.category.trim()
      ) {
        setTranslationError('İngilizce oluşturmak için Türkçe başlık, açıklama ve kategori doldurulmalıdır.')
        return
      }

      try {
        setTranslatingEnglish(true)
        setTranslationError('')

        const englishTranslation = await generateEnglishProjectTranslation({
          title: turkishTranslation.title,
          description: turkishTranslation.description,
          category: turkishTranslation.category,
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
                  title: englishTranslation.title || '',
                  description: englishTranslation.description || '',
                  category: englishTranslation.category || '',
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
                title: englishTranslation.title || '',
                description: englishTranslation.description || '',
                category: englishTranslation.category || '',
              },
            ],
          }
        })
      } catch (err) {
        setTranslationError(err.message || 'İngilizce içerik oluşturulamadı.')
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

  function getStatusLabel(languageCode) {
    const selectedStatus = STATUS_OPTIONS.find(
      (status) => status.key === formData.statusKey
    )

    if (!selectedStatus) {
      return STATUS_OPTIONS[0].tr
    }

    if (languageCode === 'en') {
      return selectedStatus.en
    }

    return selectedStatus.tr
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      translations: formData.translations
        .map((translation) => {
          const languageCode = translation.languageCode.trim().toLowerCase()

          return {
            languageCode,
            title: translation.title.trim(),
            description: translation.description.trim(),
            category: translation.category.trim(),
            status: getStatusLabel(languageCode),
          }
        })
        .filter(
          (translation) =>
            translation.languageCode &&
            translation.title &&
            translation.description &&
            translation.category &&
            translation.status
        ),
      techStack: formData.techStackText
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean),
      githubUrl: formData.githubUrl.trim() || null,
      liveUrl: formData.liveUrl.trim() || null,

      // Edit yaparken mevcut kapak görselini silmemek için koruyoruz.
      imageUrl: formData.imageUrl || null,

      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
      displayOrder: Number(formData.displayOrder),
    }

    await onSubmit(payload)

    if (!isEditMode) {
      setFormData(initialFormData)
    }
  }

  function handleClose() {
    setFormData(initialFormData)
    setTranslationError('')
    setTranslatingEnglish(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/80 px-4 py-8 backdrop-blur-sm">
      <div
  onWheel={(event) => event.stopPropagation()}
  className="max-h-[90vh] w-full max-w-6xl overscroll-contain overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl"
>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-300">Okan Portfolio CMS</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">
              {isEditMode ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Ana içerik Türkçe girilir. İngilizce içerik otomatik doldurulabilir veya sonradan düzenlenebilir.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-red-400 hover:text-red-300"
          >
            Kapat
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-5">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-100">
                Genel Proje Bilgileri
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Bu alanlar dile bağlı değildir; projenin genel ayarlarını temsil eder.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Proje Durumu"
                name="statusKey"
                value={formData.statusKey}
                onChange={handleFieldChange}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.key} value={status.key}>
                    {status.tr}
                  </option>
                ))}
              </Select>

              <Input
                label="Sıralama"
                name="displayOrder"
                type="number"
                min="0"
                max="9999"
                value={formData.displayOrder}
                onChange={handleFieldChange}
              />
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Durum tek seçilir; sistem bunu Türkçe ve İngilizce karşılığıyla kaydeder.
            </p>

            <div className="mt-5">
              <Input
                label="Teknolojiler"
                name="techStackText"
                value={formData.techStackText}
                onChange={handleFieldChange}
                placeholder="React, Tailwind CSS, ASP.NET Core, MSSQL"
                required
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input
                label="GitHub URL"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleFieldChange}
                placeholder="https://github.com/..."
              />

              <Input
                label="Canlı Demo URL"
                name="liveUrl"
                value={formData.liveUrl}
                onChange={handleFieldChange}
                placeholder="Boş bırakılabilir"
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Checkbox
                label="Öne çıkan proje"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleFieldChange}
              />

              <Checkbox
                label="Aktif proje"
                name="isActive"
                checked={formData.isActive}
                onChange={handleFieldChange}
              />
            </div>

            
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">
                  Dil İçerikleri
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Varsayılan dil Türkçedir. Gerekirse İngilizce içerik eklenebilir.
                </p>
              </div>

              {translationError && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {translationError}
                </div>
              )}

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
                      Bu blok tek bir dilin proje içeriğini temsil eder.
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
                    label="Başlık"
                    value={translation.title}
                    onChange={(event) =>
                      handleTranslationChange(index, 'title', event.target.value)
                    }
                    placeholder="Portföy CMS"
                    required
                  />

                  <Input
                    label="Kategori"
                    value={translation.category}
                    onChange={(event) =>
                      handleTranslationChange(index, 'category', event.target.value)
                    }
                    placeholder="Full Stack Web"
                    required
                  />
                </div>

                <div className="mt-4">
                  <Textarea
                    label="Açıklama"
                    value={translation.description}
                    onChange={(event) =>
                      handleTranslationChange(index, 'description', event.target.value)
                    }
                    required
                  />
                </div>
              </div>
            ))}
          </section>

          

          <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
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
                  : 'Projeyi Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function mapProjectToFormData(project) {
  const translations =
    project.translations?.length > 0
      ? project.translations.map((translation) => ({
          languageCode: translation.languageCode || '',
          title: translation.title || '',
          description: translation.description || '',
          category: translation.category || '',
        }))
      : buildFallbackTranslations(project)

  return {
    translations,
    statusKey: getStatusKeyFromProject(project),
    techStackText: project.techStack?.join(', ') || '',
    githubUrl: project.githubUrl || '',
    liveUrl: project.liveUrl || '',
    imageUrl: project.imageUrl || null,
    isFeatured: Boolean(project.isFeatured),
    isActive: Boolean(project.isActive),
    displayOrder: project.displayOrder ?? 1,
  }
}

function buildFallbackTranslations(project) {
  const translations = []

  if (project.titleTr || project.descriptionTr || project.categoryTr) {
    translations.push({
      languageCode: 'tr',
      title: project.titleTr || '',
      description: project.descriptionTr || '',
      category: project.categoryTr || '',
    })
  }

  if (project.titleEn || project.descriptionEn || project.categoryEn) {
    translations.push({
      languageCode: 'en',
      title: project.titleEn || '',
      description: project.descriptionEn || '',
      category: project.categoryEn || '',
    })
  }

  if (translations.length === 0) {
    return initialFormData.translations
  }

  return translations
}

function getStatusKeyFromProject(project) {
  const statusText = project.statusTr || project.statusEn || ''

  const matchedStatus = STATUS_OPTIONS.find(
    (status) => status.tr === statusText || status.en === statusText
  )

  return matchedStatus?.key || 'in_progress'
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

function Select({ label, name, value, onChange, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
      >
        {children}
      </select>
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

export default ProjectFormModal