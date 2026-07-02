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

  return response.json()
}

export async function getSiteTexts() {
  const response = await fetch(`${API_BASE_URL}/site-texts`)

  if (!response.ok) {
    throw new Error('Site metinleri alınırken bir hata oluştu.')
  }

  return response.json()
}

export async function getAdminSiteTexts() {
  return request('/site-texts/admin')
}

export async function updateSiteTexts(items) {
  return request('/site-texts', {
    method: 'PUT',
    body: JSON.stringify({
      items,
    }),
  })
}

export async function generateEnglishSiteTextTranslation(siteTextData) {
  return request('/translation/site-text-to-en', {
    method: 'POST',
    body: JSON.stringify(siteTextData),
  })
}