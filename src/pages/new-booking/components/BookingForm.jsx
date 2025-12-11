import React, { useState, useEffect } from "react";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const BookingForm = ({
  prefilledRoom = null,
  prefilledDate = null,
  onAvailabilityCheck,
  onSubmit,
  isChecking = false,
}) => {
  const [formData, setFormData] = useState({
    roomId: prefilledRoom?.id || "",
    roomName: prefilledRoom?.name || "",
    date: prefilledDate || "",
    startTime: "",
    endTime: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const timeSlots = [];
  for (let hour = 7; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour?.toString()?.padStart(2, "0")}:${minute
        ?.toString()
        ?.padStart(2, "0")}`;
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const label = `${displayHour}:${minute
        ?.toString()
        ?.padStart(2, "0")} ${period}`;
      timeSlots?.push({ value: time, label });
    }
  }

  const roomOptions = [
    { value: "R101", label: "Room 101 - Engineering Building (Cap: 30)" },
    { value: "R102", label: "Room 102 - Engineering Building (Cap: 25)" },
    { value: "R201", label: "Room 201 - Science Building (Cap: 40)" },
    { value: "R202", label: "Room 202 - Science Building (Cap: 35)" },
    { value: "R301", label: "Room 301 - Arts Building (Cap: 20)" },
    { value: "R302", label: "Room 302 - Arts Building (Cap: 15)" },
    { value: "L101", label: "Lecture Hall 101 - Main Building (Cap: 100)" },
    { value: "L102", label: "Lecture Hall 102 - Main Building (Cap: 80)" },
  ];

  useEffect(() => {
    if (
      formData?.date &&
      formData?.startTime &&
      formData?.endTime &&
      formData?.roomId
    ) {
      const startMinutes = timeToMinutes(formData?.startTime);
      const endMinutes = timeToMinutes(formData?.endTime);

      if (endMinutes > startMinutes) {
        onAvailabilityCheck(formData);
      }
    }
  }, [
    formData?.date,
    formData?.startTime,
    formData?.endTime,
    formData?.roomId,
  ]);

  const timeToMinutes = (time) => {
    const [hours, minutes] = time?.split(":")?.map(Number);
    return hours * 60 + minutes;
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "roomId":
        if (!value) {
          newErrors.roomId = "Please select a room";
        } else {
          delete newErrors?.roomId;
        }
        break;

      case "date":
        if (!value) {
          newErrors.date = "Please select a date";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today?.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            newErrors.date = "t";
          } else {
            const maxDate = new Date();
            maxDate?.setDate(maxDate?.getDate() + 30);
            if (selectedDate > maxDate) {
              newErrors.date = "Cannot book more than 30 days in advance";
            } else {
              delete newErrors?.date;
            }
          }
        }
        break;

      case "startTime":
        if (!value) {
          newErrors.startTime = "Please select start time";
        } else {
          delete newErrors?.startTime;
          if (formData?.endTime) {
            const startMinutes = timeToMinutes(value);
            const endMinutes = timeToMinutes(formData?.endTime);
            if (endMinutes <= startMinutes) {
              newErrors.endTime = "End time must be after start time";
            } else {
              delete newErrors?.endTime;
            }
          }
        }
        break;

      case "endTime":
        if (!value) {
          newErrors.endTime = "Please select end time";
        } else if (formData?.startTime) {
          const startMinutes = timeToMinutes(formData?.startTime);
          const endMinutes = timeToMinutes(value);

          if (endMinutes <= startMinutes) {
            newErrors.endTime = "End time must be after start time";
          } else {
            const duration = endMinutes - startMinutes;
            if (duration > 240) {
              newErrors.endTime = "Maximum booking duration is 4 hours";
            } else {
              delete newErrors?.endTime;
            }
          }
        } else {
          delete newErrors?.endTime;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched?.[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData?.[name]);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    const allTouched = Object.keys(formData)?.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const isValid = ["roomId", "date", "startTime", "endTime"]?.every((field) =>
      validateField(field, formData?.[field])
    );

    if (isValid) {
      onSubmit(formData);
    }
  };

  const calculateDuration = () => {
    if (formData?.startTime && formData?.endTime) {
      const startMinutes = timeToMinutes(formData?.startTime);
      const endMinutes = timeToMinutes(formData?.endTime);
      const duration = endMinutes - startMinutes;

      if (duration > 0) {
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        return `${hours}h ${minutes}m`;
      }
    }
    return null;
  };

  const duration = calculateDuration();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="Calendar" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Booking Details
            </h3>
            <p className="text-sm text-muted-foreground">
              Fill in the information below
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Select
            label="Select Room"
            description="Choose the room you want to book"
            required
            searchable
            options={roomOptions}
            value={formData?.roomId}
            onChange={(value) => handleChange("roomId", value)}
            error={touched?.roomId && errors?.roomId}
            disabled={!!prefilledRoom}
          />

          <Input
            label="Date"
            type="date"
            required
            value={formData?.date}
            onChange={(e) => handleChange("date", e?.target?.value)}
            onBlur={() => handleBlur("date")}
            error={touched?.date && errors?.date}
            min={new Date()?.toISOString()?.split("T")?.[0]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Start Time"
              description="Select booking start time"
              required
              searchable
              options={timeSlots}
              value={formData?.startTime}
              onChange={(value) => handleChange("startTime", value)}
              error={touched?.startTime && errors?.startTime}
            />

            <Select
              label="End Time"
              description="Select booking end time"
              required
              searchable
              options={timeSlots}
              value={formData?.endTime}
              onChange={(value) => handleChange("endTime", value)}
              error={touched?.endTime && errors?.endTime}
            />
          </div>

          {duration && (
            <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
              <Icon name="Clock" size={16} color="var(--color-accent)" />
              <span className="text-sm font-medium text-accent">
                Duration: {duration}
              </span>
            </div>
          )}

          <Input
            label="Description (Optional)"
            type="text"
            placeholder="e.g., Team meeting, Study session, Project discussion"
            value={formData?.description}
            onChange={(e) => handleChange("description", e?.target?.value)}
            description="Add details about your booking purpose"
          />
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          iconName="ArrowLeft"
          iconPosition="left"
          onClick={() => window.history?.back()}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="default"
          iconName="Check"
          iconPosition="right"
          loading={isChecking}
          disabled={isChecking || Object.keys(errors)?.length > 0}
        >
          {isChecking ? "Checking Availability..." : "Check Availability"}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
