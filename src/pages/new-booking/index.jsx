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

const NewBookingContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed } = useSidebar();

  const [currentStep, setCurrentStep] = useState("form");
  const [availabilityStatus, setAvailabilityStatus] = useState("idle");
  const [bookingData, setBookingData] = useState(null);
  const [bookingReference, setBookingReference] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const prefilledRoom = location?.state?.room || null;
  const prefilledDate = location?.state?.date || "";

  const mockAlternativeSlots = [
    { startTime: "09:00", endTime: "11:00", duration: "2h 0m" },
    { startTime: "11:30", endTime: "13:30", duration: "2h 0m" },
    { startTime: "14:00", endTime: "16:00", duration: "2h 0m" },
    { startTime: "16:30", endTime: "18:30", duration: "2h 0m" },
  ];

  const mockAlternativeRooms = [
    {
      id: "R102",
      name: "Room 102",
      building: "Engineering Building",
      floor: 1,
      capacity: 25,
      equipment: ["Projector", "Whiteboard", "WiFi"],
    },
    {
      id: "R201",
      name: "Room 201",
      building: "Science Building",
      floor: 2,
      capacity: 40,
      equipment: ["Smart Board", "Video Conference", "WiFi"],
    },
    {
      id: "R302",
      name: "Room 302",
      building: "Arts Building",
      floor: 3,
      capacity: 15,
      equipment: ["Projector", "WiFi"],
    },
  ];

  useEffect(() => {
    document.title = "New Booking - UniRoom Manager";
  }, []);

  const handleAvailabilityCheck = (formData) => {
    setBookingData(formData);
    setCurrentStep("checking");
    setAvailabilityStatus("checking");

    setTimeout(() => {
      const isAvailable = Math.random() > 0.4;

      if (isAvailable) {
        setAvailabilityStatus("available");
      } else {
        setAvailabilityStatus("conflict");
      }
    }, 2000);
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

  const handleConfirmBooking = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const reference = `BK${Date.now()?.toString()?.slice(-8)}`;
      setBookingReference(reference);
      setIsProcessing(false);
      setCurrentStep("success");
    }, 2000);
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
                conflictDetails="This room is already booked from 10:00 AM to 12:00 PM on your selected date."
                alternativeSlots={
                  availabilityStatus === "conflict" ? mockAlternativeSlots : []
                }
                alternativeRooms={
                  availabilityStatus === "conflict" ? mockAlternativeRooms : []
                }
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
