import React from 'react';
import Icon from "../../../components/AppIcon";
import BookingEditForm from "./BookingEditForm";
import BookingDetails from "./BookingDetails";

const BookingCard = ({
  booking,
  isEditing,
  editForm,
  errors,
  roomOptions,
  buildingOptions,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onCancelEdit,
  onFormChange
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      {isEditing ? (
        <BookingEditForm
          booking={booking}
          editForm={editForm}
          errors={errors}
          roomOptions={roomOptions}
          buildingOptions={buildingOptions}
          onSave={() => onSave(booking.id)}
          onCancel={onCancelEdit}
          onFormChange={onFormChange}
        />
      ) : (
        <BookingDetails
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