import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import styled from "@emotion/styled";

const CalendarWrapper = styled.div`
  padding: 20px;
  background-color: #f4f5f7;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  .fc-toolbar-title {
    font-size: 20px;
    font-weight: 600;
    color: #172b4d;
  }
  .fc-daygrid-day {
    border: 1px solid #eaecef;
  }
  .fc-event {
    border-radius: 5px;
    padding: 4px;
    font-size: 14px;
  }
`;

const Calendar = ({ tasks }) => {
  const events = tasks.map((task) => ({
    id: task.id,
    title: task.name,
    date: new Date(task.deadline.seconds * 1000),
    backgroundColor:
      task.status === "To Do"
        ? "#ffab00"
        : task.status === "In Progress"
        ? "#0052cc"
        : "#36b37e",
    borderColor: "transparent",
    textColor: "#fff",
  }));

  const handleEventClick = (clickInfo) => {
    alert(`Task: ${clickInfo.event.title}`);
  };

  return (
    <CalendarWrapper>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
      />
    </CalendarWrapper>
  );
};

export default Calendar;
