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

  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export async function getContactItems() {
  const response = await fetch(`${API_BASE_URL}/contact`)

  if (!response.ok) {
    throw new Error('İletişim bilgileri alınırken bir hata oluştu.')
  }

  return response.json()
}

export async function getAdminContactItems() {
  return request('/contact/admin')
}

export async function createContactItem(data) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateContactItem(id, data) {
  return request(`/contact/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteContactItem(id) {
  return request(`/contact/${id}`, {
    method: 'DELETE',
  })
}