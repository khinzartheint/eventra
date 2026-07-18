import { useEffect, useMemo, useState } from "react";
import EventCard from "../components/EventCard";
import { getAllEvents } from "../services/eventApiService";

function Home() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setMessage("");

        const data = await getAllEvents();

        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Event loading error:", error);
        setMessage(
          "Could not load events. Please check that the backend and MySQL are running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const categories = useMemo(() => {
    const backendCategories = events
      .map((event) => event.category)
      .filter((category) => category && category.trim() !== "");

    return ["All", ...new Set(backendCategories)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return events.filter((event) => {
      const title = event.title?.toLowerCase() || "";
      const location = event.location?.toLowerCase() || "";
      const category = event.category?.toLowerCase() || "";
      const eventDate = event.eventDate?.toLowerCase() || "";

      const matchesSearch =
        normalizedSearch === "" ||
        title.includes(normalizedSearch) ||
        location.includes(normalizedSearch) ||
        category.includes(normalizedSearch) ||
        eventDate.includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "All" ||
        event.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600">
        <div className="mx-auto max-w-7xl px-5 py-16 text-white sm:px-8 md:py-24">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              Discover. Book. Experience.
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Find events you will remember
            </h1>

            <p className="mt-5 max-w-2xl text-base text-blue-100 sm:text-lg">
              Explore concerts, festivals, technology events, food experiences,
              and more through Eventra.
            </p>

            <div className="mt-8 max-w-2xl rounded-2xl bg-white p-2 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="pl-3 text-xl">🔍</span>

                <input
                  type="text"
                  placeholder="Search by event, location, or category"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-xl px-2 py-3 text-gray-900 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Explore events
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Featured Events
            </h2>

            <p className="mt-2 text-gray-500">
              Browse events created by Eventra organizers.
            </p>
          </div>

          {!loading && !message && (
            <p className="text-sm font-medium text-gray-500">
              {filteredEvents.length}{" "}
              {filteredEvents.length === 1 ? "event" : "events"} found
            </p>
          )}
        </div>

        <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="h-52 animate-pulse bg-gray-200" />

                <div className="space-y-4 p-5">
                  <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="h-7 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-11 w-full animate-pulse rounded-xl bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && message && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-4xl">⚠️</p>

            <h3 className="mt-4 text-xl font-bold text-red-700">
              Events could not be loaded
            </h3>

            <p className="mt-2 text-red-600">{message}</p>
          </div>
        )}

        {!loading && !message && filteredEvents.length === 0 && (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-5xl">🔍</p>

            <h3 className="mt-4 text-2xl font-bold text-gray-900">
              No events found
            </h3>

            <p className="mt-2 text-gray-500">
              Try changing your search word or selected category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !message && filteredEvents.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;