import React from 'react';
import Icon from "../../../components/AppIcon";
import { getStatusColor } from "../utils/bookingUtils";

const BookingDetails = ({ booking, onEdit, onCancel, onDelete }) => {
  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{booking.title}</h3>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
        
        {booking.status === 'upcoming' && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Icon name="Edit2" size={16} />
              Edit
            </button>
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Icon name="Ban" size={16} />
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              <Icon name="Trash2" size={16} />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Icon name="Calendar" size={18} color="var(--color-primary)" />
          <span>{booking.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Clock" size={18} color="var(--color-primary)" />
          <span>{booking.startTime} - {booking.endTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Building" size={18} color="var(--color-primary)" />
          <span>{booking.building}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="DoorOpen" size={18} color="var(--color-primary)" />
          <span>{booking.room}</span>
        </div>
        {booking.purpose && (
          <div className="flex items-center gap-2 md:col-span-2">
            <Icon name="FileText" size={18} color="var(--color-primary)" />
            <span>{booking.purpose}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;