import React from 'react';
import Icon from "../../../components/AppIcon";

const BookingEditForm = ({
  booking,
  editForm,
  errors,
  roomOptions,
  buildingOptions,
  onSave,
  onCancel,
  onFormChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-foreground">{booking.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name="Save" size={16} />
            Save
          </button>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            <Icon name="X" size={16} />
            Cancel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date</label>
          <input
            type="date"
            value={editForm.date}
            onChange={(e) => onFormChange({...editForm, date: e.target.value})}
            className={`w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent ${
              errors.date ? 'border-red-500' : 'border-input'
            }`}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Building</label>
          <select
            value={editForm.building}
            onChange={(e) => onFormChange({...editForm, building: e.target.value})}
            className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {buildingOptions.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Start Time</label>
          <input
            type="time"
            value={editForm.startTime}
            onChange={(e) => onFormChange({...editForm, startTime: e.target.value})}
            className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">End Time</label>
          <input
            type="time"
            value={editForm.endTime}
            onChange={(e) => onFormChange({...editForm, endTime: e.target.value})}
            className={`w-full px-4 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent ${
              errors.endTime ? 'border-red-500' : 'border-input'
            }`}
          />
          {errors.endTime && (
            <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">Room</label>
          <select
            value={editForm.room}
            onChange={(e) => onFormChange({...editForm, room: e.target.value})}
            className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            {roomOptions.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BookingEditForm;