import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

const Calendar = ({ tasks }) => {
    console.log(new Date(tasks[0].deadline.seconds*1000).toISOString())
  // Map tasks to events for the calendar
  const events = tasks.map((task) => ({
    id: task.id,
    title: task.name,
    date: new Date(task.deadline.seconds * 1000),
    //end: new Date(task.deadline.seconds * 1000), // Ensure deadline is in ISO format
    backgroundColor:
      task.status === "To Do"
        ? "#f57c00"
        : task.status === "In Progress"
        ? "#0288d1"
        : "#2e7d32",
    borderColor: "#000",
  }));
  console.log(events)

  const handleEventClick = (clickInfo) => {
    alert(`Task: ${clickInfo.event.title}`);
  };

  return (
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
    />
  );
};

export default Calendar;
