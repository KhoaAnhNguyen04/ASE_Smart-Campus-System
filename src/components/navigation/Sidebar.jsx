import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Icon from "../AppIcon";
import { useAuth } from "../../context/AuthContext";

const SidebarContext = createContext({
  isCollapsed: false,
  toggleCollapse: () => {},
});

export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

const Sidebar = ({ userRole = "student" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleCollapse } = useSidebar();
  const { logout, user } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connected");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/home-dashboard",
      icon: "LayoutDashboard",
      roles: ["student", "lecturer", "admin", "security"],
    },
    {
      label: "Find Rooms",
      path: "/room-search",
      icon: "Search",
      roles: ["student", "lecturer", "admin", "security"],
    },
    {
      label: "My Bookings",
      path: "/my-bookings",
      icon: "Calendar",
      roles: ["student", "lecturer", "admin"],
    },
    {
      label: "Room Control",
      path: "/room-control-interface",
      icon: "Shield",
      roles: ["security", "admin"],
    },
  ];

  const filteredNavigation = navigationItems?.filter((item) =>
    item?.roles?.includes(userRole)
  );

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActive = (path) => {
    return location?.pathname === path;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const simulateConnection = () => {
      const statuses = ["connected", "reconnecting", "connected"];
      let index = 0;
      const interval = setInterval(() => {
        setConnectionStatus(statuses?.[index % statuses?.length]);
        index++;
      }, 5000);
      return interval;
    };

    const interval = simulateConnection();
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle navigation menu"
      >
        <Icon name={isMobileOpen ? "X" : "Menu"} size={24} />
      </button>
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Icon name="GraduationCap" size={24} color="var(--color-primary)" />
          </div>
          {!isCollapsed && <span className="sidebar-logo-text">UniRoom</span>}
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {filteredNavigation?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`sidebar-nav-item ${
                isActive(item?.path) ? "active" : ""
              }`}
              aria-current={isActive(item?.path) ? "page" : undefined}
            >
              <Icon name={item?.icon} size={20} />
              {!isCollapsed && (
                <span className="sidebar-nav-item-text">{item?.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4">
          {!isCollapsed && (
            <div className={`connection-status ${connectionStatus}`}>
              <span className={`connection-pulse bg-current`} />
              <span className="capitalize">{connectionStatus}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="sidebar-nav-item mt-4 w-full text-red-600 hover:bg-red-50"
            aria-label="Log out"
          >
            <Icon name="LogOut" size={20} />
            {!isCollapsed && (
              <span className="sidebar-nav-item-text">Log out</span>
            )}
          </button>

          <button
            onClick={toggleCollapse}
            className="sidebar-nav-item mt-2 hidden lg:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon
              name={isCollapsed ? "ChevronRight" : "ChevronLeft"}
              size={20}
            />
            {!isCollapsed && (
              <span className="sidebar-nav-item-text">Collapse</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
