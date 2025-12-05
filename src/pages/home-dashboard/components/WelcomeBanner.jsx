import React from "react";
import Icon from "../../../components/AppIcon";

const WelcomeBanner = ({ userName = "Student", userRole = "student" }) => {
  const currentHour = new Date()?.getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const roleLabels = {
    student: "Student",
    lecturer: "Lecturer",
    admin: "Administrator",
    security: "Security Personnel",
  };

  const currentDate = new Date()?.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-border rounded-lg p-8 mb-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-foreground">
                {greeting}, {userName}
              </h1>
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
                {roleLabels?.[userRole]}
              </span>
            </div>
            <p className="text-muted-foreground">{currentDate}</p>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Quick Stats</p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">3</p>
                  <p className="text-xs text-muted-foreground">Bookings</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">12</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon name="Calendar" size={16} />
            <span>Week 49 of 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={16} />
            <span>
              {new Date()?.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="MapPin" size={16} />
            <span>Main Campus</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
