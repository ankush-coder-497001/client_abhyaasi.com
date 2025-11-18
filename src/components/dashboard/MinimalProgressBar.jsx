import React from "react";
import { FaPlayCircle } from "react-icons/fa";

const MinimalProgressBar = () => {
  // Mock data - replace with actual data from context/props
  const progressData = {
    module: "React Hooks",
    course: "React Fundamentals",
    profession: "Full Stack Developer",
    progress: 65,
    points: 1200,
  };

  return (
    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
      {/* Top row with progress and button */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-700">Progress</span>
            <span className="text-xs text-gray-600">{progressData.progress}%</span>
          </div>
        </div>
        <button className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold transition-colors transform hover:scale-105">
          <FaPlayCircle size={9} />
          <span>Resume</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-0.5 rounded-full overflow-hidden mb-1">
        <div
          className="h-0.5 rounded-full bg-blue-500 transition-all"
          style={{ width: `${progressData.progress}%` }}
        ></div>
      </div>

      {/* Course and Profession info in single line */}
      <div className="flex items-center gap-2 text-xs overflow-hidden">
        <span className="font-semibold text-gray-700 truncate">{progressData.course}</span>
        <span className="text-gray-400 shrink-0">•</span>
        <span className="font-semibold text-gray-700 truncate">{progressData.profession}</span>
        <span className="text-gray-400 shrink-0">•</span>
        <span className="text-blue-600 font-semibold shrink-0">+{progressData.points} pts</span>
      </div>
    </div>
  );
};

export default MinimalProgressBar;
