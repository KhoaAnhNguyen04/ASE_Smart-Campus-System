import React from "react";
import BookingInfoItem from "./BookingInfoItem";

const BookingInfo = ({ booking }) => {
  return (
    <div className="space-y-3 mb-4">
      {/* Room & Building */}
      <BookingInfoItem icon="MapPin">
        <div>
          <p className="text-sm font-medium text-foreground">{booking.room}</p>
          <p className="text-xs text-muted-foreground">{booking.building}</p>
        </div>
      </BookingInfoItem>

      {/* Date */}
      <BookingInfoItem icon="Calendar">
        <p className="text-sm text-foreground">
          {new Date(booking.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </BookingInfoItem>

      {/* Time */}
      <BookingInfoItem icon="Clock">
        <p className="text-sm text-foreground">
          {booking.startTime} - {booking.endTime}
        </p>
      </BookingInfoItem>

      {/* Purpose */}
      {booking.purpose && (
        <BookingInfoItem icon="FileText">
          <p className="text-sm text-foreground">{booking.purpose}</p>
        </BookingInfoItem>
      )}

      {/* User Email */}
      {booking.user_email && (
        <BookingInfoItem icon="Mail">
          <p className="text-sm text-muted-foreground">{booking.user_email}</p>
        </BookingInfoItem>
      )}
    </div>
  );
};

export default BookingInfo;