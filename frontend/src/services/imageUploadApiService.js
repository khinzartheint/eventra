const BACKEND_URL = import.meta.env.VITE_API_BASE_URL
const API_URL = `${BACKEND_URL}/api/upload`

export async function uploadImage(imageFile) {
  if (!imageFile) {
    throw new Error("Please select an image")
  }

  const formData = new FormData()

  formData.append("image", imageFile)

  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to upload image"
    )
  }

  return {
    ...data,
    fullImageUrl: `${BACKEND_URL}${data.imageUrl}`,
  }
}

export function getFullImageUrl(imageUrl) {
  if (!imageUrl) {
    return ""
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl
  }

  return `${BACKEND_URL}${imageUrl}`
}