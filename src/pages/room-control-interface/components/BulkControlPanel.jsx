import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const BulkControlPanel = ({
  selectedRooms,
  onBulkLockdown,
  onBulkDeviceControl,
}) => {
  const [isConfirmingLockdown, setIsConfirmingLockdown] = useState(false);

  const handleLockdown = () => {
    if (!isConfirmingLockdown) {
      setIsConfirmingLockdown(true);
      setTimeout(() => setIsConfirmingLockdown(false), 5000);
      return;
    }
    onBulkLockdown();
    setIsConfirmingLockdown(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 card-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
          <Icon name="Layers" size={20} className="text-warning" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Bulk Controls
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage multiple rooms simultaneously
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Selected Rooms
            </span>
            <span className="text-lg font-bold text-primary">
              {selectedRooms}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Actions will apply to all rooms in current selection
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => onBulkDeviceControl("off")}
            iconName="PowerOff"
            iconPosition="left"
            disabled={selectedRooms === 0}
            fullWidth
          >
            Turn Off All Devices
          </Button>

          <Button
            variant="outline"
            onClick={() => onBulkDeviceControl("on")}
            iconName="Power"
            iconPosition="left"
            disabled={selectedRooms === 0}
            fullWidth
          >
            Turn On All Devices
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20 mb-3">
            <div className="flex items-start gap-2">
              <Icon
                name="AlertTriangle"
                size={16}
                className="text-destructive mt-0.5"
              />
              <div>
                <p className="text-sm font-medium text-destructive">
                  Emergency Lockdown
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Locks all doors and disables devices in selected area
                </p>
              </div>
            </div>
          </div>

          <Button
            variant={isConfirmingLockdown ? "destructive" : "outline"}
            onClick={handleLockdown}
            iconName="ShieldAlert"
            iconPosition="left"
            disabled={selectedRooms === 0}
            fullWidth
          >
            {isConfirmingLockdown
              ? "Click Again to Confirm"
              : "Initiate Lockdown"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkControlPanel;
