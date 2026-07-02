import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

function TestimonialCard({ testimonial, language }) {
  const comment = getComment(testimonial, language)
  const subtitle = [testimonial.title, testimonial.company].filter(Boolean).join(' · ')

  return (
    <article className="flex h-full min-h-[300px] w-[320px] max-w-[320px] flex-none flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl sm:w-[380px] sm:max-w-[380px] lg:w-[520px] lg:max-w-[520px]">
      <div className="mb-5 flex items-center gap-1 text-cyan-300">
        {renderStars(testimonial.rating)}
      </div>

      <p
        className="min-h-[120px] max-w-full whitespace-normal text-lg leading-8 text-slate-300"
        style={{
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        }}
      >
        “{comment}”
      </p>

      <div className="mt-6 border-t border-white/10 pt-5">
        <h3 className="font-semibold text-slate-100">
          {testimonial.fullName}
        </h3>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>
    </article>
  )
}

function getComment(testimonial, language) {
  const selected =
    testimonial.translations?.find((translation) => translation.languageCode === language) ||
    testimonial.translations?.find((translation) => translation.languageCode === 'tr') ||
    testimonial.translations?.[0]

  return selected?.comment || ''
}

function renderStars(rating) {
  const stars = []
  const safeRating = Number(rating) || 0

  for (let index = 1; index <= 5; index += 1) {
    if (safeRating >= index) {
      stars.push(<FaStar key={index} />)
    } else if (safeRating >= index - 0.5) {
      stars.push(<FaStarHalfAlt key={index} />)
    } else {
      stars.push(<FaRegStar key={index} />)
    }
  }

  return stars
}

export default TestimonialCard