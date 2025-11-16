import React from "react";
import { FaBookOpen, FaPlayCircle } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import Button from "../ui/Button";

const OngoingLearning = ({ type }) => {
  const course = {
    title: "React",
    modules: [
      { id: 1, name: "React Basics", points: 300 },
      { id: 2, name: "React Hooks", points: 400 },
      { id: 3, name: "React State Management", points: 500 },
      { id: 4, name: "React Router", points: 400 },
      { id: 5, name: "Redux Advanced", points: 600 },
    ],
    currentModule: 3, // current module index (1-based)
  };

  const totalModules = course.modules.length;
  const completedModules = course.modules.filter(
    (m) => m.id < course.currentModule
  );
  const current = course.modules.find((m) => m.id === course.currentModule);
  const progress = (completedModules.length / totalModules) * 100;
  const totalPoints = completedModules.reduce((sum, m) => sum + m.points, 0);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-t-4 border-blue-500 flex flex-col w-full sm:w-80 md:w-full min-w-72 justify-between group relative overflow-hidden">
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
              <FaBookOpen className="text-blue-600 flex-shrink-0" />
              <span className="break-words">{course.title}</span>
            </h2>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block
                ${
                  type === "course"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
            >
              {type === "course" ? "Course" : "Profession"}
            </span>
          </div>
          <span className="flex items-center text-blue-600 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0">
            <GiTrophy className="mr-1 text-sm sm:text-base" />
            {totalPoints} pts
          </span>
        </div>

        {/* Module List with Improved Scrolling */}
        <div className="space-y-1 mb-3 max-h-56 overflow-y-auto pr-2 custom-scrollbar flex-grow">
          {course.modules.map((module) => {
            const isCompleted = module.id < course.currentModule;
            const isCurrent = module.id === course.currentModule;

            return (
              <div
                key={module.id}
                className={`flex items-center px-2 py-1 justify-between rounded-md border transition-all text-sm ${
                  isCompleted
                    ? "bg-green-50 border-green-200"
                    : isCurrent
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200 opacity-70"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {isCompleted ? (
                    <MdCheckCircle className="text-green-500 text-base flex-shrink-0" />
                  ) : isCurrent ? (
                    <FaPlayCircle className="text-blue-500 text-base animate-pulse flex-shrink-0" />
                  ) : (
                    <FaBookOpen className="text-gray-400 text-base flex-shrink-0" />
                  )}
                  <span
                    className={`font-medium truncate ${
                      isCompleted
                        ? "text-green-700"
                        : isCurrent
                        ? "text-blue-700"
                        : "text-gray-500"
                    }`}
                    title={module.name}
                  >
                    {module.name}
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-600 ml-1 flex-shrink-0">
                  +{module.points}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
            <span>
              {completedModules.length} / {totalModules} Modules
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 sm:h-3 rounded-full overflow-hidden">
            <div
              className="h-2 sm:h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

       <button className="relative z-10 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mt-2 cursor-pointer text-sm sm:text-base">
        <FaPlayCircle className="text-base flex-shrink-0" />
        <span>Resume</span>
      </button>
    </div>
  );
};

export default OngoingLearning;
