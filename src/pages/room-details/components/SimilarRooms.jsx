import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const SimilarRooms = ({ rooms }) => {
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    const configs = {
      available: {
        color: "text-success",
        bgColor: "bg-success/10",
        label: "Available",
      },
      occupied: {
        color: "text-error",
        bgColor: "bg-error/10",
        label: "In Use",
      },
      reserved: {
        color: "text-warning",
        bgColor: "bg-warning/10",
        label: "Reserved",
      },
    };
    return configs?.[status] || configs?.available;
  };

  const handleViewRoom = (roomId) => {
    navigate(`/room-details?id=${roomId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Grid3x3" size={20} />
        Similar Rooms
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms?.map((room) => {
          const statusConfig = getStatusConfig(room?.status);
          return (
            <div
              key={room?.id}
              className="bg-muted/50 rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all hover-lift"
            >
              <div className="relative h-32 overflow-hidden">
                <Image
                  src={room?.image}
                  alt={room?.imageAlt}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.bgColor} ${statusConfig?.color}`}
                >
                  {statusConfig?.label}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-1">
                  {room?.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {room?.building} • Floor {room?.floor}
                </p>

                <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon name="Users" size={14} />
                    <span>{room?.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Package" size={14} />
                    <span>{room?.equipmentCount} items</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => handleViewRoom(room?.id)}
                >
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimilarRooms;
