import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import DarkModeButton from "./DarkModeButton";
import { logoutUser } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setUser(null);
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("Could not read saved user:", error);
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const role = user?.role?.toUpperCase();

  const linkClass =
    "text-sm font-medium text-gray-700 transition hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400";

  const activeLinkClass =
    "text-sm font-semibold text-blue-600 dark:text-blue-400";

  const getLinkClass = (path) =>
    location.pathname === path ? activeLinkClass : linkClass;

  const logoDestination =
    role === "ORGANIZER"
      ? "/organizer/dashboard"
      : "/";

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to={logoDestination}
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Eventra
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-5 md:flex">
          {!user && (
            <Link
              to="/"
              className={getLinkClass("/")}
            >
              Explore
            </Link>
          )}

          {role === "CUSTOMER" && (
            <>
              <Link
                to="/"
                className={getLinkClass("/")}
              >
                Explore
              </Link>

              <Link
                to="/my-tickets"
                className={getLinkClass("/my-tickets")}
              >
                My Tickets
              </Link>

              <Link
                to="/profile"
                className={getLinkClass("/profile")}
              >
                Profile
              </Link>
            </>
          )}

          {role === "ORGANIZER" && (
            <>
              <Link
                to="/organizer/dashboard"
                className={getLinkClass(
                  "/organizer/dashboard"
                )}
              >
                Dashboard
              </Link>

              <Link
                to="/organizer/events/create"
                className={getLinkClass(
                  "/organizer/events/create"
                )}
              >
                Create Event
              </Link>

              <Link
                to="/organizer/qr-scanner"
                className={getLinkClass(
                  "/organizer/qr-scanner"
                )}
              >
                QR Scanner
              </Link>

              <Link
                to="/profile"
                className={getLinkClass("/profile")}
              >
                Profile
              </Link>
            </>
          )}

          {user ? (
            <>
              <span className="hidden text-sm text-gray-500 dark:text-gray-300 lg:inline">
                {user.fullName}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}

          <DarkModeButton />
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (currentValue) => !currentValue
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-2xl text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 px-4 py-4 dark:border-gray-700 md:hidden">
          <div className="flex flex-col gap-4">
            {!user && (
              <Link
                to="/"
                className={getLinkClass("/")}
              >
                Explore
              </Link>
            )}

            {role === "CUSTOMER" && (
              <>
                <Link
                  to="/"
                  className={getLinkClass("/")}
                >
                  Explore
                </Link>

                <Link
                  to="/my-tickets"
                  className={getLinkClass("/my-tickets")}
                >
                  My Tickets
                </Link>

                <Link
                  to="/profile"
                  className={getLinkClass("/profile")}
                >
                  Profile
                </Link>
              </>
            )}

            {role === "ORGANIZER" && (
              <>
                <Link
                  to="/organizer/dashboard"
                  className={getLinkClass(
                    "/organizer/dashboard"
                  )}
                >
                  Dashboard
                </Link>

                <Link
                  to="/organizer/events/create"
                  className={getLinkClass(
                    "/organizer/events/create"
                  )}
                >
                  Create Event
                </Link>

                <Link
                  to="/organizer/qr-scanner"
                  className={getLinkClass(
                    "/organizer/qr-scanner"
                  )}
                >
                  QR Scanner
                </Link>

                <Link
                  to="/profile"
                  className={getLinkClass("/profile")}
                >
                  Profile
                </Link>
              </>
            )}

            {user?.fullName && (
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Signed in as {user.fullName}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              )}

              <DarkModeButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;