import { Link } from "react-router-dom";
import { getFullImageUrl } from "../services/imageUploadApiService";
import {
  formatEventDate,
  formatPrice,
} from "../utils/eventFormatters";

function EventCard({ event }) {
  const eventImage = getFullImageUrl(event?.imageUrl);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      {eventImage ? (
        <img
          src={eventImage}
          alt={event?.title || "Event"}
          className="h-52 w-full object-cover"
        />
      ) : (
        <div className="flex h-52 w-full items-center justify-center bg-gray-100 text-5xl">
          📅
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {event?.category || "Event"}
          </span>

          <span className="font-bold text-blue-600">
            {formatPrice(event?.price)}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          {event?.title || "Untitled Event"}
        </h2>

        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <p>
            📍 {event?.location || "Location to be announced"}
          </p>

          <p>
            📅 {formatEventDate(event?.eventDate)}
          </p>
        </div>

        <Link
          to={`/event/${event.id}`}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default EventCard;