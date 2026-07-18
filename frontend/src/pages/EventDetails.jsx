import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEventById } from "../services/eventApiService";
import { getFullImageUrl } from "../services/imageUploadApiService";
import {
  formatEventDate,
  formatPrice,
} from "../utils/eventFormatters";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setMessage("");

        const data = await getEventById(id);

        setEvent(data);
      } catch (error) {
        console.error("Event details loading error:", error);
        setMessage(
          "Could not load this event. Please check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white">
            <div className="h-80 animate-pulse bg-gray-200 md:h-[430px]" />

            <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-[1fr_340px]">
              <div className="space-y-5">
                <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-12 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                <div className="h-28 w-full animate-pulse rounded bg-gray-200" />
              </div>

              <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (message || !event) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
          <div className="rounded-3xl border border-red-200 bg-white p-10 shadow-sm">
            <p className="text-5xl">⚠️</p>

            <h1 className="mt-5 text-3xl font-bold text-gray-900">
              Event Not Found
            </h1>

            <p className="mt-3 text-gray-600">
              {message || "This event is no longer available."}
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
  const totalTickets = Number(event.totalTickets ?? 0);
  const isSoldOut = availableTickets <= 0;

  const availabilityPercentage =
    totalTickets > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (availableTickets / totalTickets) * 100
          )
        )
      : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          {eventImage ? (
            <img
              src={eventImage}
              alt={event.title}
              className="h-80 w-full object-cover md:h-[430px]"
            />
          ) : (
            <div className="flex h-80 w-full items-center justify-center bg-gray-100 text-7xl md:h-[430px]">
              📅
            </div>
          )}

          <div className="grid gap-10 p-6 sm:p-8 md:p-10 lg:grid-cols-[1fr_340px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {event.category || "Event"}
                </span>

                {isSoldOut && (
                  <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                    Sold Out
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
                {event.title}
              </h1>

              <div className="mt-7 grid gap-4 text-gray-600 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    📍 {event.location || "Location to be announced"}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-500">
                    Event Date
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    📅 {formatEventDate(event.eventDate)}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  About this event
                </h2>

                <p className="mt-4 whitespace-pre-line leading-8 text-gray-600">
                  {event.description ||
                    "More information about this event will be announced soon."}
                </p>
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              <p className="text-sm font-medium text-gray-500">
                Ticket price
              </p>

              <p className="mt-2 text-4xl font-bold text-gray-900">
                {formatPrice(event.price)}
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Available tickets
                  </span>

                  <span className="font-semibold text-gray-900">
                    {availableTickets}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${availabilityPercentage}%`,
                    }}
                  />
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <p>🎫 Standard admission</p>
                  <p>✅ Instant confirmation</p>
                  <p>📱 Digital QR ticket</p>
                </div>
              </div>

              {isSoldOut ? (
                <button
                  type="button"
                  disabled
                  className="mt-8 w-full cursor-not-allowed rounded-xl bg-gray-300 px-6 py-3 font-semibold text-gray-600"
                >
                  Sold Out
                </button>
              ) : (
                <Link
                  to={`/checkout/${event.id}`}
                  className="mt-8 flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Buy Ticket
                </Link>
              )}
            </aside>
          </div>
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex font-semibold text-blue-600 transition hover:text-blue-700"
        >
          ← Back to Events
        </Link>
      </section>
    </main>
  );
}

export default EventDetails;