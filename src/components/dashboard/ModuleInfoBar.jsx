import React from "react";
import { FaBook, FaBriefcase, FaGraduationCap, FaPlayCircle } from "react-icons/fa";

const ModuleInfoBar = () => {
  // Mock data - replace with actual data from context/props
  const moduleData = {
    currentModule: "React Hooks",
    currentCourse: "React Fundamentals",
    currentProfession: "Full Stack Developer",
    progress: 65,
    points: 1200,
  };

  return (
    <div className="premium-card p-3 rounded-lg shadow-md border-l-4 border-l-blue-500">
      <div className="flex flex-col gap-2">
        {/* Top Row - Title and Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-0.5">Continue Learning</h2>
            <p className="text-xs text-gray-600">{moduleData.currentModule}</p>
          </div>
          <button className="flex items-center gap-1 bg-linear-to-r from-blue-500 to-blue-600 text-white px-2.5 py-1 rounded-lg font-semibold text-xs hover:shadow-lg transform hover:scale-105 transition-all">
            <FaPlayCircle size={11} />
            <span>Resume</span>
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Module Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <FaBook className="text-blue-600" size={10} />
              </div>
              <span className="text-xs font-semibold text-gray-700">Module</span>
            </div>
            <p className="text-xs font-bold text-gray-900 truncate ml-0.5">{moduleData.currentModule}</p>
          </div>

          {/* Course Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <FaGraduationCap className="text-blue-600" size={10} />
              </div>
              <span className="text-xs font-semibold text-gray-700">Course</span>
            </div>
            <p className="text-xs font-bold text-gray-900 truncate ml-0.5">{moduleData.currentCourse}</p>
          </div>

          {/* Profession Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <FaBriefcase className="text-blue-600" size={10} />
              </div>
              <span className="text-xs font-semibold text-gray-700">Career</span>
            </div>
            <p className="text-xs font-bold text-gray-900 truncate ml-0.5">{moduleData.currentProfession}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-700">Progress: {moduleData.progress}%</span>
            <span className="text-xs font-bold text-blue-600">+{moduleData.points} pts</span>
          </div>
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
            <div
              className="h-1 rounded-full bg-linear-to-r from-blue-500 to-blue-600 transition-all"
              style={{ width: `${moduleData.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleInfoBar;
