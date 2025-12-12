import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  useSidebar,
} from "../../components/navigation/Sidebar";
import Sidebar from "../../components/navigation/Sidebar";
import QuickActionToolbar from "../../components/navigation/QuickActionToolbar";
import Icon from "../../components/AppIcon";
import BookingCard from "./components/BookingCard";
import EmptyBookings from "./components/EmptyBookings";
import { roomOptions, buildingOptions } from "./data/bookingOptions";
import {
  validateBooking,
  getRoomValue,
  getRoomLabel,
} from "./utils/bookingUtils";

const ViewBookingsContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed } = useSidebar();

  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [errors, setErrors] = useState({});

  const bookingDetails = location?.state?.bookingDetails;
  useEffect(() => {
    console.log("Booking details from location.state:", bookingDetails);
  }, [bookingDetails]);
  useEffect(() => {
    document.title = "View My Bookings - UniRoom Manager";

    const mockSchedule = [
      {
        id: "SCH001",
        title: "Data Structures",
        room: "Room 101 - Engineering Building (Cap: 30)",
        building: "Science Building",
        date: "2024-12-15",
        startTime: "09:00",
        endTime: "10:30",
        status: "upcoming",
        purpose: "Class Lecture",
      },
      {
        id: "SCH002",
        title: "Study Session",
        room: "Room 102 - Engineering Building (Cap: 25)",
        building: "Library",
        date: "2024-12-12",
        startTime: "11:00",
        endTime: "13:00",
        status: "completed",
        purpose: "Personal Study",
      },
      {
        id: "SCH003",
        title: "Web Development",
        room: "Room 201 - Science Building (Cap: 40)",
        building: "Engineering Building",
        date: "2024-12-18",
        startTime: "14:00",
        endTime: "16:00",
        status: "upcoming",
        purpose: "Lab Session",
      },
      {
        id: "SCH004",
        title: "Advanced Algorithms",
        room: "Room 301 - Arts Building (Cap: 20)",
        building: "Science Building",
        date: "2024-12-20",
        startTime: "09:00",
        endTime: "11:00",
        status: "cancelled",
        purpose: "Lecture",
      },
      {
        id: "SCH005",
        title: "Office Hours",
        room: "Lecture Hall 101 - Main Building (Cap: 100)",
        building: "Arts Building",
        date: "2024-12-10",
        startTime: "13:00",
        endTime: "15:00",
        status: "completed",
        purpose: "Student Consultation",
      },
      {
        id: "BK001",
        title: "Group Study Session",
        room: "Room 102 - Engineering Building (Cap: 25)",
        building: "Library",
        date: "2025-12-06",
        startTime: "10:00",
        endTime: "12:00",
        status: "completed",
        purpose: "Group Study Session",
      },
      {
        id: "BK002",
        title: "Project Meeting",
        room: "Room 301 - Arts Building (Cap: 20)",
        building: "Administration",
        date: "2025-12-08",
        startTime: "14:00",
        endTime: "16:00",
        status: "completed",
        purpose: "Project Meeting",
      },
      {
        id: "BK003",
        title: "Coding Workshop",
        room: "Room 201 - Science Building (Cap: 40)",
        building: "Engineering Block",
        date: "2025-12-10",
        startTime: "09:00",
        endTime: "11:00",
        status: "upcoming",
        purpose: "Coding Workshop",
      },
    ];

    let allBookings = [...mockSchedule];

    if (location?.state?.bookingDetails) {
      const stateBooking = location.state.bookingDetails;
      const roomLabel = getRoomLabel(stateBooking.roomId, roomOptions);

      const building =
        buildingOptions[Math.floor(Math.random() * buildingOptions.length)];

      allBookings = [
        {
          ...stateBooking,
          title: "Group Session",
          id: `NEW${Date.now()}`,
          room: roomLabel,
          status: "upcoming",
          building,
          purpose: "Group Offline Meeting"
        },
        ...allBookings,
      ];
    }

    setBookings(allBookings);
  }, [location]);

  const handleEdit = (booking) => {
    setEditingId(booking.id);
    setEditForm({
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      building: booking.building,
      room: getRoomValue(booking.room, roomOptions),
    });
    setErrors({});
  };

  const handleSave = (id) => {
    const validationErrors = validateBooking(editForm);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setBookings(
      bookings.map((b) =>
        b.id === id
          ? {
              ...b,
              ...editForm,
              room: getRoomLabel(editForm.room, roomOptions),
            }
          : b
      )
    );
    setEditingId(null);
    setEditForm({});
    setErrors({});
  };

  const handleCancelBooking = (id) => {
    setBookings(
      bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
    );
  };

  const handleDeleteBooking = (id) => {
    setBookings(bookings.filter((b) => b.id !== id));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="student" />
      <main
        className={`main-content ${isCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <Icon name="ArrowLeft" size={16} />
              Back
            </button>

            <div className="flex items-center gap-4 mb-2">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon
                      name="Calendar"
                      size={24}
                      color="var(--color-primary)"
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground flex items-center justify-center">
                    My Bookings
                  </h1>
                </div>

                <p className="text-muted-foreground ml-3">
                  Manage your room reservations
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {bookings.length === 0 ? (
              <EmptyBookings />
            ) : (
              bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  isEditing={editingId === booking.id}
                  editForm={editForm}
                  errors={errors}
                  roomOptions={roomOptions}
                  buildingOptions={buildingOptions}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancelBooking}
                  onDelete={handleDeleteBooking}
                  onCancelEdit={handleCancelEdit}
                  onFormChange={setEditForm}
                />
              ))
            )}
          </div>
        </div>
      </main>
      <QuickActionToolbar userRole="student" currentContext="bookings" />
    </div>
  );
};

const MyBookings = () => {
  return (
    <SidebarProvider>
      <ViewBookingsContent />
    </SidebarProvider>
  );
};

export default MyBookings;
