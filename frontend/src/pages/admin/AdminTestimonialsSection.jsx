import { useEffect, useState } from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'
import {
  deleteTestimonial,
  generateEnglishTestimonialTranslation,
  getAdminTestimonials,
  updateTestimonial,
} from '../../services/testimonialService'

const emptyForm = {
  fullName: '',
  title: '',
  company: '',
  rating: 5,
  isApproved: false,
  isActive: true,
  displayOrder: 1,
  commentTr: '',
  commentEn: '',
}

function AdminTestimonialsSection() {
  const [items, setItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [translating, setTranslating] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    try {
      setLoading(true)
      setError('')

      const data = await getAdminTestimonials()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(item) {
    setEditingItem(item)

    setFormData({
      fullName: item.fullName || '',
      title: item.title || '',
      company: item.company || '',
      rating: item.rating || 5,
      isApproved: Boolean(item.isApproved),
      isActive: item.isActive !== false,
      displayOrder: item.displayOrder || 1,
      commentTr: getComment(item, 'tr'),
      commentEn: getComment(item, 'en'),
    })

    setError('')
    setSuccess('')
  }

  function handleCancelEdit() {
    setEditingItem(null)
    setFormData(emptyForm)
    setError('')
    setSuccess('')
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleGenerateEnglishComment() {
  if (!formData.commentTr.trim()) {
    setError('İngilizce oluşturmak için önce Türkçe yorum alanı dolu olmalıdır.')
    return
  }

  try {
    setTranslating(true)
    setError('')
    setSuccess('')

    const result = await generateEnglishTestimonialTranslation({
      comment: formData.commentTr.trim(),
      title: formData.title.trim(),
      company: formData.company.trim(),
    })

    setFormData((prev) => ({
      ...prev,
      title: result.title || prev.title,
      company: result.company || prev.company,
      commentEn: result.comment || '',
    }))

    setSuccess('İngilizce yorum otomatik oluşturuldu. Kaydetmeden önce kontrol edebilirsin.')
  } catch (err) {
    setError(err.message)
  } finally {
    setTranslating(false)
  }
}

  async function handleSubmit(event) {
    event.preventDefault()

    if (!editingItem) {
      return
    }

    if (!formData.fullName.trim() || !formData.commentTr.trim()) {
      setError('Ad soyad ve Türkçe yorum alanı zorunludur.')
      return
    }

    const translations = [
      {
        languageCode: 'tr',
        comment: formData.commentTr.trim(),
      },
    ]

    if (formData.commentEn.trim()) {
      translations.push({
        languageCode: 'en',
        comment: formData.commentEn.trim(),
      })
    }

    const payload = {
      fullName: formData.fullName.trim(),
      title: formData.title.trim(),
      company: formData.company.trim(),
      rating: Number(formData.rating),
      isApproved: Boolean(formData.isApproved),
      isActive: Boolean(formData.isActive),
      displayOrder: Number(formData.displayOrder) || 1,
      translations,
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      await updateTestimonial(editingItem.id, payload)

      setSuccess('Yorum güncellendi.')
      setEditingItem(null)
      setFormData(emptyForm)
      await loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleApprove(item) {
    await quickUpdate(item, {
      isApproved: true,
      isActive: true,
    }, 'Yorum onaylandı ve yayına alındı.')
  }

  async function handleToggleActive(item) {
    await quickUpdate(item, {
      isActive: !item.isActive,
    }, item.isActive ? 'Yorum pasif yapıldı.' : 'Yorum aktif yapıldı.')
  }

  async function quickUpdate(item, overrides, message) {
    const payload = createUpdatePayload(item, overrides)

    try {
      setError('')
      setSuccess('')

      await updateTestimonial(item.id, payload)

      setSuccess(message)
      await loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `"${item.fullName}" yorumunu silmek istiyor musun?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      await deleteTestimonial(item.id)
      setSuccess('Yorum silindi.')
      await loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  const pendingCount = items.filter((item) => !item.isApproved).length
  const approvedCount = items.filter((item) => item.isApproved && item.isActive).length

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Testimonials CMS
          </p>

          <h2 className="mt-3 text-2xl font-semibold text-slate-100">
            Yorumlar
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
            Ziyaretçilerin bıraktığı yorumlar burada beklemeye düşer. Admin onaylamadan public sitede görünmez.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <span className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 text-yellow-200">
            Bekleyen: {pendingCount}
          </span>

          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-emerald-200">
            Yayında: {approvedCount}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          {success}
        </div>
      )}

      {editingItem && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 rounded-3xl border border-cyan-300/20 bg-slate-950/50 p-5"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-100">
                Yorumu Düzenle
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Onay, aktiflik, sıra ve çeviri alanlarını buradan yönetebilirsin.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-red-400 hover:text-red-300"
            >
              Vazgeç
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Ad Soyad"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

            <Field
              label="Ünvan"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Örn: Software Developer"
            />

            <Field
              label="Şirket"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Opsiyonel"
            />

            <RatingStarsInput
              label="Puan"
              value={Number(formData.rating)}
              onChange={(rating) =>
                setFormData((prev) => ({
                  ...prev,
                  rating,
                }))
              }
            />

            <Field
              label="Sıra"
              name="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={handleChange}
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
          <TextArea
            label="Yorum TR"
            name="commentTr"
            value={formData.commentTr}
            onChange={handleChange}
          />

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <label className="block text-sm text-slate-300">
                Yorum EN
              </label>

              <button
                type="button"
                onClick={handleGenerateEnglishComment}
                disabled={translating}
                className="rounded-xl border border-cyan-400/30 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {translating ? 'Oluşturuluyor...' : 'İngilizceyi Otomatik Oluştur'}
              </button>
            </div>

            <textarea
              name="commentEn"
              value={formData.commentEn}
              onChange={handleChange}
              placeholder="İngilizce karşılığı opsiyonel"
              rows={5}
              className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>
        </div>

          <div className="mt-5 flex flex-wrap gap-5">
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                name="isApproved"
                type="checkbox"
                checked={formData.isApproved}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/20 bg-slate-950"
              />
              Onaylandı
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-white/20 bg-slate-950"
              />
              Aktif
            </label>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Yorumu Güncelle'}
            </button>
          </div>
        </form>
      )}

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
          Yorumlar yükleniyor...
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
          Henüz yorum bulunmuyor.
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-white/10 bg-slate-950/40 p-5"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        item.isApproved
                          ? 'bg-emerald-400/10 text-emerald-300'
                          : 'bg-yellow-400/10 text-yellow-300'
                      }`}
                    >
                      {item.isApproved ? 'Onaylandı' : 'Bekliyor'}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        item.isActive
                          ? 'bg-cyan-400/10 text-cyan-300'
                          : 'bg-red-400/10 text-red-300'
                      }`}
                    >
                      {item.isActive ? 'Aktif' : 'Pasif'}
                    </span>

                    <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-300">
                      {item.rating} / 5
                    </span>

                    <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-300">
                      Sıra: {item.displayOrder}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-100">
                    {item.fullName}
                  </h3>

                  {(item.title || item.company) && (
                    <p className="mt-1 text-sm text-slate-500">
                      {[item.title, item.company].filter(Boolean).join(' · ')}
                    </p>
                  )}

                  <p className="mt-4 max-w-4xl leading-7 text-slate-300">
                    {getComment(item, 'tr')}
                  </p>

                  {getComment(item, 'en') && (
                    <p className="mt-3 max-w-4xl leading-7 text-slate-500">
                      EN: {getComment(item, 'en')}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                  {!item.isApproved && (
                    <button
                      type="button"
                      onClick={() => handleApprove(item)}
                      className="rounded-xl border border-emerald-400/30 px-3 py-2 text-xs text-emerald-300 transition hover:bg-emerald-500/10"
                    >
                      Onayla
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
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

                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="rounded-xl border border-red-400/30 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/10"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
      />
    </div>
  )
}

function RatingStarsInput({ label, value, onChange }) {
  const [hoverValue, setHoverValue] = useState(0)

  const activeValue = hoverValue || value || 0

  return (
    <div>
      <label className="mb-3 block text-sm text-slate-300">
        {label}
      </label>

      <div className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((starValue) => {
            const isActive = starValue <= activeValue

            return (
              <button
                key={starValue}
                type="button"
                onMouseEnter={() => setHoverValue(starValue)}
                onMouseLeave={() => setHoverValue(0)}
                onClick={() => onChange(starValue)}
                className="group transition hover:scale-110"
                aria-label={`${starValue} yıldız`}
              >
                {isActive ? (
                  <FaStar className="text-2xl text-yellow-400 transition group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.45)]" />
                ) : (
                  <FaRegStar className="text-2xl text-slate-500 transition group-hover:text-yellow-300" />
                )}
              </button>
            )
          })}

          <span className="ml-3 text-sm font-medium text-slate-400">
            {activeValue}/5
          </span>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Puanı değiştirmek için yıldızların üzerine gel ve tıkla.
        </p>
      </div>
    </div>
  )
}

function TextArea({ label, name, value, onChange, placeholder = '' }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
      />
    </div>
  )
}

function getComment(item, languageCode) {
  return (
    item.translations?.find((translation) => translation.languageCode === languageCode)?.comment ||
    ''
  )
}

function createUpdatePayload(item, overrides = {}) {
  const translations =
    item.translations?.length > 0
      ? item.translations
      : [
          {
            languageCode: 'tr',
            comment: 'Yorum metni bulunamadı.',
          },
        ]

  return {
    fullName: item.fullName,
    title: item.title || '',
    company: item.company || '',
    rating: item.rating,
    isApproved: item.isApproved,
    isActive: item.isActive,
    displayOrder: item.displayOrder || 1,
    translations,
    ...overrides,
  }
}

export default AdminTestimonialsSection