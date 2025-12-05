import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const BookingSuccess = ({ bookingReference, bookingDetails }) => {
  const navigate = useNavigate();

  const formatTime = (time) => {
    const [hour, minute] = time?.split(":")?.map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute?.toString()?.padStart(2, "0")} ${period}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleAddToCalendar = () => {
    const event = {
      title: `Room Booking - ${bookingDetails?.roomName}`,
      description: bookingDetails?.description || "Room booking",
      location: bookingDetails?.roomName,
      startDate: bookingDetails?.date,
      startTime: bookingDetails?.startTime,
      endTime: bookingDetails?.endTime,
    };

    console.log("Add to calendar:", event);
    alert("Calendar integration would be implemented here");
  };

  const handleDownloadConfirmation = () => {
    console.log("Download confirmation for:", bookingReference);
    alert("PDF download would be implemented here");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card rounded-lg border border-success p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckCircle2" size={40} color="var(--color-success)" />
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-muted-foreground mb-6">
          Your room has been successfully booked
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 mb-8">
          <Icon name="Hash" size={16} color="var(--color-accent)" />
          <span className="text-sm font-mono font-semibold text-accent">
            {bookingReference}
          </span>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Booking Details
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Room</span>
              <span className="text-sm font-medium text-foreground">
                {bookingDetails?.roomName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="text-sm font-medium text-foreground">
                {formatDate(bookingDetails?.date)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Time</span>
              <span className="text-sm font-medium text-foreground">
                {formatTime(bookingDetails?.startTime)} -{" "}
                {formatTime(bookingDetails?.endTime)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button
            variant="outline"
            iconName="Calendar"
            iconPosition="left"
            onClick={handleAddToCalendar}
            className="flex-1"
          >
            Add to Calendar
          </Button>

          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={handleDownloadConfirmation}
            className="flex-1"
          >
            Download Confirmation
          </Button>
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3 text-left">
            <Icon name="Info" size={20} color="var(--color-accent)" />
            <div className="flex-1">
              <p className="text-sm font-medium text-accent mb-1">
                Important Reminders
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Please arrive on time to avoid automatic cancellation</li>
                <li>
                  • A confirmation email has been sent to your registered email
                </li>
                <li>
                  • You can view or cancel this booking from "My Bookings"
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            iconName="Calendar"
            iconPosition="left"
            onClick={() => navigate("/my-bookings")}
            className="flex-1"
          >
            View My Bookings
          </Button>

          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => window.location?.reload()}
            className="flex-1"
          >
            Book Another Room
          </Button>
        </div>
      </div>
      <div className="mt-6 text-center">
        <Button
          variant="ghost"
          iconName="Home"
          iconPosition="left"
          onClick={() => navigate("/home-dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default BookingSuccess;
