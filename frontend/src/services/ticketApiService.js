const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/tickets`

async function readResponse(response) {
  const contentType = response.headers.get("content-type")

  if (contentType?.includes("application/json")) {
    return response.json()
  }

  return null
}

export async function createTicket(ticket) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ticket),
  })

  const data = await readResponse(response)

  if (!response.ok) {
    throw new Error(data?.message || "Failed to create ticket")
  }

  return data
}

export async function getTicketsByUserId(userId) {
  const response = await fetch(`${API_URL}/user/${userId}`)
  const data = await readResponse(response)

  if (!response.ok) {
    throw new Error(data?.message || "Failed to load tickets")
  }

  return data
}

export async function getTicketByCode(ticketCode) {
  const response = await fetch(
    `${API_URL}/code/${encodeURIComponent(ticketCode)}`
  )

  const data = await readResponse(response)

  if (!response.ok) {
    throw new Error(data?.message || "Ticket not found")
  }

  return data
}

export async function checkInTicket(ticketCode) {
  const response = await fetch(
    `${API_URL}/check-in/${encodeURIComponent(ticketCode)}`,
    {
      method: "PATCH",
    }
  )

  const data = await readResponse(response)

  if (!response.ok) {
    const error = new Error(
      data?.message || "Could not check in the ticket"
    )

    error.status = response.status
    error.ticket = data?.ticket || null

    throw error
  }

  return data
}