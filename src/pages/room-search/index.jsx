import React, { useState, useEffect } from "react";
import Sidebar, {
  SidebarProvider,
  useSidebar,
} from "../../components/navigation/Sidebar";
import QuickActionToolbar from "../../components/navigation/QuickActionToolbar";
import RealTimeStatusIndicator from "../../components/navigation/RealTimeStatusIndicator";
import SearchFilters from "./components/SearchFilters";
import SortControls from "./components/SortControls";
import RoomCard from "./components/RoomCard";
import RoomListItem from "./components/RoomListItem";
import EmptyState from "./components/EmptyState";
import Icon from "../../components/AppIcon";

const RoomSearchContent = () => {
  const { isCollapsed } = useSidebar();
  const [filters, setFilters] = useState({
    searchQuery: "",
    building: "all",
    capacity: "any",
    date: new Date()?.toISOString()?.split("T")?.[0],
    startTime: "09:00",
    endTime: "17:00",
    onlyAvailable: false,
    equipment: [],
  });
  const [sortBy, setSortBy] = useState("availability");
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const buildQueryParams = () => {
    const params = new URLSearchParams();

    if (filters.searchQuery) params.append("search", filters.searchQuery);
    if (filters.building !== "all") params.append("building", filters.building);

    if (filters.capacity !== "any") {
      if (filters.capacity.includes("+")) {
        params.append("capacityMin", filters.capacity.replace("+", ""));
      } else {
        const [min, max] = filters.capacity.split("-");
        params.append("capacityMin", min);
        params.append("capacityMax", max);
      }
    }

    if (filters.equipment.length > 0) {
      params.append("equipment", filters.equipment.join(","));
    }

    if (filters.onlyAvailable) {
      params.append(
        "availableStart",
        `${filters.date}T${filters.startTime}:00`
      );
      params.append("availableEnd", `${filters.date}T${filters.endTime}:00`);
    }

    return params.toString();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const sortRooms = (rooms) => {
    const sorted = [...rooms];
    switch (sortBy) {
      case "availability":
        return sorted?.sort((a, b) => {
          const order = { free: 0, reserved: 1, "in-use": 2 };
          return order?.[a?.status] - order?.[b?.status];
        });
      case "capacity-asc":
        return sorted?.sort((a, b) => a?.capacity - b?.capacity);
      case "capacity-desc":
        return sorted?.sort((a, b) => b?.capacity - a?.capacity);
      case "building":
        return sorted?.sort((a, b) => a?.building?.localeCompare(b?.building));
      case "name":
        return sorted?.sort((a, b) => a?.name?.localeCompare(b?.name));
      case "proximity":
        return sorted;
      default:
        return sorted;
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      searchQuery: "",
      building: "all",
      capacity: "any",
      date: new Date()?.toISOString()?.split("T")?.[0],
      startTime: "09:00",
      endTime: "17:00",
      onlyAvailable: false,
      equipment: [],
    });
  };
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);

        const query = buildQueryParams();
        const res = await fetch(`http://localhost:4000/rooms?${query}`);
        const data = await res.json();

        const normalizedRooms = (data.rooms || []).map((room) => ({
          id: room.id,
          name: room.name,
          roomNumber: room.room_number,
          building: room.building,
          floor: room.floor,
          capacity: room.capacity,
          status: room.status,
          image:
            room.room_images?.[0]?.url ||
            room.image_url ||
            "/placeholder-room.jpg",
          imageAlt: room.room_images?.[0]?.alt || room.name,
          equipment: (room.room_equipment || []).map((e) => ({
            name: e.name,
            icon: e.icon,
          })),
          nextAvailable: room.availability?.nextAvailableAt
            ? new Date(room.availability.nextAvailableAt).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : null,
        }));

        setRooms(normalizedRooms);
      } catch (err) {
        console.error("Failed to load rooms", err);
        setRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [filters]);

  const sortedRooms = sortRooms(rooms);
  const filteredRooms = sortedRooms;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="student" />
      <main
        className={`main-content ${isCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-foreground">Find Rooms</h1>
              <RealTimeStatusIndicator showDetailed={false} position="header" />
            </div>
            <p className="text-muted-foreground">
              Search and filter available rooms across campus
            </p>
          </div>

          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            resultCount={filteredRooms?.length}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin">
                  <Icon name="Loader2" size={48} className="text-primary" />
                </div>
                <p className="text-muted-foreground">Loading rooms...</p>
              </div>
            </div>
          ) : filteredRooms?.length === 0 ? (
            <EmptyState onReset={handleReset} />
          ) : (
            <>
              <SortControls
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRooms?.map((room) => (
                    <RoomCard key={room?.id} room={room} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredRooms?.map((room) => (
                    <RoomListItem key={room?.id} room={room} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <QuickActionToolbar userRole="student" currentContext="room-search" />
    </div>
  );
};

const RoomSearch = () => {
  return (
    <SidebarProvider>
      <RoomSearchContent />
    </SidebarProvider>
  );
};

export default RoomSearch;
