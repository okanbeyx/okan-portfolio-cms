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

export async function getFeaturedProjects() {
  const response = await fetch(`${API_BASE_URL}/projects`)

  if (!response.ok) {
    throw new Error('Projeler alınırken bir hata oluştu.')
  }

  return response.json()
}

export async function getAllProjects() {
  const response = await fetch(`${API_BASE_URL}/projects/all`, {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Admin proje listesi alınırken bir hata oluştu.')
  }

  return response.json()
}

export async function deleteProject(id) {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error('Proje silinirken bir hata oluştu.')
  }

  return true
}

export async function createProject(projectData) {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData),
  })

  if (!response.ok) {
    throw new Error('Proje eklenirken bir hata oluştu.')
  }

  return response.json()
}

export async function getProjectImages(projectId) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/images`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  })

  if (!response.ok) {
    throw new Error('Proje görselleri alınırken bir hata oluştu.')
  }

  return response.json()
}

export async function uploadProjectImage(projectId, { file, altText, isCover }) {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('altText', altText || '')
  formData.append('isCover', isCover ? 'true' : 'false')

  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Görsel yüklenirken bir hata oluştu.')
  }

  return response.json()
}

export async function setProjectCoverImage(projectId, imageId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/images/${imageId}/cover`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Kapak görseli seçilirken bir hata oluştu.')
  }

  return true
}

export async function deleteProjectImage(projectId, imageId) {
  const response = await fetch(
    `${API_BASE_URL}/projects/${projectId}/images/${imageId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('Görsel silinirken bir hata oluştu.')
  }

  return true
}
export async function getProjectById(id) {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`)

  if (!response.ok) {
    throw new Error('Proje detayı alınırken bir hata oluştu.')
  }

  return response.json()
}
export async function getPublicProjectImages(projectId) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/images`)

  if (!response.ok) {
    throw new Error('Proje görselleri alınırken bir hata oluştu.')
  }

  return response.json()
}
export async function updateProject(id, projectData) {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Proje güncellenirken bir hata oluştu.')
  }

  return true
}

export async function generateEnglishProjectTranslation(translationData) {
  const response = await fetch(`${API_BASE_URL}/translation/project-to-en`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(translationData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'İngilizce içerik oluşturulurken bir hata oluştu.')
  }

  return response.json()
}