import { getToken } from './authService'

const API_BASE_URL =
  typeof window === 'undefined'
    ? process.env.API_BASE_URL || 'https://api.okancelikcan.com/api'
    : process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

function getAuthHeaders() {
  const token = getToken()

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function getAllEducationItems() {
  const response = await fetch(`${API_BASE_URL}/education/all`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Eğitim geçmişi alınırken bir hata oluştu.')
  }

  return response.json()
}

export async function createEducationItem(educationData) {
  const response = await fetch(`${API_BASE_URL}/education`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(educationData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Eğitim kaydı eklenirken bir hata oluştu.')
  }

  return response.json()
}

export async function updateEducationItem(id, educationData) {
  const response = await fetch(`${API_BASE_URL}/education/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(educationData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Eğitim kaydı güncellenirken bir hata oluştu.')
  }

  return true
}

export async function deleteEducationItem(id) {
  const response = await fetch(`${API_BASE_URL}/education/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Eğitim kaydı pasif yapılırken bir hata oluştu.')
  }

  return true
}

export async function getActiveEducationItems() {
  const response = await fetch(`${API_BASE_URL}/education`)

  if (!response.ok) {
    throw new Error('Eğitim geçmişi alınırken bir hata oluştu.')
  }

  return response.json()
}

export async function generateEnglishEducationTranslation(educationTranslationData) {
  const response = await fetch(`${API_BASE_URL}/translation/education-to-en`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(educationTranslationData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Eğitim İngilizce içeriği oluşturulurken bir hata oluştu.')
  }

  return response.json()
}