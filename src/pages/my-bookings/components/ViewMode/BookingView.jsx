import React from "react";
import BookingHeader from "./BookingHeader";
import BookingInfo from "./BookingInfo";
import BookingActions from "./BookingActions";

const BookingView = ({ booking, onEdit, onCancel, onDelete }) => {
  return (
    <>
      <BookingHeader booking={booking} />
      <BookingInfo booking={booking} />
      <BookingActions
        booking={booking}
        onEdit={onEdit}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    </>
  );
};

export default BookingView;