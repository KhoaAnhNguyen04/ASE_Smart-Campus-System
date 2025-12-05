import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar, {
  SidebarProvider,
  useSidebar,
} from "../../components/navigation/Sidebar";
import QuickActionToolbar from "../../components/navigation/QuickActionToolbar";
import RealTimeStatusIndicator from "../../components/navigation/RealTimeStatusIndicator";
import Button from "../../components/ui/Button";
import WelcomeBanner from "./components/WelcomeBanner";
import RoomSearchBar from "./components/RoomSearchBar";
import DailyScheduleTimeline from "./components/DailyScheduleTimeline";
import RecentBookingsWidget from "./components/RecentBookingsWidget";
import RoleBasedShortcuts from "./components/RoleBasedShortcuts";

const HomeDashboardContent = () => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();
  const [userRole, setUserRole] = useState("student");
  const [userName, setUserName] = useState("Alex Morgan");

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") || "student";
    const storedName = localStorage.getItem("userName") || "Alex Morgan";
    setUserRole(storedRole);
    setUserName(storedName);
  }, []);

  const handleFindFreeRooms = () => {
    const now = new Date();
    const currentTime = now?.toTimeString()?.slice(0, 5);
    navigate(`/room-search?available=true&time=${currentTime}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} />

      <main
        className={`main-content ${isCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <div className="max-w-7xl mx-auto">
          <WelcomeBanner userName={userName} userRole={userRole} />

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Find Your Room
              </h2>
              <RealTimeStatusIndicator showDetailed position="header" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <RoomSearchBar />
              </div>
              <div>
                <Button
                  variant="default"
                  size="lg"
                  onClick={handleFindFreeRooms}
                  iconName="Search"
                  iconPosition="left"
                  fullWidth
                  className="h-full min-h-[48px]"
                >
                  Find Free Rooms Now
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <RoleBasedShortcuts userRole={userRole} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <DailyScheduleTimeline userRole={userRole} />
            </div>
            <div>
              <RecentBookingsWidget />
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Need Help?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground">FAQs</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Common questions about room booking
                </p>
              </div>

              <div className="p-4 bg-background rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground">Support</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Contact technical support team
                </p>
              </div>

              <div className="p-4 bg-background rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-success/10">
                    <svg
                      className="w-5 h-5 text-success"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-foreground">Guide</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Learn how to use UniRoom Manager
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <QuickActionToolbar userRole={userRole} currentContext="dashboard" />
    </div>
  );
};

const HomeDashboard = () => {
  return (
    <SidebarProvider>
      <HomeDashboardContent />
    </SidebarProvider>
  );
};

export default HomeDashboard;
