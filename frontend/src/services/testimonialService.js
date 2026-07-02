import { getToken } from './authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

function getAuthHeaders() {
  const token = getToken()

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'İşlem sırasında bir hata oluştu.')
  }

  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function getTestimonials() {
  const response = await fetch(`${API_BASE_URL}/testimonials`)

  if (!response.ok) {
    throw new Error('Yorumlar alınırken bir hata oluştu.')
  }

  return response.json()
}

export async function getAdminTestimonials() {
  return request('/testimonials/admin')
}

export async function createPublicTestimonial(data) {
  return request('/testimonials', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateTestimonial(id, data) {
  return request(`/testimonials/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteTestimonial(id) {
  return request(`/testimonials/${id}`, {
    method: 'DELETE',
  })
}

export async function generateEnglishTestimonialTranslation(data) {
  return request('/translation/testimonial-to-en', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}