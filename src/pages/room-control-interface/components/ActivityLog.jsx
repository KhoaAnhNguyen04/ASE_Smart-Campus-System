import React from "react";
import Icon from "../../../components/AppIcon";

const ActivityLog = ({ activities }) => {
  const getActionIcon = (action) => {
    const icons = {
      lock: "Lock",
      unlock: "Unlock",
      device_on: "Power",
      device_off: "PowerOff",
      override: "AlertTriangle",
      lockdown: "ShieldAlert",
    };
    return icons?.[action] || "Activity";
  };

  const getActionColor = (action) => {
    const colors = {
      lock: "text-success",
      unlock: "text-warning",
      device_on: "text-success",
      device_off: "text-muted-foreground",
      override: "text-error",
      lockdown: "text-destructive",
    };
    return colors?.[action] || "text-foreground";
  };

  const getActionBg = (action) => {
    const backgrounds = {
      lock: "bg-success/10",
      unlock: "bg-warning/10",
      device_on: "bg-success/10",
      device_off: "bg-muted/50",
      override: "bg-error/10",
      lockdown: "bg-destructive/10",
    };
    return backgrounds?.[action] || "bg-muted/50";
  };

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffMinutes = Math.floor((now - activityDate) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return activityDate?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getActionLabel = (action) => {
    const labels = {
      lock: "Door Locked",
      unlock: "Door Unlocked",
      device_on: "Devices Turned On",
      device_off: "Devices Turned Off",
      override: "Emergency Override",
      lockdown: "Building Lockdown",
    };
    return labels?.[action] || action;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 card-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <Icon name="History" size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Activity Log
          </h2>
          <p className="text-sm text-muted-foreground">
            Recent control actions and events
          </p>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon
              name="Inbox"
              size={48}
              className="text-muted-foreground mx-auto mb-3 opacity-50"
            />
            <p className="text-sm text-muted-foreground">
              No recent activities
            </p>
          </div>
        ) : (
          activities?.map((activity) => (
            <div
              key={activity?.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg ${getActionBg(
                  activity?.action
                )} flex items-center justify-center flex-shrink-0`}
              >
                <Icon
                  name={getActionIcon(activity?.action)}
                  size={16}
                  className={getActionColor(activity?.action)}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground">
                    {getActionLabel(activity?.action)}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(activity?.timestamp)}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-1">
                  {activity?.roomName}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="User" size={12} />
                  <span>{activity?.administrator}</span>
                  {activity?.success && (
                    <span className="inline-flex items-center gap-1 text-success">
                      <Icon name="CheckCircle2" size={12} />
                      Success
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
