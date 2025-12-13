import React from "react";
import BookingStatusBadge from "./BookingStatusBadge";

const BookingHeader = ({ booking }) => {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-semibold text-foreground">
            {booking.title || booking.purpose || "Room Booking"}
          </h3>
          <BookingStatusBadge status={booking.status} />
        </div>
        <p className="text-sm text-muted-foreground">ID: {booking.id}</p>
      </div>
    </div>
  );
};

export default BookingHeader;
