import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import TicketCard from "../components/TicketCard";
import { getCurrentUser } from "../services/authService";
import { getTicketsByUserId } from "../services/ticketApiService";

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        setMessage("Please log in to view your tickets.");
        setLoading(false);
        return;
      }

      const userId = currentUser.userId || currentUser.id;

      if (!userId) {
        setMessage("User information is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setMessage("");

        const userTickets = await getTicketsByUserId(userId);

        const ticketList = Array.isArray(userTickets)
          ? userTickets
          : [];

        setTickets(ticketList);
      } catch (error) {
        console.error("Ticket loading error:", error);

        setMessage(
          error?.message ||
            "Could not load your tickets. Please check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="mb-10">
            <div className="h-12 w-64 animate-pulse rounded bg-gray-200" />
            <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="h-48 animate-pulse bg-gray-200" />

                <div className="space-y-4 p-6">
                  <div className="h-7 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-11 w-full animate-pulse rounded-xl bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Your bookings
            </p>

            <h1 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
              My Tickets
            </h1>

            <p className="mt-3 text-gray-500">
              View your purchased tickets and access their QR codes.
            </p>
          </div>

          {!message && tickets.length > 0 && (
            <p className="text-sm font-medium text-gray-500">
              {tickets.length}{" "}
              {tickets.length === 1 ? "ticket" : "tickets"}
            </p>
          )}
        </div>

        {message && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-4xl">⚠️</p>

            <h2 className="mt-4 text-xl font-bold text-red-700">
              Tickets could not be loaded
            </h2>

            <p className="mt-2 text-red-600">
              {message}
            </p>

            <Link
              to="/login"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        )}

        {!message && tickets.length === 0 && (
          <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-6xl">🎟️</p>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              No tickets yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              Your purchased tickets will appear here after you complete a
              booking.
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Events
            </Link>
          </div>
        )}

        {!message && tickets.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticketId={ticket.id}
                eventName={ticket.eventTitle}
                location={ticket.location}
                date={ticket.eventDate}
                ticketType={ticket.ticketType}
                seat={ticket.seat}
                used={ticket.used}
                price={ticket.price}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MyTickets;