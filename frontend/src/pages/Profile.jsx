import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  logoutUser,
} from "../services/authService";

function Profile() {
  const navigate = useNavigate();

  const user = getCurrentUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-10">
        <h1 className="text-5xl font-bold mb-4">Profile</h1>

        <p className="text-gray-500">
          No user is currently logged in.
        </p>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const displayName = user.fullName || "Eventra User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <h1 className="text-5xl font-bold mb-4">Profile</h1>

      <p className="text-gray-500 mb-8">
        Manage your account settings.
      </p>

      <div className="border rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold">
            {firstLetter}
          </div>

          <div>
            <h2 className="text-3xl font-bold">
              {displayName}
            </h2>

            <p className="text-gray-500">
              {user.email}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Role: {user.role}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;