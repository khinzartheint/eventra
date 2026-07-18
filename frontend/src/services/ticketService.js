export function saveTicket(ticket) {
  const existingTickets =
    JSON.parse(localStorage.getItem("tickets")) || []

  const newTicket = {
    ...ticket,
    ticketId: Date.now(),
  }

  const updatedTickets = [...existingTickets, newTicket]

  localStorage.setItem("tickets", JSON.stringify(updatedTickets))
}

export function getTickets() {
  return JSON.parse(localStorage.getItem("tickets")) || []
}