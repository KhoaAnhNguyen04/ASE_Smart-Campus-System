import React from "react";
import FormField from "./FormField";
import FormSelect from "./FormSelect";
import FormTimeRange from "./FormTimeRange";

const BookingEditForm = ({
  booking,
  editForm,
  errors,
  roomOptions,
  onSave,
  onCancelEdit,
  onFormChange,
}) => {
  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Edit Booking
        </h3>
        <p className="text-sm text-muted-foreground">ID: {booking.id}</p>
      </div>

      <div className="space-y-4">
        <FormField
          label="Purpose"
          type="text"
          value={editForm.purpose || ""}
          onChange={(e) =>
            onFormChange({ ...editForm, purpose: e.target.value })
          }
          error={errors.purpose}
          placeholder="Enter booking purpose"
        />

        <FormField
          label="Date"
          type="date"
          value={editForm.date || ""}
          onChange={(e) => onFormChange({ ...editForm, date: e.target.value })}
          error={errors.date}
        />

        <FormTimeRange
          startTime={editForm.startTime || ""}
          endTime={editForm.endTime || ""}
          onStartTimeChange={(value) =>
            onFormChange({ ...editForm, startTime: value })
          }
          onEndTimeChange={(value) =>
            onFormChange({ ...editForm, endTime: value })
          }
          startError={errors.startTime}
          endError={errors.endTime}
        />

        <FormSelect
          label="Room"
          value={editForm.room || ""}
          onChange={(e) => onFormChange({ ...editForm, room: e.target.value })}
          options={roomOptions}
          error={errors.room}
          placeholder="Select a room"
          valueKey="id"
          labelKey="name"
        />

        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Save Changes
          </button>
          <button
            onClick={onCancelEdit}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingEditForm;