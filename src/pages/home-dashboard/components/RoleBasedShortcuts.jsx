import React from "react";
import QuickActionCard from "./QuickActionCard";

const RoleBasedShortcuts = ({ userRole = "student" }) => {
  const shortcuts = {
    student: [
      {
        title: "Book Study Room",
        description:
          "Reserve a quiet space for individual or group study sessions",
        icon: "BookOpen",
        iconColor: "var(--color-primary)",
        bgColor: "bg-primary/10",
        path: "/new-booking",
        badge: "Quick",
      },
      {
        title: "Find Available Rooms",
        description:
          "Search for rooms available right now or at specific times",
        icon: "Search",
        iconColor: "var(--color-accent)",
        bgColor: "bg-accent/10",
        path: "/room-search",
      },
      {
        title: "My Class Schedule",
        description: "View your upcoming classes and room assignments",
        icon: "Calendar",
        iconColor: "var(--color-success)",
        bgColor: "bg-success/10",
        path: "/my-bookings",
      },
      {
        title: "Campus Map",
        description:
          "Navigate to your booked rooms with interactive campus map",
        icon: "Map",
        iconColor: "var(--color-secondary)",
        bgColor: "bg-secondary/10",
        path: "/room-search",
      },
    ],
    lecturer: [
      {
        title: "Quick Room Booking",
        description: "Book meeting rooms, labs, or lecture halls instantly",
        icon: "Plus",
        iconColor: "var(--color-primary)",
        bgColor: "bg-primary/10",
        path: "/new-booking",
        badge: "Fast",
      },
      {
        title: "Recurring Bookings",
        description: "Set up weekly or monthly recurring room reservations",
        icon: "Repeat",
        iconColor: "var(--color-accent)",
        bgColor: "bg-accent/10",
        path: "/new-booking",
      },
      {
        title: "My Teaching Schedule",
        description: "Manage your lectures, office hours, and meeting rooms",
        icon: "CalendarDays",
        iconColor: "var(--color-success)",
        bgColor: "bg-success/10",
        path: "/my-bookings",
      },
      {
        title: "Room Equipment",
        description: "Check available equipment and facilities in each room",
        icon: "Monitor",
        iconColor: "var(--color-warning)",
        bgColor: "bg-warning/10",
        path: "/room-search",
      },
    ],
    admin: [
      {
        title: "System Overview",
        description: "View real-time statistics and campus-wide room usage",
        icon: "BarChart3",
        iconColor: "var(--color-primary)",
        bgColor: "bg-primary/10",
        path: "/home-dashboard",
        badge: "Live",
      },
      {
        title: "Usage Reports",
        description: "Generate detailed reports on room utilization and trends",
        icon: "FileText",
        iconColor: "var(--color-accent)",
        bgColor: "bg-accent/10",
        path: "/home-dashboard",
      },
      {
        title: "Room Management",
        description: "Configure rooms, equipment, and booking policies",
        icon: "Settings",
        iconColor: "var(--color-secondary)",
        bgColor: "bg-secondary/10",
        path: "/room-control-interface",
      },
      {
        title: "User Management",
        description: "Manage user accounts, roles, and access permissions",
        icon: "Users",
        iconColor: "var(--color-success)",
        bgColor: "bg-success/10",
        path: "/home-dashboard",
      },
    ],
    security: [
      {
        title: "Live Monitoring",
        description:
          "Real-time view of all occupied rooms and occupancy levels",
        icon: "Activity",
        iconColor: "var(--color-primary)",
        bgColor: "bg-primary/10",
        path: "/room-control-interface",
        badge: "Live",
      },
      {
        title: "Room Control",
        description: "Remote access control for doors and room devices",
        icon: "Shield",
        iconColor: "var(--color-error)",
        bgColor: "bg-error/10",
        path: "/room-control-interface",
      },
      {
        title: "After-Hours Alerts",
        description: "Monitor and respond to unauthorized room access",
        icon: "AlertTriangle",
        iconColor: "var(--color-warning)",
        bgColor: "bg-warning/10",
        path: "/room-control-interface",
      },
      {
        title: "Emergency Override",
        description: "Quick access to emergency unlock and evacuation controls",
        icon: "Unlock",
        iconColor: "var(--color-accent)",
        bgColor: "bg-accent/10",
        path: "/room-control-interface",
      },
    ],
  };

  const roleShortcuts = shortcuts?.[userRole] || shortcuts?.student;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {roleShortcuts?.map((shortcut, index) => (
        <QuickActionCard key={index} {...shortcut} />
      ))}
    </div>
  );
};

export default RoleBasedShortcuts;
