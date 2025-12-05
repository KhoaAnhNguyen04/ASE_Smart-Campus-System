import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Image from "../../../components/AppImage";

const RoomListItem = ({ room }) => {
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
    navigate("/room-details", { state: { roomId: room?.id } });
  };

  const handleBookNow = () => {
    navigate("/new-booking", {
      state: { roomId: room?.id, roomName: room?.name },
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden hover-lift transition-all duration-200">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden flex-shrink-0">
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

        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {room?.name}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1.5">
                  <Icon name="MapPin" size={16} />
                  <span>
                    {room?.building} - Floor {room?.floor}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon name="Users" size={16} />
                  <span className="text-foreground font-medium">
                    {room?.capacity} people
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon name="Layers" size={16} />
                  <span>Room {room?.roomNumber}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {room?.equipment?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
                  >
                    <Icon name={item?.icon} size={12} />
                    <span>{item?.name}</span>
                  </div>
                ))}
              </div>

              {room?.nextAvailable && (
                <p className="text-sm text-muted-foreground">
                  Next available:{" "}
                  <span className="font-medium text-foreground">
                    {room?.nextAvailable}
                  </span>
                </p>
              )}
            </div>

            <div className="flex md:flex-col gap-2 md:w-40">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
                iconName="Eye"
                iconPosition="left"
                fullWidth
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
                fullWidth
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomListItem;
