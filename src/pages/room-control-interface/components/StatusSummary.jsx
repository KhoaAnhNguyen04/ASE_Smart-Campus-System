import React from "react";
import Icon from "../../../components/AppIcon";

const StatusSummary = ({ summary }) => {
  const stats = [
    {
      label: "Total Rooms",
      value: summary?.totalRooms,
      icon: "Building2",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Locked",
      value: summary?.lockedRooms,
      icon: "Lock",
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Unlocked",
      value: summary?.unlockedRooms,
      icon: "Unlock",
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Occupied",
      value: summary?.occupiedRooms,
      icon: "Users",
      color: "text-error",
      bg: "bg-error/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats?.map((stat) => (
        <div
          key={stat?.label}
          className="bg-card rounded-lg border border-border p-4 card-shadow"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg ${stat?.bg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-foreground">
                {stat?.value}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {stat?.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusSummary;
