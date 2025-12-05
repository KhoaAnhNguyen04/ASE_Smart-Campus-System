import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RoomHeader = ({ room, onBookRoom, userRole }) => {
  const getStatusConfig = (status) => {
    const configs = {
      available: {
        icon: "CheckCircle2",
        color: "text-success",
        bgColor: "bg-success/10",
        label: "Available Now",
      },
      occupied: {
        icon: "Users",
        color: "text-error",
        bgColor: "bg-error/10",
        label: "Currently In Use",
      },
      reserved: {
        icon: "Clock",
        color: "text-warning",
        bgColor: "bg-warning/10",
        label: "Reserved",
      },
    };
    return configs?.[status] || configs?.available;
  };

  const statusConfig = getStatusConfig(room?.status);

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="DoorOpen" size={24} color="var(--color-primary)" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">
                {room?.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Building2" size={16} />
                <span>{room?.building}</span>
                <span className="text-border">•</span>
                <span>Floor {room?.floor}</span>
                <span className="text-border">•</span>
                <span>Room {room?.roomNumber}</span>
              </div>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig?.bgColor} ${statusConfig?.color}`}
          >
            <Icon name={statusConfig?.icon} size={16} />
            <span>{statusConfig?.label}</span>
          </div>
        </div>

        {(userRole === "lecturer" || userRole === "admin") &&
          room?.status === "available" && (
            <Button
              variant="default"
              size="lg"
              iconName="Calendar"
              iconPosition="left"
              onClick={onBookRoom}
              className="w-full lg:w-auto"
            >
              Book This Room
            </Button>
          )}
      </div>
    </div>
  );
};

export default RoomHeader;
