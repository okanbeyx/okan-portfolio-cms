import { useEffect, useState } from 'react'
import {
  createContactItem,
  deleteContactItem,
  getAdminContactItems,
  updateContactItem,
} from '../../services/contactService'

function createEmptyForm(displayOrder = 1) {
  return {
    type: 'gmail',
    label: '',
    value: '',
    url: '',
    displayOrder,
    isActive: true,
  }
}

function getNextDisplayOrder(items) {
  if (!items || items.length === 0) {
    return 1
  }

  const maxOrder = Math.max(
    ...items.map((item) => Number(item.displayOrder) || 0)
  )

  return maxOrder + 1
}

const contactTypes = [
  { value: 'gmail', label: 'Gmail' },
  { value: 'email', label: 'E-posta' },
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'website', label: 'Web Sitesi' },
  { value: 'phone', label: 'Telefon' },
  { value: 'location', label: 'Konum' },
  { value: 'custom', label: 'Özel Link' },
]

function AdminContactSection() {
  const [items, setItems] = useState([])
  const [formData, setFormData] = useState(createEmptyForm())
  const [editingItem, setEditingItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    try {
      setLoading(true)
      setError('')

      const data = await getAdminContactItems()
      const safeData = Array.isArray(data) ? data : []

      setItems(safeData)

      if (!editingItem) {
        setFormData((prev) => ({
          ...prev,
          displayOrder: getNextDisplayOrder(safeData),
        }))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleEdit(item) {
    setEditingItem(item)

    setFormData({
      type: item.type || 'custom',
      label: item.label || '',
      value: item.value || '',
      url: item.url || '',
      displayOrder: item.displayOrder ?? 1,
      isActive: item.isActive !== false,
    })

    setSuccess('')
    setError('')
  }

  function handleCancelEdit() {
  setEditingItem(null)
  setFormData(createEmptyForm(getNextDisplayOrder(items)))
  setSuccess('')
  setError('')
}

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formData.label.trim() || !formData.value.trim()) {
      setError('Başlık ve görünen bilgi alanları zorunludur.')
      return
    }

    const value = formData.value.trim()
    const autoUrl = createAutoUrl(formData.type, value)

    const payload = {
      type: formData.type,
      label: formData.label.trim(),
      value,
      url: formData.url.trim() || autoUrl,
      iconKey: formData.type,
      displayOrder: Number(formData.displayOrder) || 1,
      isActive: Boolean(formData.isActive),
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      if (editingItem) {
        await updateContactItem(editingItem.id, payload)
        setSuccess('İletişim bilgisi güncellendi.')
      } else {
        await createContactItem(payload)
        setSuccess('Yeni iletişim bilgisi eklendi.')
      }

      setEditingItem(null)
      await loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(item) {
    try {
      setError('')
      setSuccess('')

      await updateContactItem(item.id, {
        type: item.type,
        label: item.label,
        value: item.value,
        url: item.url,
        iconKey: item.iconKey || item.type,
        displayOrder: item.displayOrder,
        isActive: !item.isActive,
      })

      setSuccess(
        !item.isActive
          ? 'İletişim bilgisi aktif hale getirildi.'
          : 'İletişim bilgisi pasif hale getirildi.'
      )

      await loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `"${item.label}" iletişim bilgisini silmek istiyor musun?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      await deleteContactItem(item.id)
      setSuccess('İletişim bilgisi silindi.')
      await loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Contact CMS
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-slate-100">
          İletişim Bilgileri
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
          Gmail, GitHub, LinkedIn, Instagram ve diğer iletişim kartlarını buradan yönetebilirsin.
          Tür seçimine göre ikon ve link davranışı otomatik hazırlanır.
        </p>
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

      <form
        onSubmit={handleSubmit}
        className="mb-8 rounded-3xl border border-white/10 bg-slate-950/40 p-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Tür / Platform
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            >
              {contactTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Kart Başlığı
            </label>

            <input
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="Örn: Gmail"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Görünen Bilgi
            </label>

            <input
              name="value"
              value={formData.value}
              onChange={handleChange}
              placeholder="Örn: x@mail.com"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Link / URL
            </label>

            <input
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="Boş bırakırsan otomatik oluşturulur"
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Gmail seçiliyse boş bırakabilirsin. Tıklanınca Gmail açılır ve alıcı kısmına yazdığın e-posta gelir.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Sıra
            </label>

            <input
              name="displayOrder"
              type="number"
              value={formData.displayOrder}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            />
          </div>
        </div>

        <label className="mt-5 flex items-center gap-3 text-sm text-slate-300">
          <input
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-white/20 bg-slate-950"
          />
          Aktif olarak göster
        </label>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? 'Kaydediliyor...'
              : editingItem
                ? 'Güncelle'
                : 'Yeni İletişim Bilgisi Ekle'}
          </button>

          {editingItem && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Vazgeç
            </button>
          )}
        </div>
      </form>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
          İletişim bilgileri yükleniyor...
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-300">
          Henüz iletişim bilgisi bulunmuyor.
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Başlık</th>
                  <th className="px-5 py-4">Görünen Bilgi</th>
                  <th className="px-5 py-4">Tür</th>
                  <th className="px-5 py-4">Durum</th>
                  <th className="px-5 py-4">Sıra</th>
                  <th className="px-5 py-4 text-right">İşlem</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {items
                  .slice()
                  .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                  .map((item) => (
                    <tr key={item.id} className="bg-slate-950/40">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-100">
                          {item.label}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {item.url || 'Otomatik link'}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {item.value}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {item.type}
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
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function createAutoUrl(type, value) {
  const cleanValue = value.trim()

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

  if (type === 'location') {
    return '#'
  }

  return cleanValue.startsWith('http') ? cleanValue : '#'
}

export default AdminContactSection