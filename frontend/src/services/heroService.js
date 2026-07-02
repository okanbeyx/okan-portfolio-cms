import { getToken } from './authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getAuthHeaders() {
  const token = getToken()

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function getHeroContent() {
  const response = await fetch(`${API_BASE_URL}/hero`)

  if (!response.ok) {
    throw new Error('Hero alanı alınırken bir hata oluştu.')
  }

  return response.json()
}

export async function getAdminHeroContent() {
  const response = await fetch(`${API_BASE_URL}/hero/admin`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Hero alanı admin verisi alınırken bir hata oluştu.')
  }

  return response.json()
}

export async function updateHeroContent(heroData) {
  const response = await fetch(`${API_BASE_URL}/hero`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(heroData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Hero alanı güncellenirken bir hata oluştu.')
  }

  return response.json()
}

export async function generateEnglishHeroTranslation(heroTranslationData) {
  const response = await fetch(`${API_BASE_URL}/translation/hero-to-en`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(heroTranslationData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Hero İngilizce içeriği oluşturulurken bir hata oluştu.')
  }

  return response.json()
}