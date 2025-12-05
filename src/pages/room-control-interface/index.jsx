import React, { useState, useEffect } from "react";
import { useSidebar } from "../../components/navigation/Sidebar";
import Sidebar from "../../components/navigation/Sidebar";
import QuickActionToolbar from "../../components/navigation/QuickActionToolbar";
import RealTimeStatusIndicator from "../../components/navigation/RealTimeStatusIndicator";
import BuildingSelector from "./components/BuildingSelector";
import RoomStatusCard from "./components/RoomStatusCard";
import BulkControlPanel from "./components/BulkControlPanel";
import ActivityLog from "./components/ActivityLog";
import StatusSummary from "./components/StatusSummary";
import Icon from "../../components/AppIcon";

const RoomControlInterface = () => {
  const { isCollapsed } = useSidebar();
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [rooms, setRooms] = useState([]);
  const [activities, setActivities] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const buildings = [
    {
      id: "main-building",
      name: "Main Building",
      totalRooms: 45,
      floors: [
        {
          id: "main-floor-1",
          name: "Floor 1",
          rooms: [
            {
              id: "room-101",
              name: "Room 101",
              capacity: 30,
              doorStatus: "locked",
              deviceStatus: "off",
              occupancyCount: 0,
              equipment: ["Projector", "Whiteboard"],
              lastActivity: new Date(Date.now() - 1800000),
            },
            {
              id: "room-102",
              name: "Room 102",
              capacity: 25,
              doorStatus: "unlocked",
              deviceStatus: "on",
              occupancyCount: 3,
              equipment: ["Smart Board", "Audio System"],
              lastActivity: new Date(Date.now() - 300000),
            },
            {
              id: "room-103",
              name: "Room 103",
              capacity: 40,
              doorStatus: "locked",
              deviceStatus: "on",
              occupancyCount: 0,
              equipment: ["Projector", "Whiteboard", "Audio System"],
              lastActivity: new Date(Date.now() - 7200000),
            },
          ],
        },
        {
          id: "main-floor-2",
          name: "Floor 2",
          rooms: [
            {
              id: "room-201",
              name: "Room 201",
              capacity: 35,
              doorStatus: "locked",
              deviceStatus: "off",
              occupancyCount: 0,
              equipment: ["Projector", "Whiteboard"],
              lastActivity: new Date(Date.now() - 3600000),
            },
            {
              id: "room-202",
              name: "Room 202",
              capacity: 50,
              doorStatus: "unlocked",
              deviceStatus: "on",
              occupancyCount: 5,
              equipment: ["Smart Board", "Audio System", "Video Conference"],
              lastActivity: new Date(Date.now() - 600000),
            },
          ],
        },
      ],
    },
    {
      id: "science-building",
      name: "Science Building",
      totalRooms: 32,
      floors: [
        {
          id: "science-floor-1",
          name: "Floor 1",
          rooms: [
            {
              id: "lab-101",
              name: "Lab 101",
              capacity: 20,
              doorStatus: "locked",
              deviceStatus: "off",
              occupancyCount: 0,
              equipment: ["Lab Equipment", "Safety Systems"],
              lastActivity: new Date(Date.now() - 14400000),
            },
            {
              id: "lab-102",
              name: "Lab 102",
              capacity: 20,
              doorStatus: "locked",
              deviceStatus: "off",
              occupancyCount: 0,
              equipment: ["Lab Equipment", "Fume Hood"],
              lastActivity: new Date(Date.now() - 10800000),
            },
          ],
        },
      ],
    },
    {
      id: "library-building",
      name: "Library Building",
      totalRooms: 28,
      floors: [
        {
          id: "library-floor-1",
          name: "Floor 1",
          rooms: [
            {
              id: "study-101",
              name: "Study Room 101",
              capacity: 8,
              doorStatus: "unlocked",
              deviceStatus: "on",
              occupancyCount: 2,
              equipment: ["Whiteboard", "Power Outlets"],
              lastActivity: new Date(Date.now() - 900000),
            },
            {
              id: "study-102",
              name: "Study Room 102",
              capacity: 6,
              doorStatus: "locked",
              deviceStatus: "off",
              occupancyCount: 0,
              equipment: ["Whiteboard"],
              lastActivity: new Date(Date.now() - 5400000),
            },
          ],
        },
      ],
    },
  ];

  const initialActivities = [
    {
      id: "act-1",
      action: "lock",
      roomName: "Room 101 - Main Building",
      administrator: "John Smith",
      timestamp: new Date(Date.now() - 300000),
      success: true,
    },
    {
      id: "act-2",
      action: "device_on",
      roomName: "Room 102 - Main Building",
      administrator: "Sarah Johnson",
      timestamp: new Date(Date.now() - 600000),
      success: true,
    },
    {
      id: "act-3",
      action: "unlock",
      roomName: "Study Room 101 - Library Building",
      administrator: "Michael Chen",
      timestamp: new Date(Date.now() - 900000),
      success: true,
    },
    {
      id: "act-4",
      action: "override",
      roomName: "Room 202 - Main Building",
      administrator: "John Smith",
      timestamp: new Date(Date.now() - 1200000),
      success: true,
    },
    {
      id: "act-5",
      action: "device_off",
      roomName: "Lab 101 - Science Building",
      administrator: "Sarah Johnson",
      timestamp: new Date(Date.now() - 1800000),
      success: true,
    },
  ];

  useEffect(() => {
    setActivities(initialActivities);
  }, []);

  useEffect(() => {
    if (selectedBuilding && selectedFloor) {
      const building = buildings?.find((b) => b?.id === selectedBuilding);
      const floor = building?.floors?.find((f) => f?.id === selectedFloor);
      setRooms(floor?.rooms || []);
    } else {
      setRooms([]);
    }
  }, [selectedBuilding, selectedFloor]);

  const showToast = (message, type = "success") => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addActivity = (action, roomName) => {
    const newActivity = {
      id: `act-${Date.now()}`,
      action,
      roomName,
      administrator: "Current User",
      timestamp: new Date(),
      success: true,
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const handleLockToggle = (roomId, currentStatus) => {
    const newStatus = currentStatus === "locked" ? "unlocked" : "locked";
    setRooms((prev) =>
      prev?.map((room) =>
        room?.id === roomId
          ? { ...room, doorStatus: newStatus, lastActivity: new Date() }
          : room
      )
    );
    const room = rooms?.find((r) => r?.id === roomId);
    addActivity(newStatus === "locked" ? "lock" : "unlock", room?.name);
    showToast(`Door ${newStatus} successfully`);
  };

  const handleDeviceToggle = (roomId, currentStatus) => {
    const newStatus = currentStatus === "on" ? "off" : "on";
    setRooms((prev) =>
      prev?.map((room) =>
        room?.id === roomId
          ? { ...room, deviceStatus: newStatus, lastActivity: new Date() }
          : room
      )
    );
    const room = rooms?.find((r) => r?.id === roomId);
    addActivity(newStatus === "on" ? "device_on" : "device_off", room?.name);
    showToast(`Devices turned ${newStatus} successfully`);
  };

  const handleOverride = (roomId) => {
    const confirmed = window.confirm(
      "Emergency override will unlock the door and turn off all devices. Continue?"
    );
    if (confirmed) {
      setRooms((prev) =>
        prev?.map((room) =>
          room?.id === roomId
            ? {
                ...room,
                doorStatus: "unlocked",
                deviceStatus: "off",
                occupancyCount: 0,
                lastActivity: new Date(),
              }
            : room
        )
      );
      const room = rooms?.find((r) => r?.id === roomId);
      addActivity("override", room?.name);
      showToast("Emergency override executed", "warning");
    }
  };

  const handleBulkLockdown = () => {
    setRooms((prev) =>
      prev?.map((room) => ({
        ...room,
        doorStatus: "locked",
        deviceStatus: "off",
        lastActivity: new Date(),
      }))
    );
    const building = buildings?.find((b) => b?.id === selectedBuilding);
    const floor = building?.floors?.find((f) => f?.id === selectedFloor);
    addActivity("lockdown", `${building?.name} - ${floor?.name}`);
    showToast("Building lockdown initiated", "warning");
  };

  const handleBulkDeviceControl = (action) => {
    setRooms((prev) =>
      prev?.map((room) => ({
        ...room,
        deviceStatus: action,
        lastActivity: new Date(),
      }))
    );
    const building = buildings?.find((b) => b?.id === selectedBuilding);
    const floor = building?.floors?.find((f) => f?.id === selectedFloor);
    addActivity(
      action === "on" ? "device_on" : "device_off",
      `All rooms - ${building?.name} - ${floor?.name}`
    );
    showToast(`All devices turned ${action} successfully`);
  };

  const getSummary = () => {
    return {
      totalRooms: rooms?.length,
      lockedRooms: rooms?.filter((r) => r?.doorStatus === "locked")?.length,
      unlockedRooms: rooms?.filter((r) => r?.doorStatus === "unlocked")?.length,
      occupiedRooms: rooms?.filter((r) => r?.occupancyCount > 0)?.length,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="security" />
      <main
        className={`main-content ${isCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Room Control Interface
                </h1>
                <p className="text-muted-foreground">
                  Remote facility management and monitoring
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <RealTimeStatusIndicator showDetailed position="header" />
          </div>

          <div className="space-y-6">
            <BuildingSelector
              selectedBuilding={selectedBuilding}
              selectedFloor={selectedFloor}
              onBuildingChange={setSelectedBuilding}
              onFloorChange={setSelectedFloor}
              buildings={buildings}
            />

            {rooms?.length > 0 && (
              <>
                <StatusSummary summary={getSummary()} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-card rounded-lg border border-border p-6 card-shadow">
                      <h2 className="text-lg font-semibold text-foreground mb-4">
                        Room Controls
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rooms?.map((room) => (
                          <RoomStatusCard
                            key={room?.id}
                            room={room}
                            onLockToggle={handleLockToggle}
                            onDeviceToggle={handleDeviceToggle}
                            onOverride={handleOverride}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <BulkControlPanel
                      selectedRooms={rooms?.length}
                      onBulkLockdown={handleBulkLockdown}
                      onBulkDeviceControl={handleBulkDeviceControl}
                    />

                    <ActivityLog activities={activities} />
                  </div>
                </div>
              </>
            )}

            {!selectedBuilding && (
              <div className="bg-card rounded-lg border border-border p-12 text-center card-shadow">
                <Icon
                  name="Building2"
                  size={64}
                  className="text-muted-foreground mx-auto mb-4 opacity-50"
                />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Select Building & Floor
                </h3>
                <p className="text-muted-foreground">
                  Choose a building and floor to view and control rooms
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <QuickActionToolbar userRole="security" currentContext="room-control" />
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast-enter">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              toastMessage?.type === "success"
                ? "bg-success text-white"
                : "bg-warning text-white"
            }`}
          >
            <Icon
              name={
                toastMessage?.type === "success"
                  ? "CheckCircle2"
                  : "AlertTriangle"
              }
              size={20}
            />
            <span className="font-medium">{toastMessage?.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomControlInterface;
