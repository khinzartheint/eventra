import { Link, useLocation } from "react-router-dom";
import { getFullImageUrl } from "../services/imageUploadApiService";
import {
  formatEventDate,
  formatPrice,
} from "../utils/eventFormatters";

function PurchaseSuccess() {
  const { state } = useLocation();

  const ticket = state?.ticket;
  const event = state?.event;

  if (!ticket || !event) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-sm border border-gray-200 p-10 text-center">
          <div className="text-6xl mb-5">🎫</div>

          <h1 className="text-3xl font-bold text-gray-900">
            No Purchase Found
          </h1>

          <p className="mt-3 text-gray-500">
            We couldn't find your latest purchase.
          </p>

          <Link
            to="/my-tickets"
            className="mt-8 inline-flex bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Go to My Tickets
          </Link>
        </div>
      </main>
    );
  }

  const image = getFullImageUrl(event.imageUrl);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-5">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">

          {image ? (
            <img
              src={image}
              alt={event.title}
              className="w-full h-72 object-cover"
            />
          ) : (
            <div className="h-72 flex items-center justify-center bg-gray-100 text-7xl">
              🎉
            </div>
          )}

          <div className="p-8">

            <div className="text-center">

              <div className="text-6xl">
                ✅
              </div>

              <h1 className="mt-5 text-4xl font-bold text-green-600">
                Purchase Successful
              </h1>

              <p className="mt-3 text-gray-600">
                Your ticket has been created successfully.
              </p>

            </div>

            <div className="mt-10 grid md:grid-cols-2 gap-6">

              <div className="border rounded-2xl p-5">

                <h2 className="text-xl font-bold mb-5">
                  Event Information
                </h2>

                <div className="space-y-3">

                  <p>
                    <strong>Event:</strong> {event.title}
                  </p>

                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {formatEventDate(event.eventDate)}
                  </p>

                  <p>
                    <strong>Price:</strong>{" "}
                    {formatPrice(event.price)}
                  </p>

                </div>

              </div>

              <div className="border rounded-2xl p-5">

                <h2 className="text-xl font-bold mb-5">
                  Ticket Information
                </h2>

                <div className="space-y-3">

                  <p>
                    <strong>Ticket Code:</strong>{" "}
                    {ticket.ticketCode}
                  </p>

                  <p>
                    <strong>Seat:</strong>{" "}
                    {ticket.seat}
                  </p>

                  <p>
                    <strong>Ticket Type:</strong>{" "}
                    {ticket.ticketType}
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-10 flex flex-wrap gap-4 justify-center">

              <Link
                to="/my-tickets"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition"
              >
                View My Tickets
              </Link>

              <Link
                to="/"
                className="border border-gray-300 px-8 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                Back to Home
              </Link>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}

export default PurchaseSuccess;