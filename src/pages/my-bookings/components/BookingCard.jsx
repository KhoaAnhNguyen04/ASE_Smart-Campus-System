import React from "react";
import BookingView from "./ViewMode/BookingView";
import BookingEditForm from "./EditMode/BookingEditForm";

const BookingCard = ({
  booking,
  isEditing,
  editForm,
  errors,
  roomOptions,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onCancelEdit,
  onFormChange,
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      {isEditing ? (
        <BookingEditForm
          booking={booking}
          editForm={editForm}
          errors={errors}
          roomOptions={roomOptions}
          onSave={() => onSave(booking.id)}
          onCancelEdit={onCancelEdit}
          onFormChange={onFormChange}
        />
      ) : (
        <BookingView
          booking={booking}
          onEdit={() => onEdit(booking)}
          onCancel={() => onCancel(booking.id)}
          onDelete={() => onDelete(booking.id)}
        />
      )}
    </div>
  );
};

export default BookingCard;

