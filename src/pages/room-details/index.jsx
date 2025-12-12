import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Sidebar, {
  SidebarProvider,
  useSidebar,
} from "../../components/navigation/Sidebar";
import QuickActionToolbar from "../../components/navigation/QuickActionToolbar";
import Button from "../../components/ui/Button";
import RoomHeader from "./components/RoomHeader";
import RoomSpecifications from "./components/RoomSpecifications";
import EquipmentList from "./components/EquipmentList";
import DailySchedule from "./components/DailySchedule";
import RoomLocation from "./components/RoomLocation";
import RoomGallery from "./components/RoomGallery";
import SimilarRooms from "./components/SimilarRooms";

const RoomDetailsContent = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isCollapsed } = useSidebar();

  const [userRole] = useState("lecturer");
  const [currentTime] = useState(new Date("2025-12-05T10:30:00"));

  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);

        const res = await fetch(`http://localhost:4000/rooms/${roomId}`);

        if (!res.ok) {
          throw new Error("Failed to fetch room details");
        }

        const data = await res.json();
        setRoomDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (roomId) fetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) return <div className="p-8">Loading room details...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!roomDetails) return null;

  const { room, bookings } = roomDetails;

  const roomData = {
    id: room.id,
    name: room.name,
    building: room.building,
    floor: room.floor,
    roomNumber: room.room_number,
    status: room.status,
    capacity: room.capacity,
    area: room.area,
    climate: room.climate,
    lighting: room.lighting,

    equipment: room.room_equipment?.map((e) => e.name) ?? [],

    images: room.room_images ?? [],

    schedule: bookings.map((b) => ({
      startTime: b.start_time.slice(11, 16),
      endTime: b.end_time.slice(11, 16),
      status: b.status,
      bookedBy: b.user_email,
      purpose: b.purpose,
    })),

    location: {
      building: room.building,
      floor: room.floor,
      wing: room.wing,
      roomName: room.name,
      nearestEntrance: room.nearest_entrance,
      latitude: room.latitude,
      longitude: room.longitude,
    },
  };
  //not work
  const handleBookRoom = () => {
    navigate(
      `/new-booking?roomId=${roomData.id}&roomName=${encodeURIComponent(
        roomData.name
      )}`
    );
  };

  const handleBackToSearch = () => {
    navigate("/room-search");
  };

  const similarRooms = [
    {
      id: "LH-302",
      name: "Lecture Hall 302",
      building: "Engineering Block A",
      floor: 3,
      capacity: 100,
      equipmentCount: 8,
      status: "available",
      image: "https://images.unsplash.com/photo-1582939224887-986825635643",
      imageAlt: "Lecture hall",
    },
  ];

  return (
    <>
      <Sidebar userRole={userRole} />

      <main
        className={`main-content ${
          isCollapsed ? "sidebar-collapsed" : ""
        } bg-background`}
      >
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={handleBackToSearch}
            className="mb-4"
          >
            Back to Search
          </Button>

          <div className="space-y-6">
            <RoomHeader
              room={roomData}
              onBookRoom={handleBookRoom}
              userRole={userRole}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <RoomGallery images={roomData.images} />
                <RoomSpecifications room={roomData} />
                <EquipmentList equipment={roomData.equipment} />
              </div>

              <div className="space-y-6">
                <DailySchedule
                  schedule={roomData.schedule}
                  currentTime={currentTime}
                />
                <RoomLocation location={roomData.location} />
              </div>
            </div>

            <SimilarRooms rooms={similarRooms} />
          </div>
        </div>
      </main>

      <QuickActionToolbar userRole={userRole} currentContext="room-details" />
    </>
  );
};

const RoomDetails = () => (
  <SidebarProvider>
    <RoomDetailsContent />
  </SidebarProvider>
);

export default RoomDetails;
