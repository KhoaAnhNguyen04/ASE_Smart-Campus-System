import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RoomStatusCard = ({ room, onLockToggle, onDeviceToggle, onOverride }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      locked: "text-success",
      unlocked: "text-warning",
      on: "text-success",
      off: "text-muted-foreground",
    };
    return colors?.[status] || "text-muted-foreground";
  };

  const getStatusBg = (status) => {
    const backgrounds = {
      locked: "bg-success/10",
      unlocked: "bg-warning/10",
      on: "bg-success/10",
      off: "bg-muted/50",
    };
    return backgrounds?.[status] || "bg-muted/50";
  };

  const formatTime = (date) => {
    return new Date(date)?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-5 card-shadow hover-lift transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground">
              {room?.name}
            </h3>
            {room?.occupancyCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/10 text-error text-xs font-medium">
                <Icon name="Users" size={12} />
                {room?.occupancyCount}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Capacity: {room?.capacity} people
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`p-3 rounded-lg ${getStatusBg(room?.doorStatus)}`}>
          <div className="flex items-center gap-2 mb-1">
            <Icon
              name={room?.doorStatus === "locked" ? "Lock" : "Unlock"}
              size={16}
              className={getStatusColor(room?.doorStatus)}
            />
            <span className="text-xs font-medium text-muted-foreground">
              Door
            </span>
          </div>
          <p
            className={`text-sm font-semibold capitalize ${getStatusColor(
              room?.doorStatus
            )}`}
          >
            {room?.doorStatus}
          </p>
        </div>

        <div className={`p-3 rounded-lg ${getStatusBg(room?.deviceStatus)}`}>
          <div className="flex items-center gap-2 mb-1">
            <Icon
              name="Zap"
              size={16}
              className={getStatusColor(room?.deviceStatus)}
            />
            <span className="text-xs font-medium text-muted-foreground">
              Devices
            </span>
          </div>
          <p
            className={`text-sm font-semibold capitalize ${getStatusColor(
              room?.deviceStatus
            )}`}
          >
            {room?.deviceStatus}
          </p>
        </div>
      </div>
      {isExpanded && (
        <div className="mb-4 p-3 bg-muted/30 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Activity:</span>
            <span className="font-medium text-foreground">
              {formatTime(room?.lastActivity)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Equipment:</span>
            <span className="font-medium text-foreground">
              {room?.equipment?.join(", ")}
            </span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={room?.doorStatus === "locked" ? "outline" : "default"}
          size="sm"
          onClick={() => onLockToggle(room?.id, room?.doorStatus)}
          iconName={room?.doorStatus === "locked" ? "Unlock" : "Lock"}
          iconPosition="left"
          fullWidth
        >
          {room?.doorStatus === "locked" ? "Unlock" : "Lock"}
        </Button>

        <Button
          variant={room?.deviceStatus === "on" ? "outline" : "default"}
          size="sm"
          onClick={() => onDeviceToggle(room?.id, room?.deviceStatus)}
          iconName={room?.deviceStatus === "on" ? "PowerOff" : "Power"}
          iconPosition="left"
          fullWidth
        >
          {room?.deviceStatus === "on" ? "Turn Off" : "Turn On"}
        </Button>
      </div>
      {room?.occupancyCount > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onOverride(room?.id)}
          iconName="AlertTriangle"
          iconPosition="left"
          fullWidth
          className="mt-2"
        >
          Emergency Override
        </Button>
      )}
    </div>
  );
};

export default RoomStatusCard;
