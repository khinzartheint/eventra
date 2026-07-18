import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      role,
    }),
  }
);

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      setMessage("Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      setMessage(
        "Cannot connect to Eventra backend. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Join Eventra
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="mt-3 text-gray-500">
            Choose how you want to use Eventra.
          </p>
        </div>

        <form onSubmit={handleRegister} className="mt-8">
          <div className="mb-6">
            <p className="mb-3 font-medium text-gray-700">
              Account Type
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("CUSTOMER")}
                className={`rounded-2xl border p-4 text-left transition ${
                  role === "CUSTOMER"
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                    : "border-gray-300 hover:border-blue-300"
                }`}
              >
                <div className="text-2xl">🎟️</div>

                <p className="mt-2 font-bold text-gray-900">
                  Customer
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Discover events and purchase tickets.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole("ORGANIZER")}
                className={`rounded-2xl border p-4 text-left transition ${
                  role === "ORGANIZER"
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                    : "border-gray-300 hover:border-blue-300"
                }`}
              >
                <div className="text-2xl">📅</div>

                <p className="mt-2 font-bold text-gray-900">
                  Organizer
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Create events and manage ticket sales.
                </p>
              </button>
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              minLength="6"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {message && (
            <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
              <p className="text-sm text-gray-700">
                {message}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : `Create ${
                  role === "ORGANIZER"
                    ? "Organizer"
                    : "Customer"
                } Account`}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Login
          </button>
        </p>
      </div>
    </main>
  );
}

export default Register;