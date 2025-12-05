import React, { useState, useEffect } from "react";
import Icon from "../AppIcon";

const RealTimeStatusIndicator = ({
  showDetailed = false,
  position = "sidebar",
}) => {
  const [connectionStatus, setConnectionStatus] = useState("connected");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [pendingUpdates, setPendingUpdates] = useState(0);

  useEffect(() => {
    const simulateWebSocket = () => {
      const statuses = ["connected", "reconnecting", "connected"];
      let statusIndex = 0;
      let updateCount = 0;

      const statusInterval = setInterval(() => {
        setConnectionStatus(statuses?.[statusIndex % statuses?.length]);
        statusIndex++;
      }, 8000);

      const updateInterval = setInterval(() => {
        setLastUpdate(new Date());
        updateCount++;
        setPendingUpdates(Math.floor(Math.random() * 3));
      }, 3000);

      return () => {
        clearInterval(statusInterval);
        clearInterval(updateInterval);
      };
    };

    const cleanup = simulateWebSocket();
    return cleanup;
  }, []);

  const getStatusConfig = () => {
    const configs = {
      connected: {
        icon: "Wifi",
        color: "text-success",
        bgColor: "bg-success/10",
        label: "Connected",
      },
      reconnecting: {
        icon: "WifiOff",
        color: "text-warning",
        bgColor: "bg-warning/10",
        label: "Reconnecting",
      },
      disconnected: {
        icon: "WifiOff",
        color: "text-error",
        bgColor: "bg-error/10",
        label: "Disconnected",
      },
    };
    return configs?.[connectionStatus] || configs?.connected;
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const config = getStatusConfig();

  if (position === "sidebar" && !showDetailed) {
    return (
      <div className={`connection-status ${connectionStatus}`}>
        <span className={`connection-pulse bg-current`} />
        <span className="capitalize">{config?.label}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg ${config?.bgColor}`}
    >
      <div className="relative">
        <Icon name={config?.icon} size={20} className={config?.color} />
        {connectionStatus === "connected" && (
          <span
            className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-success connection-pulse`}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${config?.color}`}>
            {config?.label}
          </span>
          {pendingUpdates > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-accent/20 text-accent">
              {pendingUpdates} updates
            </span>
          )}
        </div>
        {showDetailed && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Last sync: {formatTime(lastUpdate)}
          </p>
        )}
      </div>
      {connectionStatus === "reconnecting" && (
        <div className="animate-spin">
          <Icon name="RefreshCw" size={16} className={config?.color} />
        </div>
      )}
    </div>
  );
};

export default RealTimeStatusIndicator;
