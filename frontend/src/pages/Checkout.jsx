import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { getEventById } from "../services/eventApiService";
import { getFullImageUrl } from "../services/imageUploadApiService";
import { createTicket } from "../services/ticketApiService";
import {
  formatEventDate,
  formatPrice,
} from "../utils/eventFormatters";

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoadingEvent(true);
        setMessage("");

        const data = await getEventById(id);
        setEvent(data);
      } catch (error) {
        console.error("Checkout event loading error:", error);
        setMessage(
          "Could not load this event. Please check that the backend is running."
        );
      } finally {
        setLoadingEvent(false);
      }
    };

    loadEvent();
  }, [id]);

  const handlePurchase = async () => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login", {
        state: {
          from: `/checkout/${id}`,
        },
      });
      return;
    }

    if (!event) {
      setMessage("The event information is unavailable.");
      return;
    }

    const userId = currentUser.userId || currentUser.id;
    const eventId = Number(event.id);
    const ticketPrice = Number(event.price);
    const availableTickets = Number(event.availableTickets ?? 0);

    if (!userId) {
      setMessage("Your user information is missing. Please log in again.");
      return;
    }

    if (!Number.isFinite(eventId)) {
      setMessage("The event ID is invalid.");
      return;
    }

    if (!Number.isFinite(ticketPrice) || ticketPrice < 0) {
      setMessage(
        "This event has an invalid ticket price. Please contact the organizer."
      );
      return;
    }

    if (availableTickets <= 0) {
      setMessage("This event is sold out.");
      return;
    }

    const randomSeat = `A${Math.floor(Math.random() * 50) + 1}`;

    setMessage("");
    setProcessing(true);

    try {
      const savedTicket = await createTicket({
        eventId,
        eventTitle: event.title,
        location: event.location,
        eventDate: event.eventDate,
        ticketType: "Standard Ticket",
        seat: randomSeat,
        userId: Number(userId),
        price: ticketPrice,
      });

      navigate("/purchase-success", {
        state: {
          ticket: savedTicket,
          event,
        },
      });
    } catch (error) {
      console.error("Purchase error:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.message;

      setMessage(
        backendMessage ||
          "Could not complete your purchase. Please check that the backend is running."
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loadingEvent) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
              <div className="h-72 animate-pulse bg-gray-200" />

              <div className="space-y-4 p-7">
                <div className="h-9 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
              </div>
            </div>

            <div className="h-96 animate-pulse rounded-3xl bg-gray-200" />
          </div>
        </section>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
          <div className="rounded-3xl border border-red-200 bg-white p-10 shadow-sm">
            <p className="text-5xl">⚠️</p>

            <h1 className="mt-5 text-3xl font-bold text-gray-900">
              Checkout Unavailable
            </h1>

            <p className="mt-3 text-gray-600">
              {message || "This event could not be found."}
            </p>

            <Link
              to="/"
              className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Events
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const eventImage = getFullImageUrl(event.imageUrl);
  const availableTickets = Number(event.availableTickets ?? 0);
  const isSoldOut = availableTickets <= 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Secure checkout
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
            Complete your booking
          </h1>

          <p className="mt-3 text-gray-500">
            Review your event and ticket details before confirming.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {eventImage ? (
              <img
                src={eventImage}
                alt={event.title}
                className="h-72 w-full object-cover"
              />
            ) : (
              <div className="flex h-72 items-center justify-center bg-gray-100 text-7xl">
                📅
              </div>
            )}

            <div className="p-6 sm:p-8">
              <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                {event.category || "Event"}
              </span>

              <h2 className="mt-5 text-3xl font-bold text-gray-900">
                {event.title}
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    📍 {event.location || "Location to be announced"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">
                    Event date
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    📅 {formatEventDate(event.eventDate)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold text-gray-900">
              Order summary
            </h2>

            <div className="mt-6 space-y-4 border-b border-gray-200 pb-6">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="font-semibold text-gray-900">
                    Standard Ticket
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: 1
                  </p>
                </div>

                <p className="font-bold text-gray-900">
                  {formatPrice(event.price)}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Booking fee
                </span>

                <span className="font-medium text-gray-900">
                  Free
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between gap-5">
              <div>
                <p className="text-sm text-gray-500">
                  Total
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {formatPrice(event.price)}
                </p>
              </div>

              <p className="text-sm font-medium text-gray-500">
                1 ticket
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-semibold">
                Digital ticket included
              </p>

              <p className="mt-1 text-blue-700">
                Your QR ticket will appear in My Tickets after purchase.
              </p>
            </div>

            {message && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handlePurchase}
              disabled={processing || isSoldOut}
              className="mt-7 w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600"
            >
              {processing
                ? "Processing Purchase..."
                : isSoldOut
                ? "Sold Out"
                : "Confirm Purchase"}
            </button>

            <Link
              to={`/event/${event.id}`}
              className="mt-4 flex w-full items-center justify-center rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              Back to Event
            </Link>

            <p className="mt-5 text-center text-xs leading-5 text-gray-500">
              By confirming, you agree to the event organizer’s ticket terms.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Checkout;