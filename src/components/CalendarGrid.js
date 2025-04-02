import React from "react";

const CalendarGrid = ({ selectedDates, onSelectDate, month, year }) => {
  const daysInMonth = new Date(year, month, 0).getDate(); // Get days count

  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const fullDate = new Date(year, month - 1, day).toISOString().split("T")[0]; // YYYY-MM-DD
    return fullDate;
  });

  return (
    <div className="calendar-grid">
      {dates.map((fullDate) => (
        <div
          key={fullDate}
          className={`calendar-cell ${selectedDates.includes(fullDate) ? "selected" : ""}`}
          onClick={() => onSelectDate(fullDate)}
        >
          {new Date(fullDate).getDate()} {/* Show day */}
        </div>
      ))}
    </div>
  );
};

export default CalendarGrid;
