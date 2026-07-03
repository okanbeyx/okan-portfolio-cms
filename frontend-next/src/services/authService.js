const API_BASE_URL =
  typeof window === 'undefined'
    ? process.env.API_BASE_URL || 'https://api.okancelikcan.com/api'
    : process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

const TOKEN_KEY = 'okan_portfolio_admin_token'
const ADMIN_KEY = 'okan_portfolio_admin_user'

export async function loginAdmin(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (response.status === 429) {
    throw new Error('Çok fazla giriş denemesi yapıldı. Lütfen 10 dakika sonra tekrar dene.')
  }

  if (!response.ok) {
    throw new Error('Kullanıcı adı/e-posta veya şifre hatalı.')
  }
  const data = await response.json()

  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(
    ADMIN_KEY,
    JSON.stringify({
      adminId: data.adminId,
      fullName: data.fullName,
      userName: data.userName,
      email: data.email,
      expiresAt: data.expiresAt,
    })
  )

  return data
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getAdminUser() {
  const admin = localStorage.getItem(ADMIN_KEY)

  if (!admin) {
    return null
  }

  return JSON.parse(admin)
}

export function isAuthenticated() {
  const token = getToken()
  const admin = getAdminUser()

  if (!token || !admin?.expiresAt) {
    return false
  }

  const expiresAt = new Date(admin.expiresAt).getTime()
  const now = Date.now()

  if (expiresAt <= now) {
    logoutAdmin()
    return false
  }

  return true
}

export function logoutAdmin() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ADMIN_KEY)
}