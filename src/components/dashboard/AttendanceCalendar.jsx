import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const AttendanceCalendar = () => {
  const [attendance, setAttendance] = useState({
    // Example data: true = came online, false = skipped
    "2025-11-01": true,
    "2025-11-02": false,
    "2025-11-03": true,
    "2025-11-05": true,
    "2025-11-07": false,
  });

  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const daysInMonth = currentMonth.daysInMonth();
  const startDay = currentMonth.startOf("month").day(); // 0 = Sunday

  const handlePrevMonth = () =>
    setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const generateCalendarDays = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(dayjs(currentMonth).date(d));
    }
    return days;
  };

  const days = generateCalendarDays();

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-t-4 border-pink-500 w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="px-2 sm:px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm sm:text-base"
          >
            ←
          </button>
          <button
            onClick={handleNextMonth}
            className="px-2 sm:px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm sm:text-base"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-gray-700">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold text-xs sm:text-sm">
            {day}
          </div>
        ))}

        {days.map((date, idx) => {
          if (!date) return <div key={idx}></div>;
          const formattedDate = date.format("YYYY-MM-DD");
          const attended = attendance[formattedDate];

          return (
            <div
              key={formattedDate}
              className={`p-1 sm:p-2 rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                attended === true
                  ? "bg-green-100 text-green-800"
                  : attended === false
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {date.date()}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 text-xs sm:text-sm">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></span>{" "}
          <span className="hidden sm:inline">Present</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></span>{" "}
          <span className="hidden sm:inline">Absent</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></span>{" "}
          <span className="hidden sm:inline">No Data</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
