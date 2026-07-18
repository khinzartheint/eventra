const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/dashboard`

export async function getDashboard(organizerId) {
  const response = await fetch(
    `${API_URL}/${organizerId}`
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load dashboard"
    )
  }

  return data
}