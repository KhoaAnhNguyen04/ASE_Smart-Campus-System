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
import {
  validateBooking,
} from "./utils/bookingUtils";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

const ViewBookingsContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed } = useSidebar();

  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [rawBookings, setRawBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getRoomDetails = (roomId) => {
    console.log('Looking for room_id:', roomId);
    console.log('Available rooms:', rooms);
    const room = rooms.find(r => r.id === roomId);
    console.log('Found room:', room);
    if (!room) return { name: 'Unknown Room', building: 'Unknown Building', capacity: 0 };
    return {
      name: room.name,
      building: room.building,
      capacity: room.capacity,
      roomNumber: room.room_number,
      floor: room.floor
    };
  };

  const formatBooking = (booking) => {
    const roomDetails = getRoomDetails(booking.room_id);
    
    const startDateTime = booking.start_time.split('T');
    const endDateTime = booking.end_time.split('T');
    
    const date = startDateTime[0]; // YYYY-MM-DD
    const startTime = startDateTime[1]?.substring(0, 5) || '00:00'; // HH:MM
    const endTime = endDateTime[1]?.substring(0, 5) || '00:00'; // HH:MM

    return {
      id: booking.id,
      title: booking.purpose || 'Room Booking',
      room: `${roomDetails.name} - ${roomDetails.building} (Cap: ${roomDetails.capacity})`,
      building: roomDetails.building,
      date: date,
      startTime: startTime,
      endTime: endTime,
      status: booking.status,
      purpose: booking.purpose || '',
      room_id: booking.room_id,
      user_email: booking.user_email
    };
  };

  useEffect(() => {
    document.title = "View My Bookings - UniRoom Manager";

    const loadAllBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: roomsData } = await axios.get(`${API_BASE_URL}/rooms`);
        console.log('Rooms API Response:', roomsData);
        setRooms(roomsData.rooms || []);

        const { data: bookingsData } = await axios.get(
          `${API_BASE_URL}/bookings?page=1&limit=100`
        );
        console.log('Bookings API Response:', bookingsData);

        const fetchedBookings = bookingsData?.bookings || [];
        
        setRawBookings(fetchedBookings);
        
        const formattedBookings = fetchedBookings.map(formatBooking);
        setBookings(formattedBookings);

      } catch (err) {
        console.error('Error loading bookings:', err);
        setError(err?.response?.data?.error || err?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    loadAllBookings();
  }, [location]);

  useEffect(() => {
    if (rooms.length > 0 && rawBookings.length > 0) {
      console.log('Reformatting bookings with rooms data...');
      const formattedBookings = rawBookings.map(formatBooking);
      setBookings(formattedBookings);
    }
  }, [rooms, rawBookings]);

  const handleEdit = (booking) => {
    setEditingId(booking.id);
    setEditForm({
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      building: booking.building,
      room: booking.room_id,
      purpose: booking.purpose
    });
    setErrors({});
  };

  const handleSave = async (id) => {
    const validationErrors = validateBooking(editForm);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const startDateTime = `${editForm.date}T${editForm.startTime}:00Z`;
      const endDateTime = `${editForm.date}T${editForm.endTime}:00Z`;

      const updateData = {
        room_id: editForm.room,
        start_time: startDateTime,
        end_time: endDateTime,
        purpose: editForm.purpose
      };

      const { data } = await axios.patch(
        `${API_BASE_URL}/bookings/${id}`,
        updateData
      );

      const updatedBooking = formatBooking(data);
      setBookings(bookings.map(b => b.id === id ? updatedBooking : b));

      setEditingId(null);
      setEditForm({});
      setErrors({});
    } catch (err) {
      console.error('Error updating booking:', err);
      if (err?.response?.status === 409) {
        setErrors({ general: 'Time slot conflicts with another booking' });
      } else {
        setErrors({ 
          general: err?.response?.data?.error || 'Failed to update booking' 
        });
      }
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/bookings/${id}`,
        { status: 'canceled' }
      );

      setBookings(
        bookings.map(b => b.id === id ? { ...b, status: 'canceled' } : b)
      );
    } catch (err) {
      console.error('Error canceling booking:', err);
      alert(err?.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/bookings/${id}`);

      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert(err?.response?.data?.error || 'Failed to delete booking');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setErrors({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userRole="student" />
        <main className={`main-content ${isCollapsed ? "sidebar-collapsed" : ""}`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading bookings...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

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

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

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
                  roomOptions={rooms}
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