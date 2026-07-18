import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { createEvent } from "../services/eventApiService"
import { getCurrentUser } from "../services/authService"
import {
  getFullImageUrl,
  uploadImage,
} from "../services/imageUploadApiService"

function CreateEvent() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    category: "Music",
    imageUrl: "",
    price: "",
    totalTickets: "",
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [creatingEvent, setCreatingEvent] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const handleImageChange = async (event) => {
    const imageFile = event.target.files?.[0]

    if (!imageFile) {
      return
    }

    setMessage("")
    setUploadingImage(true)

    try {
      const uploadResult = await uploadImage(imageFile)

      setFormData((currentFormData) => ({
        ...currentFormData,
        imageUrl: uploadResult.imageUrl,
      }))
    } catch (error) {
      console.error("Image upload error:", error)

      setMessage(
        error.message || "Could not upload the image."
      )
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const currentUser = getCurrentUser()

    if (!currentUser) {
      navigate("/login")
      return
    }

    const organizerId =
      currentUser.userId || currentUser.id

    if (!organizerId) {
      setMessage(
        "Organizer information is missing. Please log in again."
      )
      return
    }

    if (!formData.imageUrl) {
      setMessage("Please upload an event image.")
      return
    }

    setMessage("")
    setCreatingEvent(true)

    try {
      await createEvent({
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        eventDate: formData.eventDate,
        category: formData.category,
        imageUrl: formData.imageUrl,
        price: Number(formData.price),
        totalTickets: Number(formData.totalTickets),
        organizerId,
      })

      navigate("/organizer/dashboard")
    } catch (error) {
      console.error("Create event error:", error)

      setMessage(
        error.message ||
          "Could not create the event. Please check that the backend and MySQL are running."
      )
    } finally {
      setCreatingEvent(false)
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-8 py-10">
      <div className="mb-10">
        <p className="text-blue-600 font-semibold mb-2">
          Organizer Portal
        </p>

        <h1 className="text-5xl font-bold">
          Create New Event
        </h1>

        <p className="text-gray-500 mt-3">
          Add event details, ticket information, and an event image.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border rounded-3xl p-8 shadow-sm bg-white space-y-6"
      >
        <div>
          <label className="block font-medium mb-2">
            Event Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Bangkok Music Festival"
            required
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the event..."
            required
            rows="5"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: Impact Arena"
              required
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Event Date
            </label>

            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Music">Music</option>
              <option value="K-Pop">K-Pop</option>
              <option value="Food">Food</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Event Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploadingImage}
              className="w-full border rounded-xl px-4 py-3"
            />

            <p className="text-sm text-gray-500 mt-2">
              JPG, PNG, or other image files up to 10 MB.
            </p>
          </div>
        </div>

        {uploadingImage && (
          <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
            <p className="text-blue-700">
              Uploading image...
            </p>
          </div>
        )}

        {formData.imageUrl && (
          <div>
            <p className="font-medium mb-3">
              Image Preview
            </p>

            <img
              src={getFullImageUrl(formData.imageUrl)}
              alt="Event preview"
              className="w-full max-h-80 object-cover rounded-2xl border"
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2">
              Ticket Price (THB)
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="1500"
              required
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Total Tickets
            </label>

            <input
              type="number"
              name="totalTickets"
              value={formData.totalTickets}
              onChange={handleChange}
              min="1"
              placeholder="200"
              required
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {message && (
          <div className="border border-red-200 bg-red-50 rounded-xl p-4">
            <p className="text-red-600">
              {message}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            type="submit"
            disabled={uploadingImage || creatingEvent}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creatingEvent
              ? "Creating Event..."
              : "Create Event"}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/organizer/dashboard")
            }
            disabled={creatingEvent}
            className="border px-8 py-3 rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  )
}

export default CreateEvent