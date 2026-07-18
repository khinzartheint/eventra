import { Link } from "react-router-dom";
import { formatEventDate, formatPrice } from "../utils/eventFormatters";

function TicketCard({
  ticketId,
  eventName,
  location,
  date,
  ticketType,
  seat,
  used,
  price,
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-blue-100">
              Event Ticket
            </p>

            <h2 className="mt-2 text-2xl font-bold leading-tight">
              {eventName}
            </h2>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              used
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {used ? "Used" : "Valid"}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="grid gap-4">
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium text-gray-900">
              📍 {location || "Location unavailable"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Event Date</p>
            <p className="font-medium text-gray-900">
              📅 {formatEventDate(date)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Ticket Type</p>
              <p className="font-medium text-gray-900">
                🎫 {ticketType || "Standard"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Seat</p>
              <p className="font-medium text-gray-900">
                💺 {seat || "General"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-lg font-bold text-blue-600">
              {formatPrice(price)}
            </p>
          </div>
        </div>

        <Link
          to={`/ticket/${ticketId}`}
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          View Digital Ticket
        </Link>
      </div>
    </div>
  );
}

export default TicketCard;