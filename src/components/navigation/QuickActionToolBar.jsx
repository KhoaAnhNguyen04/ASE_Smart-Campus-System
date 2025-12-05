import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";

const QuickActionToolbar = ({
  userRole = "student",
  currentContext = "dashboard",
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const getContextualActions = () => {
    const actions = {
      student: [
        {
          id: "quick-book",
          label: "Quick Book",
          icon: "Plus",
          action: () => navigate("/new-booking"),
          variant: "default",
          priority: 1,
        },
        {
          id: "my-bookings",
          label: "My Bookings",
          icon: "Calendar",
          action: () => navigate("/my-bookings"),
          variant: "outline",
          priority: 2,
        },
      ],
      lecturer: [
        {
          id: "quick-book",
          label: "Book Room",
          icon: "Plus",
          action: () => navigate("/new-booking"),
          variant: "default",
          priority: 1,
        },
        {
          id: "recurring",
          label: "Recurring",
          icon: "Repeat",
          action: () => navigate("/new-booking?type=recurring"),
          variant: "outline",
          priority: 2,
        },
        {
          id: "my-schedule",
          label: "Schedule",
          icon: "CalendarDays",
          action: () => navigate("/my-bookings"),
          variant: "outline",
          priority: 3,
        },
      ],
      security: [
        {
          id: "emergency-override",
          label: "Override",
          icon: "AlertTriangle",
          action: () => handleEmergencyOverride(),
          variant: "destructive",
          priority: 1,
        },
        {
          id: "room-control",
          label: "Control",
          icon: "Shield",
          action: () => navigate("/room-control-interface"),
          variant: "default",
          priority: 2,
        },
        {
          id: "live-status",
          label: "Live Status",
          icon: "Activity",
          action: () => navigate("/room-control-interface?view=live"),
          variant: "outline",
          priority: 3,
        },
      ],
      admin: [
        {
          id: "quick-book",
          label: "Book Room",
          icon: "Plus",
          action: () => navigate("/new-booking"),
          variant: "default",
          priority: 1,
        },
        {
          id: "room-control",
          label: "Control",
          icon: "Settings",
          action: () => navigate("/room-control-interface"),
          variant: "outline",
          priority: 2,
        },
        {
          id: "reports",
          label: "Reports",
          icon: "BarChart3",
          action: () => navigate("/reports"),
          variant: "outline",
          priority: 3,
        },
      ],
    };

    return actions?.[userRole] || actions?.student;
  };

  const handleEmergencyOverride = () => {
    const confirmed = window.confirm(
      "Emergency override will unlock all rooms. Continue?"
    );
    if (confirmed) {
      console.log("Emergency override activated");
    }
  };

  const actions = getContextualActions();
  const primaryActions = actions?.filter((a) => a?.priority === 1);
  const secondaryActions = actions?.filter((a) => a?.priority > 1);

  const visibleActions = isExpanded ? actions : primaryActions;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      <div className="flex flex-col-reverse gap-2 lg:flex-row lg:gap-3">
        {visibleActions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            onClick={action?.action}
            iconName={action?.icon}
            iconPosition="left"
            className="shadow-lg hover-lift"
          >
            <span className="hidden lg:inline">{action?.label}</span>
          </Button>
        ))}
      </div>
      {secondaryActions?.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronDown" : "ChevronUp"}
          iconPosition="left"
          className="lg:hidden"
        >
          {isExpanded ? "Less" : "More"}
        </Button>
      )}
    </div>
  );
};

export default QuickActionToolbar;
