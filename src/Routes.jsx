import React from "react";
import {
  BrowserRouter,
  Routes as RouterRoutes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
import { AuthProvider } from "context/AuthContext";
import NotFound from "pages/NotFound";
import Login from "./pages/login";
import HomeDashboard from "./pages/home-dashboard";
import RoomSearch from "./pages/room-search";
import RoomControlInterface from "./pages/room-control-interface";
import NewBooking from "./pages/new-booking";
import RoomDetails from "./pages/room-details";
import MyBookings from "./pages/my-bookings";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home-dashboard"
              element={
                <ProtectedRoute>
                  <HomeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/room-search"
              element={
                <ProtectedRoute>
                  <RoomSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/room-control-interface"
              element={
                <ProtectedRoute>
                  <RoomControlInterface />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-booking"
              element={
                <ProtectedRoute>
                  <NewBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/room-details/:id"
              element={
                <ProtectedRoute>
                  <RoomDetails />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;
