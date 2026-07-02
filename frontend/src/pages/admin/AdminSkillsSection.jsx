import { useEffect, useState } from 'react'
import {
  createSkillGroup,
  deleteSkillGroup,
  getAdminSkills,
  updateSkillGroup,
  generateEnglishSkillTranslation,
} from '../../services/skillsService'

function createEmptyGroup(displayOrder = 1) {
  return {
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
    skills: [],
  }
}

function createEmptySkill(displayOrder = 1) {
  return {
    localId: `${Date.now()}-${Math.random()}`,
    id: 0,
    name: '',
    isActive: true,
    displayOrder,
  }
}

function AdminSkillsSection() {
  const [groups, setGroups] = useState([])
  const [form, setForm] = useState(createEmptyGroup())
  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showEnglishFields, setShowEnglishFields] = useState(false)
  const [translating, setTranslating] = useState(false)

  useEffect(() => {
    loadSkills()
  }, [])

  async function loadSkills() {
    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')

      const data = await getAdminSkills()
      setGroups(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function getNextDisplayOrder() {
    if (groups.length === 0) {
      return 1
    }

    return Math.max(...groups.map((group) => Number(group.displayOrder) || 0)) + 1
  }

  function normalizeGroup(group) {
    const trTranslation =
      group.translations?.find((item) => item.languageCode === 'tr') || {
        languageCode: 'tr',
        title: '',
        description: '',
      }

    const enTranslation =
      group.translations?.find((item) => item.languageCode === 'en') || {
        languageCode: 'en',
        title: '',
        description: '',
      }

    return {
      id: group.id,
      isActive: group.isActive,
      displayOrder: group.displayOrder,
      translations: {
        tr: trTranslation,
        en: enTranslation,
      },
      skills:
        group.skills
          ?.sort((a, b) => a.displayOrder - b.displayOrder)
          ?.map((skill) => ({
            localId: `existing-${skill.id}`,
            id: skill.id,
            name: skill.name,
            isActive: skill.isActive,
            displayOrder: skill.displayOrder,
          })) || [],
    }
  }

  function resetForm() {
    setEditingId(null)
    setForm(createEmptyGroup(getNextDisplayOrder()))
    setShowEnglishFields(false)
    setError('')
    setSuccessMessage('')
  }

  function handleEdit(group) {
    const normalizedGroup = normalizeGroup(group)

    setEditingId(group.id)
    setForm(normalizedGroup)
    setShowEnglishFields(hasEnglishContent(normalizedGroup))
    setError('')
    setSuccessMessage('')
  }

  function hasEnglishContent(group) {
    const en = group.translations.en

    return Boolean(en.title?.trim() || en.description?.trim())
  }

  function handleTranslationChange(languageCode, field, value) {
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

  function handleGroupFieldChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: field === 'displayOrder' ? Number(value) : value,
    }))
  }

  function handleAddSkill() {
    const nextOrder =
      form.skills.length > 0
        ? Math.max(...form.skills.map((skill) => Number(skill.displayOrder) || 0)) + 1
        : 1

    setForm((current) => ({
      ...current,
      skills: [...current.skills, createEmptySkill(nextOrder)],
    }))
  }

  function handleSkillChange(localId, field, value) {
    setForm((current) => ({
      ...current,
      skills: current.skills.map((skill) =>
        skill.localId === localId
          ? {
              ...skill,
              [field]: field === 'displayOrder' ? Number(value) : value,
            }
          : skill
      ),
    }))
  }

  function handleRemoveSkill(localId) {
    setForm((current) => ({
      ...current,
      skills: current.skills.filter((skill) => skill.localId !== localId),
    }))
  }

  function buildPayload() {
    return {
      isActive: form.isActive,
      displayOrder: Number(form.displayOrder) || 1,
      translations: [
        {
          languageCode: 'tr',
          title: form.translations.tr.title,
          description: form.translations.tr.description,
        },
        {
          languageCode: 'en',
          title: form.translations.en.title,
          description: form.translations.en.description,
        },
      ],
      skills: form.skills
        .filter((skill) => skill.name.trim())
        .map((skill, index) => ({
          id: skill.id || 0,
          name: skill.name,
          isActive: skill.isActive,
          displayOrder: Number(skill.displayOrder) || index + 1,
        })),
    }
  }

  async function handleGenerateEnglish() {
    try {
      setTranslating(true)
      setError('')
      setSuccessMessage('')

      const result = await generateEnglishSkillTranslation({
        title: form.translations.tr.title,
        description: form.translations.tr.description,
      })

      setForm((current) => ({
        ...current,
        translations: {
          ...current.translations,
          en: {
            languageCode: 'en',
            title: result.title || '',
            description: result.description || '',
          },
        },
      }))

      setShowEnglishFields(true)
      setSuccessMessage('İngilizce skill grubu içeriği otomatik oluşturuldu. Kaydetmeyi unutma.')
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

      const payload = buildPayload()

      if (editingId) {
        await updateSkillGroup(editingId, payload)
        setSuccessMessage('Skill grubu başarıyla güncellendi.')
      } else {
        await createSkillGroup(payload)
        setSuccessMessage('Skill grubu başarıyla oluşturuldu.')
      }

      await loadSkills()
      setEditingId(null)
      setForm(createEmptyGroup(getNextDisplayOrder()))
      setShowEnglishFields(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(group) {
    const title =
      group.translations?.find((item) => item.languageCode === 'tr')?.title ||
      'Bu skill grubu'

    const confirmed = window.confirm(`"${title}" silinsin mi?`)

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccessMessage('')

      await deleteSkillGroup(group.id)
      await loadSkills()

      if (editingId === group.id) {
        resetForm()
      }

      setSuccessMessage('Skill grubu silindi.')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl">
        <p className="text-sm text-slate-300">Teknik yetenekler yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">
              Teknik Yetenekler CMS
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Frontend, Backend, Veritabanı gibi skill gruplarını ve teknoloji etiketlerini yönet.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="rounded-2xl border border-cyan-400/40 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
          >
            Yeni Grup
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/40 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                {editingId ? 'Skill Grubunu Düzenle' : 'Yeni Skill Grubu'}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Türkçe içeriği gir, İngilizce alanı gerekirse açıp düzenle.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    handleGroupFieldChange('isActive', event.target.checked)
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
                  value={form.displayOrder}
                  onChange={(event) =>
                    handleGroupFieldChange('displayOrder', event.target.value)
                  }
                  className="w-20 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                />
              </label>

              <button
                type="button"
                onClick={handleGenerateEnglish}
                disabled={translating}
                className="rounded-2xl border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {translating ? 'Çevriliyor...' : 'İngilizceyi Otomatik Oluştur'}
              </button>

              <button
                type="button"
                onClick={() => setShowEnglishFields(true)}
                className="rounded-2xl border border-cyan-400/40 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
              >
                + İngilizce Ekle
              </button>
            </div>
          </div>

          <div className={`grid gap-5 ${showEnglishFields ? 'lg:grid-cols-2' : ''}`}>
            <TranslationFields
              title="Türkçe İçerik"
              data={form.translations.tr}
              languageCode="tr"
              onChange={handleTranslationChange}
            />

            {showEnglishFields && (
              <TranslationFields
                title="İngilizce İçerik"
                data={form.translations.en}
                languageCode="en"
                onChange={handleTranslationChange}
              />
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-100">
                  Skill Etiketleri
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  React, ASP.NET Core, PostgreSQL gibi teknolojileri buradan ekle.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSkill}
                className="rounded-2xl border border-cyan-400/40 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
              >
                Yeni Skill Ekle
              </button>
            </div>

            {form.skills.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-400">
                Henüz skill eklenmedi.
              </div>
            )}

            <div className="space-y-3">
              {form.skills.map((skill) => (
                <div
                  key={skill.localId}
                  className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_120px_auto_auto]"
                >
                  <input
                    placeholder="Skill adı"
                    value={skill.name}
                    onChange={(event) =>
                      handleSkillChange(skill.localId, 'name', event.target.value)
                    }
                    className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                  />

                  <input
                    type="number"
                    min="1"
                    value={skill.displayOrder}
                    onChange={(event) =>
                      handleSkillChange(skill.localId, 'displayOrder', event.target.value)
                    }
                    className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                  />

                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={skill.isActive}
                      onChange={(event) =>
                        handleSkillChange(skill.localId, 'isActive', event.target.checked)
                      }
                      className="h-4 w-4 accent-cyan-400"
                    />
                    Aktif
                  </label>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.localId)}
                    className="rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                  >
                    Sil
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
              >
                Vazgeç
              </button>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? 'Kaydediliyor...'
                : editingId
                  ? 'Skill Grubunu Güncelle'
                  : 'Skill Grubunu Kaydet'}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
        <h3 className="mb-5 text-xl font-semibold text-slate-100">
          Mevcut Skill Grupları
        </h3>

        {groups.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-sm text-slate-400">
            Henüz skill grubu yok.
          </div>
        )}

        <div className="space-y-3">
          {groups.map((group) => {
            const tr =
              group.translations?.find((item) => item.languageCode === 'tr') ||
              {}

            return (
              <div
                key={group.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="font-semibold text-slate-100">
                      {tr.title || 'Başlıksız Grup'}
                    </h4>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        group.isActive
                          ? 'bg-emerald-400/10 text-emerald-300'
                          : 'bg-red-400/10 text-red-300'
                      }`}
                    >
                      {group.isActive ? 'Aktif' : 'Pasif'}
                    </span>

                    <span className="rounded-full bg-slate-700/60 px-3 py-1 text-xs text-slate-300">
                      Sıra: {group.displayOrder}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {tr.description || 'Açıklama yok'}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.skills?.map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(group)}
                    className="rounded-xl border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/10"
                  >
                    Düzenle
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(group)}
                    className="rounded-xl border border-red-400/30 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                  >
                    Sil
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TranslationFields({ title, data, languageCode, onChange }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
      <h3 className="mb-5 text-lg font-semibold text-cyan-300">
        {title}
      </h3>

      <div className="space-y-4">
        <InputField
          label="Başlık"
          value={data.title}
          onChange={(value) => onChange(languageCode, 'title', value)}
        />

        <TextareaField
          label="Açıklama"
          value={data.description}
          rows={4}
          onChange={(value) => onChange(languageCode, 'description', value)}
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

export default AdminSkillsSection