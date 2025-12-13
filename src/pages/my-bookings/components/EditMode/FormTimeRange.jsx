import React from "react";

const FormTimeRange = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  startError,
  endError,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Start Time
        </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {startError && (
          <p className="text-red-500 text-sm mt-1">{startError}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          End Time
        </label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {endError && <p className="text-red-500 text-sm mt-1">{endError}</p>}
      </div>
    </div>
  );
};

export default FormTimeRange;