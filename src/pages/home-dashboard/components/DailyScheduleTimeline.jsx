import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";

const DailyScheduleTimeline = ({ userRole = "student" }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const mockSchedule = {
    student: [
      {
        id: "SCH001",
        title: "Data Structures",
        room: "R101 - Lecture Hall A",
        building: "Science Building",
        startTime: "09:00",
        endTime: "10:30",
        status: "upcoming",
        lecturer: "Dr. Sarah Johnson",
      },
      {
        id: "SCH002",
        title: "Study Session",
        room: "R150 - Study Room 5",
        building: "Library",
        startTime: "11:00",
        endTime: "13:00",
        status: "booked",
        type: "personal",
      },
      {
        id: "SCH003",
        title: "Web Development",
        room: "R205 - Computer Lab 2",
        building: "Engineering Block",
        startTime: "14:00",
        endTime: "16:00",
        status: "upcoming",
        lecturer: "Prof. Michael Chen",
      },
    ],
    lecturer: [
      {
        id: "SCH004",
        title: "Advanced Algorithms",
        room: "R101 - Lecture Hall A",
        building: "Science Building",
        startTime: "09:00",
        endTime: "11:00",
        status: "upcoming",
        students: 45,
      },
      {
        id: "SCH005",
        title: "Office Hours",
        room: "R310 - Conference Room",
        building: "Administration",
        startTime: "13:00",
        endTime: "15:00",
        status: "booked",
        type: "office-hours",
      },
      {
        id: "SCH006",
        title: "Faculty Meeting",
        room: "R401 - Seminar Hall",
        building: "Arts Building",
        startTime: "16:00",
        endTime: "17:30",
        status: "upcoming",
        type: "meeting",
      },
    ],
  };

  const schedule = mockSchedule?.[userRole] || mockSchedule?.student;

  const getStatusConfig = (status) => {
    const configs = {
      upcoming: {
        color: "text-primary",
        bgColor: "bg-primary/10",
        icon: "Clock",
      },
      booked: {
        color: "text-success",
        bgColor: "bg-success/10",
        icon: "CheckCircle2",
      },
      completed: {
        color: "text-muted-foreground",
        bgColor: "bg-muted",
        icon: "Check",
      },
    };
    return configs?.[status] || configs?.upcoming;
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate?.setDate(newDate?.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Daily Booking
          </h2>
          <p className="text-sm text-muted-foreground">
            {formatDate(selectedDate)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
            aria-label="Previous day"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent/10 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
            aria-label="Next day"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {schedule?.length > 0 ? (
          schedule?.map((item, index) => {
            const statusConfig = getStatusConfig(item?.status);
            return (
              <div key={item?.id} className="relative pl-8 pb-6 last:pb-0">
                {index < schedule?.length - 1 && (
                  <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-border" />
                )}
                <div
                  className={`absolute left-0 top-1 p-1.5 rounded-full ${statusConfig?.bgColor}`}
                >
                  <Icon
                    name={statusConfig?.icon}
                    size={16}
                    color={statusConfig?.color?.replace(
                      "text-",
                      "var(--color-"
                    )}
                  />
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `/room-details?id=${item?.room?.split(" - ")?.[0]}`
                    )
                  }
                  className="w-full text-left p-4 bg-background border border-border rounded-lg hover:shadow-md hover-lift transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {item?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item?.room}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig?.bgColor} ${statusConfig?.color}`}
                    >
                      {item?.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Icon name="Clock" size={14} />
                      <span>
                        {item?.startTime} - {item?.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Icon name="MapPin" size={14} />
                      <span>{item?.building}</span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
              <Icon
                name="Calendar"
                size={32}
                color="var(--color-muted-foreground)"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              No scheduled activities for this day
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyScheduleTimeline;
