import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

function ProtectedRoute({ children, allowedRoles }) {
  const user = getCurrentUser();

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If this route has no role restriction,
  // allow any logged-in user
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  const userRole = user.role?.toUpperCase();

  // User does not have permission for this route
  if (!allowedRoles.includes(userRole)) {
    if (userRole === "ORGANIZER") {
      return (
        <Navigate
          to="/organizer/dashboard"
          replace
        />
      );
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;