import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isCollapsed } = useSidebar();
  const [userRole] = useState("lecturer");
  const [currentTime] = useState(new Date("2025-12-05T10:30:00"));

  const roomData = {
    id: "LH-301",
    name: "Lecture Hall 301",
    building: "Engineering Block A",
    floor: 3,
    roomNumber: "301",
    status: "available",
    capacity: 120,
    area: "180 sq m",
    climate: "Air Conditioned",
    lighting: "Natural + LED",
    accessibility: ["Wheelchair Access", "Hearing Loop", "Adjustable Seating"],
    equipment: [
      "Projector",
      "Smart Board",
      "Audio System",
      "Video Conferencing",
      "Document Camera",
      "Microphone",
      "WiFi",
      "HDMI Cables",
      "Power Outlets",
      "Air Conditioning",
    ],

    schedule: [
      {
        startTime: "08:00",
        endTime: "09:30",
        status: "occupied",
        bookedBy: "Dr. Sarah Johnson",
        purpose: "Advanced Mathematics Lecture",
      },
      {
        startTime: "09:30",
        endTime: "11:00",
        status: "available",
        bookedBy: null,
        purpose: null,
      },
      {
        startTime: "11:00",
        endTime: "12:30",
        status: "reserved",
        bookedBy: "Prof. Michael Chen",
        purpose: "Computer Science Seminar",
      },
      {
        startTime: "12:30",
        endTime: "14:00",
        status: "available",
        bookedBy: null,
        purpose: null,
      },
      {
        startTime: "14:00",
        endTime: "15:30",
        status: "occupied",
        bookedBy: "Dr. Emily Rodriguez",
        purpose: "Physics Laboratory Session",
      },
      {
        startTime: "15:30",
        endTime: "17:00",
        status: "available",
        bookedBy: null,
        purpose: null,
      },
    ],

    location: {
      building: "Engineering Block A",
      floor: 3,
      wing: "North Wing",
      roomName: "Lecture Hall 301",
      nearestEntrance: "Main Entrance A",
      latitude: 40.7128,
      longitude: -74.006,
      directions:
        "Enter through Main Entrance A, take the elevator to the 3rd floor, turn right and walk down the North Wing corridor. Room 301 will be on your left after the faculty lounge.",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1582939224887-986825635643",
        alt: "Modern lecture hall with tiered seating, large projection screen, and natural lighting from floor-to-ceiling windows",
      },
      {
        url: "https://images.unsplash.com/photo-1520032525096-7bd04a94b5a4",
        alt: "Close-up view of lecture hall seating arrangement showing comfortable chairs with fold-down desks and power outlets",
      },
      {
        url: "https://images.unsplash.com/photo-1703538671811-67ef490ac63f",
        alt: "Front view of lecture hall showing smart board, projector screen, and instructor podium with audio-visual controls",
      },
      {
        url: "https://images.unsplash.com/photo-1583062434105-9bef71509685",
        alt: "Wide angle view of empty lecture hall showcasing tiered seating capacity and modern lighting fixtures",
      },
      {
        url: "https://img.rocket.new/generatedImages/rocket_gen_img_134362a7e-1764896947905.png",
        alt: "Side view of lecture hall highlighting wheelchair accessible seating areas and emergency exit signage",
      },
      {
        url: "https://img.rocket.new/generatedImages/rocket_gen_img_100856ed2-1764896949174.png",
        alt: "Detail shot of lecture hall technology including document camera, microphone system, and video conferencing equipment",
      },
    ],
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
      imageAlt:
        "Spacious lecture hall with modern seating arrangement, projection equipment, and natural lighting from large windows",
    },
    {
      id: "LH-201",
      name: "Lecture Hall 201",
      building: "Engineering Block B",
      floor: 2,
      capacity: 150,
      equipmentCount: 12,
      status: "occupied",
      image: "https://images.unsplash.com/photo-1722652926558-8687c463ab5f",
      imageAlt:
        "Large lecture hall filled with students attending class, showing tiered seating and active projection screen",
    },
    {
      id: "LH-401",
      name: "Lecture Hall 401",
      building: "Science Complex",
      floor: 4,
      capacity: 130,
      equipmentCount: 10,
      status: "reserved",
      image: "https://images.unsplash.com/photo-1716596166061-e0baab26c135",
      imageAlt:
        "Contemporary lecture hall with curved seating rows, advanced audio-visual equipment, and ambient LED lighting",
    },
  ];

  const handleBookRoom = () => {
    navigate(
      `/new-booking?roomId=${roomData?.id}&roomName=${encodeURIComponent(
        roomData?.name
      )}`
    );
  };

  const handleBackToSearch = () => {
    navigate("/room-search");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Sidebar userRole={userRole} />
      <main
        className={`main-content ${
          isCollapsed ? "sidebar-collapsed" : ""
        } bg-background`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              iconName="ArrowLeft"
              iconPosition="left"
              onClick={handleBackToSearch}
              className="mb-4"
            >
              Back to Search
            </Button>
          </div>

          <div className="space-y-6">
            <RoomHeader
              room={roomData}
              onBookRoom={handleBookRoom}
              userRole={userRole}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <RoomGallery images={roomData?.images} />

                <RoomSpecifications room={roomData} />

                <EquipmentList equipment={roomData?.equipment} />
              </div>

              <div className="space-y-6">
                <DailySchedule
                  schedule={roomData?.schedule}
                  currentTime={currentTime}
                />

                <RoomLocation location={roomData?.location} />
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

const RoomDetails = () => {
  return (
    <SidebarProvider>
      <RoomDetailsContent />
    </SidebarProvider>
  );
};

export default RoomDetails;
