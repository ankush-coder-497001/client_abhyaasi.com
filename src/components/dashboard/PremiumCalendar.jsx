import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PremiumCalendar = () => {
  const [attendance, setAttendance] = useState({
    "2025-11-01": true,
    "2025-11-02": false,
    "2025-11-03": true,
    "2025-11-05": true,
    "2025-11-07": false,
    "2025-11-10": true,
    "2025-11-12": true,
    "2025-11-15": true,
  });

  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const daysInMonth = currentMonth.daysInMonth();
  const startDay = currentMonth.startOf("month").day();

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

  // Calculate stats
  const presentDays = Object.values(attendance).filter((v) => v === true).length;
  const absentDays = Object.values(attendance).filter((v) => v === false).length;
  const totalDays = presentDays + absentDays;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-2.5 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
        <div>
          <h3 className="text-xs font-bold text-gray-900">{currentMonth.format("MMM YYYY")}</h3>
        </div>
        <div className="flex gap-0.5">
          <button
            onClick={handlePrevMonth}
            className="p-1 hover:bg-gray-100 rounded transition text-gray-600 hover:text-gray-900"
            title="Previous Month"
          >
            <FaChevronLeft size={11} />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 hover:bg-gray-100 rounded transition text-gray-600 hover:text-gray-900"
            title="Next Month"
          >
            <FaChevronRight size={11} />
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-2.5">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-bold text-gray-500 py-0.5"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, idx) => {
            if (!date) return <div key={idx}></div>;

            const formattedDate = date.format("YYYY-MM-DD");
            const attended = attendance[formattedDate];
            const isToday = date.isSame(dayjs(), "day");

            return (
              <div
                key={formattedDate}
                className={`
                  h-6 w-6 flex items-center justify-center rounded text-xs font-bold cursor-pointer
                  transition-all duration-150 hover:shadow-sm
                  ${isToday
                    ? "ring-1.5 ring-blue-500 bg-blue-50 text-blue-700"
                    : ""
                  }
                  ${attended === true
                    ? "bg-green-50 text-green-700 hover:bg-green-100"
                    : attended === false
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }
                `}
                title={`${date.format("MMM DD, YYYY")} - ${attended === true ? "Present" : attended === false ? "Absent" : "No data"}`}
              >
                {date.date()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="border-t border-gray-200 p-2.5 grid grid-cols-3 gap-2 bg-linear-to-r from-gray-50 to-white">
        <div className="text-center py-1">
          <div className="text-xs text-gray-600 font-medium">Attended</div>
          <div className="text-sm font-bold text-green-600">{presentDays}</div>
        </div>
        <div className="text-center py-1">
          <div className="text-xs text-gray-600 font-medium">Missed</div>
          <div className="text-sm font-bold text-red-600">{absentDays}</div>
        </div>
        <div className="text-center py-1">
          <div className="text-xs text-gray-600 font-medium">Rate</div>
          <div className="text-sm font-bold text-blue-600">{attendanceRate}%</div>
        </div>
      </div>
    </div>
  );
};

export default PremiumCalendar;
