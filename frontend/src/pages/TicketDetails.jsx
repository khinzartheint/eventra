import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QRCode from "react-qr-code";

import PrintTicketButton from "../components/PrintTicketButton";
import { getCurrentUser } from "../services/authService";
import { getEventById } from "../services/eventApiService";
import { getFullImageUrl } from "../services/imageUploadApiService";
import { getTicketsByUserId } from "../services/ticketApiService";
import { formatEventDate, formatPrice } from "../utils/eventFormatters";

import "../styles/print.css";

function TicketDetails() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [relatedEvent, setRelatedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        setMessage("Please log in to view this ticket.");
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

        const tickets = await getTicketsByUserId(userId);

        const ticketList = Array.isArray(tickets) ? tickets : [];

        const selectedTicket = ticketList.find(
          (item) => String(item.id) === String(ticketId)
        );

        if (!selectedTicket) {
          setMessage("This ticket could not be found.");
          return;
        }

        setTicket(selectedTicket);

        if (selectedTicket.eventId) {
          try {
            const eventData = await getEventById(selectedTicket.eventId);
            setRelatedEvent(eventData);
          } catch (eventError) {
            console.error(
              "Related event loading error:",
              eventError
            );

            setRelatedEvent(null);
          }
        }
      } catch (error) {
        console.error("Ticket loading error:", error);

        setMessage(
          error?.message ||
            "Could not load this ticket. Please check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [ticketId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
          <div className="mb-8">
            <div className="h-12 w-64 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <div className="h-72 animate-pulse bg-gray-200" />

            <div className="grid gap-10 p-8 md:grid-cols-[1fr_240px]">
              <div className="space-y-5">
                <div className="h-5 w-28 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
              </div>

              <div className="h-56 animate-pulse rounded-2xl bg-gray-200" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
          <div className="rounded-3xl border border-red-200 bg-white p-10 shadow-sm">
            <p className="text-5xl">🎫</p>

            <h1 className="mt-5 text-3xl font-bold text-gray-900">
              Ticket Not Found
            </h1>

            <p className="mt-3 text-gray-600">
              {message || "This ticket is unavailable."}
            </p>

            <Link
              to="/my-tickets"
              className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Back to My Tickets
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const eventImage = getFullImageUrl(relatedEvent?.imageUrl);

  const ticketPrice =
    ticket.price !== null && ticket.price !== undefined
      ? ticket.price
      : relatedEvent?.price;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="mb-8 no-print">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Eventra digital ticket
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
            Your Ticket
          </h1>

          <p className="mt-3 text-gray-500">
            Present the QR code below at the event entrance.
          </p>
        </div>

        <div
          id="printable-ticket"
          className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl"
        >
          {eventImage ? (
            <img
              src={eventImage}
              alt={ticket.eventTitle || "Event ticket"}
              className="h-72 w-full object-cover"
            />
          ) : (
            <div className="flex h-72 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-7xl text-white">
              🎫
            </div>
          )}

          <div className="p-6 sm:p-8 md:p-10">
            <div className="flex flex-col justify-between gap-10 md:flex-row">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                    {ticket.ticketType || "Standard Ticket"}
                  </span>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      ticket.used
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {ticket.used ? "Used Ticket" : "Valid Ticket"}
                  </span>
                </div>

                <p className="mt-6 text-sm font-medium text-gray-500">
                  Ticket ID #{ticket.id}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                  {ticket.eventTitle || "Event Ticket"}
                </h2>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Location
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      📍 {ticket.location || "Location unavailable"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Event date
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      📅 {formatEventDate(ticket.eventDate)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Seat
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      💺 {ticket.seat || "General admission"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Ticket price
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {formatPrice(ticketPrice)}
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-gray-200 p-4">
                  <p className="text-sm font-medium text-gray-500">
                    Ticket code
                  </p>

                  <p className="mt-2 break-all font-mono text-sm font-semibold text-gray-900">
                    {ticket.ticketCode}
                  </p>
                </div>
              </div>

              <div className="self-center md:self-start">
                <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <QRCode
                    value={ticket.ticketCode || String(ticket.id)}
                    size={190}
                  />
                </div>

                <p className="mt-4 max-w-[230px] text-center text-sm leading-6 text-gray-500">
                  Keep this QR code visible when entering the venue.
                </p>
              </div>
            </div>

            <div
              className={`mt-10 rounded-2xl border p-5 text-center ${
                ticket.used
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              <p className="font-bold">
                {ticket.used
                  ? "This ticket has already been checked in."
                  : "This ticket is valid and ready to use."}
              </p>

              <p className="mt-1 text-sm">
                {ticket.used
                  ? "A used ticket cannot be used for another entry."
                  : "Present this QR code to the organizer at the event entrance."}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 no-print">
          <PrintTicketButton />

          <Link
            to="/my-tickets"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Back to My Tickets
          </Link>

          {ticket.eventId && (
            <Link
              to={`/event/${ticket.eventId}`}
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              View Event
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}

export default TicketDetails;