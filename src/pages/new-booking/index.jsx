import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  useSidebar,
} from "../../components/navigation/Sidebar";
import Sidebar from "../../components/navigation/Sidebar";
import QuickActionToolbar from "../../components/navigation/QuickActionToolbar";
import Icon from "../../components/AppIcon";
import BookingForm from "./components/BookingForm";
import AvailabilityChecker from "./components/AvailabilityChecker";
import BookingConfirmation from "./components/BookingConfirmation";
import BookingSuccess from "./components/BookingSuccess";
import { supabase } from "utils/supabase";

const NewBookingContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed } = useSidebar();

  const [currentStep, setCurrentStep] = useState("form");
  const [availabilityStatus, setAvailabilityStatus] = useState("idle");
  const [bookingData, setBookingData] = useState(null);
  const [bookingReference, setBookingReference] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [alternativeSlots, setAlternativeSlots] = useState([]);
  const [alternativeRooms, setAlternativeRooms] = useState([]);

  const prefilledRoom = location?.state?.room || null;
  const prefilledDate = location?.state?.date || "";

  useEffect(() => {
    document.title = "New Booking - UniRoom Manager";
  }, []);

  const formatConflict = (conflict) => {
    const start = new Date(conflict.start_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const end = new Date(conflict.end_time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `This room is already booked from ${start} to ${end}.`;
  };

  const handleAvailabilityCheck = async (formData) => {
    setBookingData(formData);
    setCurrentStep("checking");
    setAvailabilityStatus("checking");

    try {
      const start_time = `${formData.date}T${formData.startTime}:00`;
      const end_time = `${formData.date}T${formData.endTime}:00`;

      const res = await fetch("/availability-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: formData.roomId,
          start_time,
          end_time,
        }),
      });

      const data = await res.json();

      if (data.isAvailable) {
        setAvailabilityStatus("available");
        setConflicts([]);
        setAlternativeSlots([]);
        setAlternativeRooms([]);
      } else {
        setAvailabilityStatus("conflict");
        setConflicts(data.conflicts || []);
        setAlternativeSlots(data.alternativeSlots || []);
        setAlternativeRooms(data.alternativeRooms || []);
      }
    } catch (err) {
      console.error(err);
      setAvailabilityStatus("conflict");
    }
  };

  const handleProceedToConfirmation = () => {
    setCurrentStep("confirmation");
  };

  const handleSelectAlternative = (type, data) => {
    if (type === "time") {
      setBookingData((prev) => ({
        ...prev,
        startTime: data?.startTime,
        endTime: data?.endTime,
      }));
      setAvailabilityStatus("available");
    } else if (type === "room") {
      setBookingData((prev) => ({
        ...prev,
        roomId: data?.id,
        roomName: data?.name,
      }));
      setCurrentStep("form");
      setAvailabilityStatus("idle");
    }
  };

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login to book a room");
      return;
    }
    try {
      const start_time = `${bookingData.date}T${bookingData.startTime}:00`;
      const end_time = `${bookingData.date}T${bookingData.endTime}:00`;

      const res = await fetch("/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_id: bookingData.roomId,
          user_email: user.email,
          start_time,
          end_time,
          purpose: bookingData.description,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setAvailabilityStatus("conflict");
        setCurrentStep("checking");
        return;
      }

      if (!res.ok) throw new Error(data.error);

      setBookingReference(`BK-${data.id.slice(0, 8)}`);
      setCurrentStep("success");
    } catch (err) {
      alert(err.message || "Booking failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelConfirmation = () => {
    setCurrentStep("checking");
  };

  const steps = [
    { id: "form", label: "Booking Details", icon: "Calendar" },
    { id: "checking", label: "Availability", icon: "Search" },
    { id: "confirmation", label: "Confirmation", icon: "FileCheck" },
    { id: "success", label: "Complete", icon: "CheckCircle2" },
  ];

  const currentStepIndex = steps?.findIndex((step) => step?.id === currentStep);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="student" />
      <main
        className={`main-content ${isCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <Icon name="ArrowLeft" size={16} />
              Back
            </button>

            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon
                  name="CalendarPlus"
                  size={24}
                  color="var(--color-primary)"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  New Booking
                </h1>
                <p className="text-muted-foreground">
                  Reserve a room for your needs
                </p>
              </div>
            </div>
          </div>

          {currentStep !== "success" && (
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps?.map((step, index) => (
                  <React.Fragment key={step?.id}>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          index <= currentStepIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index < currentStepIndex ? (
                          <Icon name="Check" size={20} />
                        ) : (
                          <Icon name={step?.icon} size={20} />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium hidden sm:block ${
                          index <= currentStepIndex
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step?.label}
                      </span>
                    </div>
                    {index < steps?.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 transition-all duration-300 ${
                          index < currentStepIndex ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {currentStep === "form" && (
              <BookingForm
                prefilledRoom={prefilledRoom}
                prefilledDate={prefilledDate}
                onAvailabilityCheck={handleAvailabilityCheck}
                onSubmit={handleAvailabilityCheck}
                isChecking={false}
              />
            )}

            {currentStep === "checking" && (
              <AvailabilityChecker
                status={availabilityStatus}
                conflictDetails={
                  conflicts.length ? formatConflict(conflicts[0]) : ""
                }
                alternativeSlots={alternativeSlots}
                alternativeRooms={alternativeRooms}
                onSelectAlternative={handleSelectAlternative}
                onProceedAnyway={handleProceedToConfirmation}
              />
            )}

            {currentStep === "confirmation" && bookingData && (
              <BookingConfirmation
                bookingDetails={bookingData}
                onConfirm={handleConfirmBooking}
                onCancel={handleCancelConfirmation}
                isProcessing={isProcessing}
              />
            )}

            {currentStep === "success" && bookingReference && bookingData && (
              <BookingSuccess
                bookingReference={bookingReference}
                bookingDetails={bookingData}
              />
            )}
          </div>
        </div>
      </main>
      <QuickActionToolbar userRole="student" currentContext="booking" />
    </div>
  );
};

const NewBooking = () => {
  return (
    <SidebarProvider>
      <NewBookingContent />
    </SidebarProvider>
  );
};

export default NewBooking;
