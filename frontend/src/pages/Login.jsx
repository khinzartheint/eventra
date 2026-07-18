import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const user = await loginUser(
        email.trim(),
        password
      );

      setMessage("Login successful!");

      const role = user?.role?.toUpperCase();

      if (role === "ORGANIZER") {
        navigate("/organizer/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Eventra
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-3 text-gray-500">
            Login to your Eventra account.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="mt-8"
        >
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
              onChange={(event) =>
                setEmail(event.target.value)
              }
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
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
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
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Register
          </button>
        </p>
      </div>
    </main>
  );
}

export default Login;