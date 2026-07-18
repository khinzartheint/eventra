const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`
export async function registerUser(user) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Registration failed")
  }

  return data
}

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Login failed")
  }

  localStorage.setItem("user", JSON.stringify(data))

  return data
}

export function getCurrentUser() {
  const storedUser = localStorage.getItem("user")

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch (error) {
    console.error("Invalid user data:", error)
    localStorage.removeItem("user")
    return null
  }
}

export function logoutUser() {
  localStorage.removeItem("user")
  localStorage.removeItem("currentUser")
  localStorage.removeItem("registeredUser")
}