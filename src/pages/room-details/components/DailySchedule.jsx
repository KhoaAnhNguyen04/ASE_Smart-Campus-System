import React from "react";
import Icon from "../../../components/AppIcon";

const DailySchedule = ({ schedule, currentTime }) => {
  const formatTime = (time) => {
    const [hours, minutes] = time?.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isCurrentSlot = (startTime, endTime) => {
    const current = new Date(currentTime);
    const start = new Date(`${current.toDateString()} ${startTime}`);
    const end = new Date(`${current.toDateString()} ${endTime}`);
    return current >= start && current <= end;
  };

  const getStatusColor = (status) => {
    const colors = {
      occupied: "bg-error/10 border-error/20 text-error",
      available: "bg-success/10 border-success/20 text-success",
      reserved: "bg-warning/10 border-warning/20 text-warning",
    };
    return colors?.[status] || colors?.available;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="Calendar" size={20} />
          Today's Schedule
        </h2>
        <span className="text-sm text-muted-foreground">
          {new Date(currentTime)?.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
      <div className="space-y-2">
        {schedule?.map((slot, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(
              slot?.status
            )} ${
              isCurrentSlot(slot?.startTime, slot?.endTime)
                ? "ring-2 ring-accent"
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon
                  name={
                    slot?.status === "occupied"
                      ? "Users"
                      : slot?.status === "reserved"
                      ? "Clock"
                      : "CheckCircle2"
                  }
                  size={16}
                />
                <span className="font-medium text-sm">
                  {formatTime(slot?.startTime)} - {formatTime(slot?.endTime)}
                </span>
              </div>
              <span className="text-xs font-medium uppercase">
                {slot?.status}
              </span>
            </div>

            {slot?.bookedBy && (
              <div className="flex items-center gap-2 text-sm">
                <Icon name="User" size={14} />
                <span className="text-muted-foreground">{slot?.bookedBy}</span>
              </div>
            )}

            {slot?.purpose && (
              <p className="text-sm text-muted-foreground mt-1">
                {slot?.purpose}
              </p>
            )}

            {isCurrentSlot(slot?.startTime, slot?.endTime) && (
              <div className="mt-2 pt-2 border-t border-current/20">
                <span className="text-xs font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  Currently Active
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailySchedule;
