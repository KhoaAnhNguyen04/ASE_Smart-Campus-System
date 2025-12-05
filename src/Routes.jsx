import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import HomeDashboard from "./pages/home-dashboard";
import RoomSearch from "./pages/room-search";
import RoomControlInterface from "./pages/room-control-interface";
import NewBooking from "./pages/new-booking";
import RoomDetails from "./pages/room-details";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/home-dashboard" element={<HomeDashboard />} />
          <Route path="/room-search" element={<RoomSearch />} />
          <Route
            path="/room-control-interface"
            element={<RoomControlInterface />}
          />
          <Route path="/new-booking" element={<NewBooking />} />
          <Route path="/room-details" element={<RoomDetails />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
