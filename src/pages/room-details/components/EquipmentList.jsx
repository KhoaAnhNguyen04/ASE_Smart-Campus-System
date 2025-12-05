import React from "react";
import Icon from "../../../components/AppIcon";

const EquipmentList = ({ equipment }) => {
  const getEquipmentIcon = (name) => {
    const iconMap = {
      Projector: "Projector",
      Whiteboard: "PenTool",
      "Smart Board": "Monitor",
      "Audio System": "Volume2",
      "Video Conferencing": "Video",
      Computer: "Laptop",
      "Document Camera": "Camera",
      Microphone: "Mic",
      WiFi: "Wifi",
      "HDMI Cables": "Cable",
      "Power Outlets": "Plug",
      "Air Conditioning": "Wind",
    };
    return iconMap?.[name] || "Box";
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Package" size={20} />
        Available Equipment
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {equipment?.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon
                name={getEquipmentIcon(item)}
                size={18}
                color="var(--color-primary)"
              />
            </div>
            <span className="text-sm font-medium text-foreground">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentList;
