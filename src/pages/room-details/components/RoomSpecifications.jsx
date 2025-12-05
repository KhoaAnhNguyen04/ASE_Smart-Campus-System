import React from "react";
import Icon from "../../../components/AppIcon";

const RoomSpecifications = ({ room }) => {
  const specifications = [
    {
      icon: "Users",
      label: "Capacity",
      value: `${room?.capacity} people`,
      color: "text-primary",
    },
    {
      icon: "Maximize2",
      label: "Area",
      value: room?.area,
      color: "text-accent",
    },
    {
      icon: "Thermometer",
      label: "Climate",
      value: room?.climate,
      color: "text-success",
    },
    {
      icon: "Lightbulb",
      label: "Lighting",
      value: room?.lighting,
      color: "text-warning",
    },
  ];

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Info" size={20} />
        Room Specifications
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {specifications?.map((spec, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
          >
            <div className={`p-2 rounded-lg bg-background ${spec?.color}`}>
              <Icon name={spec?.icon} size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{spec?.label}</p>
              <p className="text-base font-medium text-foreground">
                {spec?.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      {room?.accessibility && room?.accessibility?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Icon name="Accessibility" size={16} />
            Accessibility Features
          </h3>
          <div className="flex flex-wrap gap-2">
            {room?.accessibility?.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
              >
                <Icon name="Check" size={14} />
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSpecifications;
