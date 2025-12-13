import React from "react";
import Icon from "../../../../components/AppIcon";

const BookingActions = ({ booking, onEdit, onCancel, onDelete }) => {
  const canEdit = () => {
    const status = booking.status?.toLowerCase();
    return status === "upcoming" || status === "reserved";
  };

  const canCancel = () => {
    const status = booking.status?.toLowerCase();
    return status === "upcoming" || status === "reserved";
  };

  const handleCancelClick = () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      onCancel();
    }
  };

  const handleDeleteClick = () => {
    if (
      window.confirm("Are you sure you want to delete this booking permanently?")
    ) {
      onDelete();
    }
  };

  return (
    <div className="flex gap-2 pt-4 border-t border-border">
      {canEdit() && (
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Icon name="Edit" size={16} />
          Edit
        </button>
      )}

      {canCancel() && (
        <button
          onClick={handleCancelClick}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
        >
          <Icon name="XCircle" size={16} />
          Cancel Booking
        </button>
      )}

      <button
        onClick={handleDeleteClick}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
      >
        <Icon name="Trash2" size={16} />
        Delete
      </button>
    </div>
  );
};

export default BookingActions;