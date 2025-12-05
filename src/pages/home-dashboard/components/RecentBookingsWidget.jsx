import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RecentBookingsWidget = () => {
  const navigate = useNavigate();

  const mockBookings = [
    {
      id: "BK001",
      room: "R150 - Study Room 5",
      building: "Library",
      date: "2025-12-06",
      startTime: "10:00",
      endTime: "12:00",
      status: "confirmed",
      purpose: "Group Study Session",
    },
    {
      id: "BK002",
      room: "R310 - Conference Room",
      building: "Administration",
      date: "2025-12-08",
      startTime: "14:00",
      endTime: "16:00",
      status: "confirmed",
      purpose: "Project Meeting",
    },
    {
      id: "BK003",
      room: "R205 - Computer Lab 2",
      building: "Engineering Block",
      date: "2025-12-10",
      startTime: "09:00",
      endTime: "11:00",
      status: "pending",
      purpose: "Coding Workshop",
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: {
        color: "text-success",
        bgColor: "bg-success/10",
        icon: "CheckCircle2",
        label: "Confirmed",
      },
      pending: {
        color: "text-warning",
        bgColor: "bg-warning/10",
        icon: "Clock",
        label: "Pending",
      },
      cancelled: {
        color: "text-error",
        bgColor: "bg-error/10",
        icon: "XCircle",
        label: "Cancelled",
      },
    };
    return configs?.[status] || configs?.confirmed;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Recent Bookings
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/my-bookings")}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      <div className="space-y-3">
        {mockBookings?.map((booking) => {
          const statusConfig = getStatusConfig(booking?.status);
          return (
            <div
              key={booking?.id}
              className="p-4 bg-background border border-border rounded-lg hover:shadow-md hover-lift transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {booking?.room}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {booking?.purpose}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig?.bgColor} ${statusConfig?.color} flex items-center gap-1`}
                >
                  <Icon name={statusConfig?.icon} size={12} />
                  {statusConfig?.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1.5">
                  <Icon name="Calendar" size={14} />
                  <span>{formatDate(booking?.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon name="Clock" size={14} />
                  <span>
                    {booking?.startTime} - {booking?.endTime}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Icon name="MapPin" size={14} />
                <span>{booking?.building}</span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `/room-details?id=${booking?.room?.split(" - ")?.[0]}`
                    )
                  }
                  iconName="Eye"
                  iconPosition="left"
                  className="flex-1"
                >
                  View Details
                </Button>
                {booking?.status === "confirmed" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log("Cancel booking:", booking?.id)}
                    iconName="X"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentBookingsWidget;
