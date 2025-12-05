import React from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const BookingConfirmation = ({
  bookingDetails,
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  const calculateDuration = () => {
    if (bookingDetails?.startTime && bookingDetails?.endTime) {
      const [startHour, startMin] = bookingDetails?.startTime
        ?.split(":")
        ?.map(Number);
      const [endHour, endMin] = bookingDetails?.endTime
        ?.split(":")
        ?.map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const duration = endMinutes - startMinutes;

      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours}h ${minutes}m`;
    }
    return "N/A";
  };

  const formatTime = (time) => {
    const [hour, minute] = time?.split(":")?.map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute?.toString()?.padStart(2, "0")} ${period}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon name="FileCheck" size={20} color="var(--color-accent)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Confirm Your Booking
          </h3>
          <p className="text-sm text-muted-foreground">
            Review the details before confirming
          </p>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
          <Icon name="DoorOpen" size={20} color="var(--color-primary)" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Room</p>
            <p className="text-sm font-medium text-foreground">
              {bookingDetails?.roomName}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
          <Icon name="Calendar" size={20} color="var(--color-primary)" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Date</p>
            <p className="text-sm font-medium text-foreground">
              {formatDate(bookingDetails?.date)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <Icon name="Clock" size={20} color="var(--color-primary)" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Start Time</p>
              <p className="text-sm font-medium text-foreground">
                {formatTime(bookingDetails?.startTime)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <Icon name="Clock" size={20} color="var(--color-primary)" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">End Time</p>
              <p className="text-sm font-medium text-foreground">
                {formatTime(bookingDetails?.endTime)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10">
          <Icon name="Timer" size={20} color="var(--color-accent)" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Total Duration</p>
            <p className="text-sm font-semibold text-accent">
              {calculateDuration()}
            </p>
          </div>
        </div>

        {bookingDetails?.description && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <Icon name="FileText" size={20} color="var(--color-primary)" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-foreground">
                {bookingDetails?.description}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} color="var(--color-warning)" />
          <div className="flex-1">
            <p className="text-sm font-medium text-warning mb-1">
              Booking Policies
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                • Bookings can be cancelled up to 2 hours before start time
              </li>
              <li>• Maximum booking duration is 4 hours per session</li>
              <li>
                • Late arrivals beyond 15 minutes may result in automatic
                cancellation
              </li>
              <li>
                • Please ensure room is left clean and equipment is turned off
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          iconName="X"
          iconPosition="left"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="default"
          iconName="Check"
          iconPosition="right"
          onClick={onConfirm}
          loading={isProcessing}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
