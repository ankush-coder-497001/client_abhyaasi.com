import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import AttendanceCalendar from "./AttendanceCalendar";

const AttendanceChart = () => {
  // Attendance data (true = present, false = absent)
  const [attendance] = useState({
    "2025-11-01": true,
    "2025-11-02": false,
    "2025-11-03": true,
    "2025-11-04": true,
    "2025-11-05": false,
    "2025-11-06": true,
    "2025-11-07": true,
    "2025-10-25": true,
    "2025-10-26": true,
  });

  const [filter, setFilter] = useState("month"); // week | month | year
  const today = dayjs();

  // Compute chart data dynamically based on filter
  const chartData = useMemo(() => {
    const entries = Object.entries(attendance).map(([date, attended]) => ({
      date: dayjs(date),
      attended,
    }));

    let grouped = {};

    if (filter === "week") {
      const startOfWeek = today.startOf("week");
      const endOfWeek = today.endOf("week");
      const weekData = entries.filter(
        (d) => d.date.isAfter(startOfWeek) && d.date.isBefore(endOfWeek)
      );

      for (let i = 0; i < 7; i++) {
        const day = startOfWeek.add(i, "day");
        grouped[day.format("ddd")] = weekData
          .filter((d) => d.date.isSame(day, "day"))
          .filter((d) => d.attended).length;
      }
    }

    if (filter === "month") {
      const startOfMonth = today.startOf("month");
      const daysInMonth = today.daysInMonth();
      for (let i = 1; i <= daysInMonth; i++) {
        const day = startOfMonth.date(i);
        grouped[day.format("DD")] = entries.filter(
          (d) => d.date.isSame(day, "day") && d.attended
        ).length;
      }
    }

    if (filter === "year") {
      for (let i = 0; i < 12; i++) {
        const month = today.startOf("year").add(i, "month");
        grouped[month.format("MMM")] = entries.filter(
          (d) => d.date.isSame(month, "month") && d.attended
        ).length;
      }
    }

    return Object.entries(grouped).map(([key, value]) => ({
      name: key,
      attendance: value,
    }));
  }, [attendance, filter, today]);

  return (
    <>
      {/* Analytics Chart */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all w-full h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Attendance Analytics
          </h2>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {["week", "month", "year"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  filter === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full flex-1 min-h-64 sm:min-h-80 md:min-h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="name"
                stroke="#888"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#888" style={{ fontSize: "12px" }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default AttendanceChart;
