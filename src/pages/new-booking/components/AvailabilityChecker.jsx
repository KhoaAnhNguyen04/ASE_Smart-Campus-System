import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const AvailabilityChecker = ({
  status = "checking",
  conflictDetails = null,
  alternativeSlots = [],
  alternativeRooms = [],
  onSelectAlternative,
  onProceedAnyway,
}) => {
  if (status === "checking") {
    return (
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center animate-pulse">
            <Icon name="Search" size={32} color="var(--color-accent)" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Checking Availability
            </h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we verify room availability...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "available") {
    return (
      <div className="bg-card rounded-lg border border-success p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
            <Icon name="CheckCircle2" size={24} color="var(--color-success)" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-success mb-2">
              Room Available!
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              The selected room is available for your requested time slot. You
              can proceed with the booking.
            </p>
            <Button
              variant="success"
              iconName="Calendar"
              iconPosition="right"
              onClick={onProceedAnyway}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "conflict") {
    return (
      <div className="space-y-6">
        <div className="bg-card rounded-lg border border-warning p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
              <Icon
                name="AlertTriangle"
                size={24}
                color="var(--color-warning)"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-warning mb-2">
                Time Conflict Detected
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {conflictDetails ||
                  "The selected room is already booked during your requested time."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => window.location?.reload()}
                >
                  Try Different Time
                </Button>
              </div>
            </div>
          </div>
        </div>
        {alternativeSlots?.length > 0 && (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Clock" size={20} color="var(--color-accent)" />
              <h4 className="text-base font-semibold text-foreground">
                Alternative Time Slots
              </h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              The same room is available at these times on your selected date:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {alternativeSlots?.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => onSelectAlternative("time", slot)}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="Clock" size={16} color="var(--color-accent)" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        {slot?.startTime} - {slot?.endTime}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Duration: {slot?.duration}
                      </p>
                    </div>
                  </div>
                  <Icon
                    name="ChevronRight"
                    size={16}
                    color="var(--color-muted-foreground)"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
        {alternativeRooms?.length > 0 && (
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="Building2" size={20} color="var(--color-accent)" />
              <h4 className="text-base font-semibold text-foreground">
                Similar Available Rooms
              </h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              These rooms have similar capacity and equipment for your requested
              time:
            </p>
            <div className="space-y-3">
              {alternativeRooms?.map((room, index) => (
                <button
                  key={index}
                  onClick={() => onSelectAlternative("room", room)}
                  className="w-full flex items-start justify-between p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all duration-200"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon
                        name="DoorOpen"
                        size={20}
                        color="var(--color-primary)"
                      />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-foreground mb-1">
                        {room?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {room?.building} • Floor {room?.floor} • Capacity:{" "}
                        {room?.capacity}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {room?.equipment?.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-xs text-accent"
                          >
                            <Icon name="Check" size={12} />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Icon
                    name="ChevronRight"
                    size={16}
                    color="var(--color-muted-foreground)"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default AvailabilityChecker;
