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

  return response.json()
}

export async function getSkills() {
  const response = await fetch(`${API_BASE_URL}/skills`)

  if (!response.ok) {
    throw new Error('Teknik yetenekler alınırken bir hata oluştu.')
  }

  return response.json()
}

export async function getAdminSkills() {
  return request('/skills/admin')
}

export async function createSkillGroup(data) {
  return request('/skills', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateSkillGroup(id, data) {
  return request(`/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteSkillGroup(id) {
  return request(`/skills/${id}`, {
    method: 'DELETE',
  })
}

export async function generateEnglishSkillTranslation(skillTranslationData) {
  return request('/translation/skill-to-en', {
    method: 'POST',
    body: JSON.stringify(skillTranslationData),
  })
}