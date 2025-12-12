import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Image from "../../../components/AppImage";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    const configs = {
      free: {
        label: "Available",
        color: "text-success",
        bgColor: "bg-success/10",
        icon: "CheckCircle2",
      },
      "in-use": {
        label: "In Use",
        color: "text-error",
        bgColor: "bg-error/10",
        icon: "XCircle",
      },
      reserved: {
        label: "Reserved",
        color: "text-warning",
        bgColor: "bg-warning/10",
        icon: "Clock",
      },
    };
    return configs?.[status] || configs?.free;
  };

  const statusConfig = getStatusConfig(room?.status);

  const handleViewDetails = () => {
    navigate(`/room-details/${room?.id}`);
  };

  const handleBookNow = () => {
    navigate("/new-booking", {
      state: { roomId: room?.id, roomName: room?.name },
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover-lift transition-all duration-200">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={room?.image}
          alt={room?.imageAlt}
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute top-3 right-3 px-3 py-1.5 rounded-full ${statusConfig?.bgColor} backdrop-blur-sm`}
        >
          <div className="flex items-center gap-1.5">
            <Icon
              name={statusConfig?.icon}
              size={16}
              className={statusConfig?.color}
            />
            <span className={`text-xs font-medium ${statusConfig?.color}`}>
              {statusConfig?.label}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {room?.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="MapPin" size={14} />
            <span>
              {room?.building} - Floor {room?.floor}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Icon name="Users" size={16} className="text-muted-foreground" />
            <span className="text-foreground font-medium">
              {room?.capacity}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon name="Layers" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">
              Room {room?.roomNumber}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {room?.equipment?.slice(0, 4)?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
            >
              <Icon name={item?.icon} size={12} />
              <span>{item?.name}</span>
            </div>
          ))}
          {room?.equipment?.length > 4 && (
            <div className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
              +{room?.equipment?.length - 4} more
            </div>
          )}
        </div>

        {room?.nextAvailable && (
          <p className="text-xs text-muted-foreground mb-4">
            Next available: {room?.nextAvailable}
          </p>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            iconName="Eye"
            iconPosition="left"
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleBookNow}
            disabled={room?.status !== "free"}
            iconName="Calendar"
            iconPosition="left"
            className="flex-1"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
