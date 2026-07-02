import { useEffect, useState } from 'react'
import {
  deleteProjectImage,
  getProjectImages,
  setProjectCoverImage,
  uploadProjectImage,
} from '../../services/projectService'

function ProjectImagesModal({ isOpen, project, onClose, onChanged }) {
  const [images, setImages] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [altText, setAltText] = useState('')
  const [isCover, setIsCover] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && project?.id) {
      loadImages()
    }
  }, [isOpen, project?.id])
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

  if (!isOpen || !project) {
    return null
  }

  async function loadImages() {
    try {
      setLoading(true)
      setError('')
      const data = await getProjectImages(project.id)
      setImages(data)
    } catch (err) {
      setError(err.message || 'Görseller alınamadı.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(event) {
    event.preventDefault()

    if (!selectedFile) {
      setError('Lütfen bir görsel dosyası seç.')
      return
    }

    try {
      setUploading(true)
      setError('')

      await uploadProjectImage(project.id, {
        file: selectedFile,
        altText,
        isCover,
      })

      setSelectedFile(null)
      setAltText('')
      setIsCover(false)

      await loadImages()

      if (onChanged) {
        onChanged()
      }
    } catch (err) {
      setError(err.message || 'Görsel yüklenemedi.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSetCover(imageId) {
    try {
      setError('')
      await setProjectCoverImage(project.id, imageId)
      await loadImages()

      if (onChanged) {
        onChanged()
      }
    } catch (err) {
      setError(err.message || 'Kapak görseli seçilemedi.')
    }
  }

  async function handleDelete(imageId) {
    const confirmed = window.confirm('Bu görsel silinsin mi?')

    if (!confirmed) {
      return
    }

    try {
      setError('')
      await deleteProjectImage(project.id, imageId)
      await loadImages()

      if (onChanged) {
        onChanged()
      }
    } catch (err) {
      setError(err.message || 'Görsel silinemedi.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-950/80 px-4 py-8 backdrop-blur-sm">
      <div
  onWheel={(event) => event.stopPropagation()}
  className="max-h-[90vh] w-full max-w-6xl overscroll-contain overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl"
>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-300">Proje Görselleri</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-100">
              {getProjectTitle(project)}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Birden fazla görsel yükleyebilir, içlerinden birini ana sayfa kapak görseli yapabilirsin.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-red-400 hover:text-red-300"
          >
            Kapat
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={handleUpload}
          className="mb-6 rounded-3xl border border-white/10 bg-slate-900/40 p-5"
        >
          <h3 className="text-lg font-semibold text-slate-100">
            Yeni Görsel Yükle
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Görsel Dosyası
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Alt Metin
              </span>
              <input
                type="text"
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
                placeholder="Ana sayfa proje görseli"
                className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="flex min-h-[48px] items-center gap-3 self-end rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={isCover}
                onChange={(event) => setIsCover(event.target.checked)}
                className="h-4 w-4 accent-cyan-400"
              />
              Kapak görseli yap
            </label>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? 'Yükleniyor...' : 'Görseli Yükle'}
            </button>
          </div>
        </form>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">
              Yüklü Görseller
            </h3>

            <span className="text-sm text-slate-500">
              {images.length} görsel
            </span>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 text-center text-slate-400">
              Görseller yükleniyor...
            </div>
          ) : images.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 text-center text-slate-400">
              Henüz görsel yüklenmedi.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-900">
                    <img
                      src={image.imageUrl}
                      alt={image.altText || 'Proje görseli'}
                      className="h-full w-full object-cover"
                    />

                    {image.isCover && (
                      <span className="absolute left-3 top-3 rounded-full bg-cyan-400 px-3 py-1 text-xs font-semibold text-slate-950">
                        Kapak
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <p className="line-clamp-1 text-sm text-slate-300">
                      {image.altText || image.fileName}
                    </p>

                    <div className="flex gap-2">
                      {!image.isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(image.id)}
                          className="flex-1 rounded-xl border border-cyan-400/40 px-3 py-2 text-xs text-cyan-300 transition hover:bg-cyan-400/10"
                        >
                          Kapak Yap
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(image.id)}
                        className="flex-1 rounded-xl border border-red-400/30 px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/10"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function getProjectTitle(project) {
  const trTranslation = project.translations?.find(
    (translation) => translation.languageCode === 'tr'
  )

  if (trTranslation?.title) {
    return trTranslation.title
  }

  return project.titleTr || project.titleEn || `Proje #${project.id}`
}

export default ProjectImagesModal