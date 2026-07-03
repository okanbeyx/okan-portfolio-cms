const API_BASE_URL =
  typeof window === 'undefined'
    ? process.env.API_BASE_URL || 'https://api.okancelikcan.com/api'
    : process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

export async function getSiteTexts() {
  try {
    const response = await fetch(`${API_BASE_URL}/site-texts`, {
      ...(typeof window === 'undefined'
        ? {
            next: {
              revalidate: 300,
            },
          }
        : {}),
    })

    if (!response.ok) {
      return []
    }

    return response.json()
  } catch {
    return []
  }
}