import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getFullImageUrl } from "../services/imageUploadApiService"
import { getDashboard } from "../services/dashboardApiService"
import {
  deleteEvent,
  getEventsByOrganizerId,
} from "../services/eventApiService"
import { getCurrentUser } from "../services/authService"

function OrganizerDashboard() {
  const navigate = useNavigate()

  const [dashboard, setDashboard] = useState(null)
  const [organizerEvents, setOrganizerEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const loadOrganizerDashboard = async () => {
      const currentUser = getCurrentUser()

      if (!currentUser) {
        navigate("/login")
        return
      }

      const organizerId = currentUser.userId || currentUser.id

      if (!organizerId) {
        setMessage(
          "Organizer information is missing. Please log in again."
        )
        setLoading(false)
        return
      }

      try {
        const [dashboardData, eventsData] = await Promise.all([
          getDashboard(organizerId),
          getEventsByOrganizerId(organizerId),
        ])

        setDashboard(dashboardData)
        setOrganizerEvents(eventsData)
      } catch (error) {
        console.error("Organizer dashboard error:", error)

        setMessage(
          error.message ||
            "Could not load organizer information. Please check that the backend and MySQL are running."
        )
      } finally {
        setLoading(false)
      }
    }

    loadOrganizerDashboard()
  }, [navigate])

  const handleDeleteEvent = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    )

    if (!confirmed) {
      return
    }

    setMessage("")
    setDeletingId(eventId)

    try {
      await deleteEvent(eventId)

      setOrganizerEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== eventId)
      )

      setDashboard((currentDashboard) => {
        if (!currentDashboard) {
          return currentDashboard
        }

        return {
          ...currentDashboard,
          totalEvents: Math.max(
            Number(currentDashboard.totalEvents) - 1,
            0
          ),
        }
      })
    } catch (error) {
      console.error("Delete event error:", error)

      setMessage(
        error.message ||
          "Could not delete the event. Please try again."
      )
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-8 py-10">
        <h1 className="text-5xl font-bold mb-4">
          Organizer Dashboard
        </h1>

        <p className="text-gray-500">
          Loading dashboard information...
        </p>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-8 py-10">
      <div className="mb-10">
        <p className="text-blue-600 font-semibold mb-2">
          Organizer Portal
        </p>

        <h1 className="text-5xl font-bold">
          Organizer Dashboard
        </h1>

        <p className="text-gray-500 mt-3">
          Monitor your events, ticket sales, and revenue.
        </p>
      </div>

      {message && (
        <div className="mb-8 border border-red-200 bg-red-50 rounded-xl p-4">
          <p className="text-red-600">
            {message}
          </p>
        </div>
      )}

      {dashboard && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border rounded-3xl p-7 shadow-sm bg-white">
            <div className="text-4xl mb-5">📅</div>

            <p className="text-gray-500 mb-2">
              My Events
            </p>

            <h2 className="text-4xl font-bold">
              {dashboard.totalEvents}
            </h2>
          </div>

          <div className="border rounded-3xl p-7 shadow-sm bg-white">
            <div className="text-4xl mb-5">🎫</div>

            <p className="text-gray-500 mb-2">
              Tickets Sold
            </p>

            <h2 className="text-4xl font-bold">
              {dashboard.totalTickets}
            </h2>
          </div>

          <div className="border rounded-3xl p-7 shadow-sm bg-white">
            <div className="text-4xl mb-5">💰</div>

            <p className="text-gray-500 mb-2">
              Total Revenue
            </p>

            <h2 className="text-4xl font-bold">
              ฿
              {Number(
                dashboard.totalRevenue
              ).toLocaleString()}
            </h2>
          </div>
        </div>
      )}

      <section className="mt-10 border rounded-3xl p-8 shadow-sm bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h2 className="text-3xl font-bold mb-3">
              Event Management
            </h2>

            <p className="text-gray-500">
              Create and manage your events from this dashboard.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/organizer/events/create")
            }
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Create New Event
          </button>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold">
              My Events
            </h2>

            <p className="text-gray-500 mt-2">
              Events created by your organizer account.
            </p>
          </div>

          <p className="text-gray-500">
            {organizerEvents.length}{" "}
            {organizerEvents.length === 1
              ? "event"
              : "events"}
          </p>
        </div>

        {organizerEvents.length === 0 ? (
          <div className="border rounded-3xl p-10 text-center bg-white shadow-sm">
            <p className="text-5xl">📅</p>

            <h3 className="text-2xl font-bold mt-4">
              No organizer events yet
            </h3>

            <p className="text-gray-500 mt-2">
              Create your first event to start selling tickets.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/organizer/events/create")
              }
              className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {organizerEvents.map((event) => (
              <article
                key={event.id}
                className="border rounded-3xl overflow-hidden shadow-sm bg-white"
              >
                {event.imageUrl ? (
                  <img
                     src={getFullImageUrl(event.imageUrl)}
                     alt={event.title}
                     className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-5xl">
                    📅
                  </div>
                )}

                <div className="p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-blue-600 font-semibold">
                        {event.category}
                      </p>

                      <h3 className="text-2xl font-bold mt-1">
                        {event.title}
                      </h3>
                    </div>

                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      ฿
                      {Number(
                        event.price
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2 text-gray-600">
                    <p>📍 {event.location}</p>
                    <p>📅 {event.eventDate}</p>
                    <p>
                      🎫 {event.availableTickets} of{" "}
                      {event.totalTickets} tickets available
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/organizer/events/${event.id}/edit`
                        )
                      }
                      className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                      Edit Event
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteEvent(event.id)
                      }
                      disabled={deletingId === event.id}
                      className="border border-red-300 text-red-600 px-5 py-2 rounded-xl hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === event.id
                        ? "Deleting..."
                        : "Delete Event"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default OrganizerDashboard