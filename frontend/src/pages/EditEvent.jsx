import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getEventById,
  updateEvent,
} from "../services/eventApiService";
import { getCurrentUser } from "../services/authService";
import {
  getFullImageUrl,
  uploadImage,
} from "../services/imageUploadApiService";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    category: "Music",
    imageUrl: "",
    price: "",
    totalTickets: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [localPreview, setLocalPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setMessage("");

        const event = await getEventById(id);

        setFormData({
          title: event.title || "",
          description: event.description || "",
          location: event.location || "",
          eventDate: event.eventDate
            ? String(event.eventDate).split("T")[0]
            : "",
          category: event.category || "Music",
          imageUrl: event.imageUrl || "",
          price: event.price ?? "",
          totalTickets: event.totalTickets ?? "",
        });
      } catch (error) {
        console.error("Load event error:", error);

        setMessage(
          error?.message ||
            "Could not load this event. Please check that the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    const maximumFileSize = 5 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      setMessage("The image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    setSelectedImage(file);
    setLocalPreview(URL.createObjectURL(file));
    setMessage("");
  };

  const removeSelectedImage = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    setSelectedImage(null);
    setLocalPreview("");
  };

  const removeCurrentImage = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    setSelectedImage(null);
    setLocalPreview("");

    setFormData((currentFormData) => ({
      ...currentFormData,
      imageUrl: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const organizerId = currentUser.userId || currentUser.id;

    if (!organizerId) {
      setMessage("Organizer information is missing. Please log in again.");
      return;
    }

    const price = Number(formData.price);
    const totalTickets = Number(formData.totalTickets);

    if (Number.isNaN(price) || price < 0) {
      setMessage("Please enter a valid ticket price.");
      return;
    }

    if (
      Number.isNaN(totalTickets) ||
      totalTickets < 1 ||
      !Number.isInteger(totalTickets)
    ) {
      setMessage("Total tickets must be a whole number greater than zero.");
      return;
    }

    setMessage("");
    setSaving(true);

    try {
      let finalImageUrl = formData.imageUrl.trim();

      if (selectedImage) {
        setUploadingImage(true);

        const uploadResult = await uploadImage(selectedImage);

        finalImageUrl =
          uploadResult?.imageUrl ||
          uploadResult?.url ||
          uploadResult?.fileUrl ||
          "";

        if (!finalImageUrl) {
          throw new Error(
            "The image was uploaded, but no image URL was returned."
          );
        }
      }

      await updateEvent(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        eventDate: formData.eventDate,
        category: formData.category,
        imageUrl: finalImageUrl,
        price,
        totalTickets,
        organizerId,
      });

      navigate("/organizer/dashboard");
    } catch (error) {
      console.error("Update event error:", error);

      setMessage(
        error?.message ||
          "Could not update the event. Please try again."
      );
    } finally {
      setUploadingImage(false);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 h-12 w-72 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />

          <div className="mt-10 space-y-6 rounded-3xl border border-gray-200 bg-white p-8">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-xl bg-gray-200"
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  const currentImagePreview = getFullImageUrl(formData.imageUrl);
  const imagePreview = localPreview || currentImagePreview;
  const isSubmitting = saving || uploadingImage;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <div className="mb-10">
          <p className="font-semibold text-blue-600">
            Organizer Portal
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">
            Edit Event
          </h1>

          <p className="mt-3 text-gray-500">
            Update your event details, image, and ticket information.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              Basic Information
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block font-medium text-gray-700"
                >
                  Event Title
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter the event title"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Describe the event"
                  required
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-xl font-bold text-gray-900">
              Event Details
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block font-medium text-gray-700"
                >
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter the venue or location"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="eventDate"
                  className="mb-2 block font-medium text-gray-700"
                >
                  Event Date
                </label>

                <input
                  id="eventDate"
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block font-medium text-gray-700"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Music">Music</option>
                  <option value="K-Pop">K-Pop</option>
                  <option value="Food">Food</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Sports">Sports</option>
                  <option value="Education">Education</option>
                  <option value="Arts">Arts</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block font-medium text-gray-700"
                >
                  Ticket Price (THB)
                </label>

                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="totalTickets"
                  className="mb-2 block font-medium text-gray-700"
                >
                  Total Tickets
                </label>

                <input
                  id="totalTickets"
                  type="number"
                  name="totalTickets"
                  value={formData.totalTickets}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          <section>
            <h2 className="text-xl font-bold text-gray-900">
              Event Image
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Keep the current image or select a new JPG, PNG, WEBP, or GIF
              image up to 5 MB.
            </p>

            <div className="mt-6">
              <label
                htmlFor="eventImage"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-blue-400 hover:bg-blue-50"
              >
                <span className="text-4xl">🖼️</span>

                <span className="mt-3 font-semibold text-gray-800">
                  Choose a new event image
                </span>

                <span className="mt-1 text-sm text-gray-500">
                  The current image stays unchanged unless you choose another
                  one.
                </span>

                <input
                  id="eventImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {selectedImage && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div>
                  <p className="font-semibold text-blue-900">
                    New image selected
                  </p>

                  <p className="mt-1 break-all text-sm text-blue-700">
                    {selectedImage.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Keep Current Image
                </button>
              </div>
            )}

            {imagePreview ? (
              <div className="mt-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-gray-700">
                    Image Preview
                  </p>

                  <button
                    type="button"
                    onClick={removeCurrentImage}
                    className="text-sm font-semibold text-red-600 transition hover:text-red-700"
                  >
                    Remove Image
                  </button>
                </div>

                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="max-h-96 w-full rounded-2xl border border-gray-200 object-cover"
                />
              </div>
            ) : (
              <div className="mt-6 flex h-56 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                No event image selected
              </div>
            )}
          </section>

          {message && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-red-700">
                {message}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 border-t border-gray-200 pt-7">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadingImage
                ? "Uploading Image..."
                : saving
                  ? "Saving Changes..."
                  : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/organizer/dashboard")}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-300 px-8 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default EditEvent;