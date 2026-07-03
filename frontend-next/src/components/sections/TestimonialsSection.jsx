import { useEffect, useMemo, useRef, useState } from 'react'
import { FaStar, FaRegStar } from 'react-icons/fa'
import {
  createPublicTestimonial,
  getTestimonials,
} from '../../services/testimonialService'
import GlassCard from '../ui/GlassCard'
import TestimonialCard from '../ui/TestimonialCard'


const emptyForm = {
  fullName: '',
  title: '',
  company: '',
  rating: 5,
  comment: '',
}

function TestimonialsSection({ t, language }) {
  const [items, setItems] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const carouselRef = useRef(null)
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  })
  const pauseAutoScrollRef = useRef(false)

  useEffect(() => {
    loadTestimonials()
  }, [])

  async function loadTestimonials() {
    try {
      setLoading(true)
      setError('')

      const data = await getTestimonials()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formData.fullName.trim() || !formData.comment.trim()) {
      setError(
        language === 'tr'
          ? 'Ad soyad ve yorum alanı zorunludur.'
          : 'Full name and comment are required.'
      )
      return
    }

    if (formData.comment.trim().length < 10) {
      setError(
        language === 'tr'
          ? 'Yorum en az 10 karakter olmalıdır.'
          : 'Comment must be at least 10 characters.'
      )
      return
    }

    try {
      setSending(true)
      setError('')
      setSuccess('')

      await createPublicTestimonial({
        fullName: formData.fullName.trim(),
        title: formData.title.trim(),
        company: formData.company.trim(),
        rating: Number(formData.rating),
        comment: formData.comment.trim(),
      })

      setFormData(emptyForm)
      setSuccess(
        language === 'tr'
          ? 'Yorumun alındı. Admin onayından sonra sitede görünecek.'
          : 'Your testimonial has been received. It will appear after admin approval.'
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const carouselItems = useMemo(() => {
    if (items.length <= 1) {
      return items
    }

    return [...items, ...items]
  }, [items])

  useEffect(() => {
    const carousel = carouselRef.current

    if (!carousel || items.length <= 1) {
      return
    }

    const interval = setInterval(() => {
      if (pauseAutoScrollRef.current || dragStateRef.current.isDragging) {
        return
      }

      carousel.scrollLeft += 1

      const halfScrollWidth = carousel.scrollWidth / 2

      if (carousel.scrollLeft >= halfScrollWidth) {
        carousel.scrollLeft = 0
      }
    }, 25)

    return () => clearInterval(interval)
  }, [items.length])

  function handlePointerDown(event) {
    const carousel = carouselRef.current

    if (!carousel) {
      return
    }
    pauseAutoScrollRef.current = true

    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: carousel.scrollLeft,
    }

    carousel.setPointerCapture?.(event.pointerId)
  }

  function handlePointerMove(event) {
    const carousel = carouselRef.current

    if (!carousel || !dragStateRef.current.isDragging) {
      return
    }

    event.preventDefault()

    const distance = event.clientX - dragStateRef.current.startX
    carousel.scrollLeft = dragStateRef.current.scrollLeft - distance
  }

  function handlePointerUp(event) {
    const carousel = carouselRef.current

    dragStateRef.current.isDragging = false
    pauseAutoScrollRef.current = false

    if (carousel) {
      carousel.releasePointerCapture?.(event.pointerId)
    }
    
  }

  return (
    <section id="testimonials" className="scroll-mt-28 px-6 py-24">
      <style>
        {`
          .testimonial-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
            {t.testimonials.label}
          </p>

          <h2 className="text-4xl font-bold text-slate-100 md:text-5xl">
            {t.testimonials.title}
          </h2>

          <p className="mt-5 leading-8 text-slate-400">
            {t.testimonials.description}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <GlassCard className="p-6">
            <h3 className="text-2xl font-semibold text-slate-100">
              {t.testimonials.formTitle}
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-400">
              {t.testimonials.formDescription}
            </p>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <Input
                label={t.testimonials.fullName}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />

              <Input
                label={t.testimonials.userTitle}
                name="title"
                value={formData.title}
                onChange={handleChange}
              />

              <Input
                label={t.testimonials.company}
                name="company"
                value={formData.company}
                onChange={handleChange}
              />

              <RatingStarsInput
                label={t.testimonials.rating}
                value={formData.rating}
                onChange={(rating) =>
                  setFormData((prev) => ({
                    ...prev,
                    rating,
                  }))
                }
              />

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  {t.testimonials.comment}
                </label>

                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm leading-7 text-slate-100 outline-none transition focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? t.testimonials.sending : t.testimonials.submit}
              </button>
            </form>
          </GlassCard>

          <div className="min-w-0">
            {loading && (
              <GlassCard className="p-6 text-slate-300">
                {language === 'tr' ? 'Yorumlar yükleniyor...' : 'Loading testimonials...'}
              </GlassCard>
            )}

            {!loading && items.length === 0 && (
              <GlassCard className="p-6 text-slate-300">
                {language === 'tr'
                  ? 'Henüz onaylanmış yorum bulunmuyor.'
                  : 'No approved testimonials yet.'}
              </GlassCard>
            )}

            {!loading && items.length > 0 && (
              <div className="relative rounded-3xl">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 rounded-l-3xl bg-gradient-to-r from-slate-950 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 rounded-r-3xl bg-gradient-to-l from-slate-950 to-transparent" />

                <div
                  ref={carouselRef}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  onMouseEnter={() => {
                    pauseAutoScrollRef.current = true
                  }}
                  onMouseLeave={() => {
                    pauseAutoScrollRef.current = false
                  }}
                  className="testimonial-scrollbar cursor-grab select-none overflow-x-auto rounded-3xl active:cursor-grabbing"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  <div className="flex w-max gap-4 py-1 pr-4">
                    {carouselItems.map((testimonial, index) => (
                      <TestimonialCard
                        key={`${testimonial.id}-${index}`}
                        testimonial={testimonial}
                        language={language}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}


function RatingStarsInput({ label, value, onChange }) {
  const [hoverValue, setHoverValue] = useState(0)

  const activeValue = hoverValue || value

  return (
    <div>
      <label className="mb-3 block text-sm text-slate-300">
        {label}
      </label>

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

        <span className="ml-2 text-sm font-medium text-slate-400">
          {activeValue || value}/5
        </span>
      </div>
    </div>
  )
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">
        {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
      />
    </div>
  )
}

export default TestimonialsSection