import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import { getCurrentUser } from "./services/authService";

import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import Checkout from "./pages/Checkout";
import PurchaseSuccess from "./components/PurchaseSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyTickets from "./pages/MyTickets";
import Profile from "./pages/Profile";
import TicketDetails from "./pages/TicketDetails";

import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import QRScanner from "./pages/QRScanner";

function HomeRoute() {
  const user = getCurrentUser();
  const role = user?.role?.toUpperCase();

  if (role === "ORGANIZER") {
    return (
      <Navigate
        to="/organizer/dashboard"
        replace
      />
    );
  }

  return <Home />;
}

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      <Navbar />

      <Routes>
        {/* Home / Explore */}
        <Route
          path="/"
          element={<HomeRoute />}
        />

        {/* Public routes */}
        <Route
          path="/event/:id"
          element={<EventDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Customer routes */}
        <Route
          path="/checkout/:id"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase-success"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <PurchaseSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MyTickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ticket/:ticketId"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <TicketDetails />
            </ProtectedRoute>
          }
        />

        {/* Shared logged-in route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Organizer routes */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ORGANIZER"]}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/events/create"
          element={
            <ProtectedRoute allowedRoles={["ORGANIZER"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/events/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["ORGANIZER"]}>
              <EditEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/qr-scanner"
          element={
            <ProtectedRoute allowedRoles={["ORGANIZER"]}>
              <QRScanner />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;