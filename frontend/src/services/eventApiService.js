const API_URL = "http://localhost:8080/api/events"

export async function getAllEvents() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error("Failed to fetch events")
  }

  return response.json()
}

export async function getEventById(id) {
  const response = await fetch(`${API_URL}/${id}`)

  if (!response.ok) {
    throw new Error("Event not found")
  }

  return response.json()
}

export async function getEventsByOrganizerId(organizerId) {
  const response = await fetch(
    `${API_URL}/organizer/${organizerId}`
  )

  if (!response.ok) {
    throw new Error("Failed to load organizer events")
  }

  return response.json()
}

export async function createEvent(eventData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  })

  if (!response.ok) {
    throw new Error("Failed to create event")
  }

  return response.json()
}

export async function updateEvent(id, eventData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to update event")
  }

  return data
}

export async function deleteEvent(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete event")
  }

  return data
}