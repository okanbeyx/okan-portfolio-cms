import { getToken } from './authService'

const API_BASE_URL =
  typeof window === 'undefined'
    ? process.env.API_BASE_URL || 'https://api.okancelikcan.com/api'
    : process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

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

  return response.json()
}

export async function getAboutContent() {
  const response = await fetch(`${API_BASE_URL}/about`)

  if (!response.ok) {
    throw new Error('Hakkımda alanı alınırken bir hata oluştu.')
  }

  return response.json()
}

export async function getAdminAboutContent() {
  return request('/about/admin')
}

export async function updateAboutContent(aboutData) {
  return request('/about', {
    method: 'PUT',
    body: JSON.stringify(aboutData),
  })
}

export async function generateEnglishAboutTranslation(aboutTranslationData) {
  return request('/translation/about-to-en', {
    method: 'POST',
    body: JSON.stringify(aboutTranslationData),
  })
}