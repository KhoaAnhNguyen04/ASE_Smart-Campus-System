import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RoomLocation = ({ location }) => {
  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${location?.latitude},${location?.longitude}`,
      "_blank"
    );
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="MapPin" size={20} />
          Location
        </h2>
        <Button
          variant="outline"
          size="sm"
          iconName="Navigation"
          iconPosition="left"
          onClick={handleGetDirections}
        >
          Get Directions
        </Button>
      </div>
      <div className="space-y-4">
        <div className="w-full h-64 rounded-lg overflow-hidden border border-border">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title={`${location?.building} - ${location?.roomName}`}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${location?.latitude},${location?.longitude}&z=17&output=embed`}
            className="w-full h-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Icon name="Building2" size={18} className="text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Building</p>
              <p className="text-sm font-medium text-foreground">
                {location?.building}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Icon name="Layers" size={18} className="text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Floor</p>
              <p className="text-sm font-medium text-foreground">
                Floor {location?.floor}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Icon name="MapPin" size={18} className="text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Wing/Section</p>
              <p className="text-sm font-medium text-foreground">
                {location?.wing}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Icon name="Navigation" size={18} className="text-primary mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Nearest Entrance</p>
              <p className="text-sm font-medium text-foreground">
                {location?.nearestEntrance}
              </p>
            </div>
          </div>
        </div>

        {location?.directions && (
          <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Icon name="Route" size={16} />
              How to Get There
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {location?.directions}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomLocation;
