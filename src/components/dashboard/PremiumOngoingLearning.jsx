import React from "react";
import { FaBook, FaPlayCircle, FaTrophy } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";

const PremiumOngoingLearning = ({ type = "course" }) => {
  // Mock data
  const learning = {
    title: type === "course" ? "React Fundamentals" : "Full Stack Developer Path",
    icon: type === "course" ? FaBook : FaTrophy,
    modules: [
      { id: 1, name: "Basics", points: 300, completed: true },
      { id: 2, name: "Hooks", points: 400, completed: true },
      { id: 3, name: "State Management", points: 500, completed: false, current: true },
      { id: 4, name: "Router", points: 400, completed: false },
      { id: 5, name: "Advanced Patterns", points: 600, completed: false },
    ],
  };

  const totalModules = learning.modules.length;
  const completedModules = learning.modules.filter((m) => m.completed);
  const currentModule = learning.modules.find((m) => m.current);
  const progress = (completedModules.length / totalModules) * 100;
  const totalPoints = completedModules.reduce((sum, m) => sum + m.points, 0);

  return (
    <div className="premium-card p-md flex flex-col h-full">
      {/* Header */}
      <div className="mb-md">
        <div className="flex items-start justify-between gap-sm mb-xs">
          <div className="flex-1">
            <h3 className="premium-heading-md text-gray-900 mb-xs flex items-center gap-xs">
              <FaBook className="text-blue-500" size={14} />
              {learning.title}
            </h3>
            <span className="premium-badge premium-badge-blue text-xs">
              {type === "course" ? "Course" : "Profession"}
            </span>
          </div>
          <div className="text-right shrink-0">
            <div className="premium-heading-sm text-blue-600">
              +{totalPoints}
            </div>
            <div className="premium-text-sm text-gray-600">points</div>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="mb-md flex-1 overflow-y-auto premium-scrollbar">
        <div className="space-y-xs">
          {learning.modules.map((module) => (
            <div
              key={module.id}
              className={`
                premium-card-compact p-xs flex items-center gap-xs
                transition-all ${module.completed
                  ? "bg-green-50 border-green-100"
                  : module.current
                    ? "bg-blue-50 border-blue-100 ring-1 ring-blue-200"
                    : "bg-gray-50 opacity-75"
                }
              `}
            >
              {/* Icon */}
              <div className="shrink-0">
                {module.completed ? (
                  <MdCheckCircle className="text-green-500" size={16} />
                ) : module.current ? (
                  <FaPlayCircle className="text-blue-500 animate-pulse" size={14} />
                ) : (
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`premium-text-sm font-medium truncate ${module.completed
                      ? "text-green-700"
                      : module.current
                        ? "text-blue-700"
                        : "text-gray-500"
                    }`}
                >
                  {module.name}
                </p>
              </div>

              {/* Points */}
              <div className="shrink-0">
                <span className="premium-text-sm font-semibold text-gray-600">
                  +{module.points}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-md">
        <div className="flex justify-between items-center mb-xs">
          <span className="premium-text-sm font-medium text-gray-700">
            {completedModules.length} of {totalModules} completed
          </span>
          <span className="premium-text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-2 rounded-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Current Module Info */}
      {currentModule && (
        <div className="premium-info-box bg-blue-50 mb-md border-l-3 border-l-blue-500">
          <div className="premium-info-label text-xs">Now Learning</div>
          <div className="premium-info-value text-sm">{currentModule.name}</div>
        </div>
      )}

      {/* Button */}
      <button className="premium-btn premium-btn-primary w-full flex items-center justify-center gap-xs">
        <FaPlayCircle size={12} />
        <span>Continue Learning</span>
      </button>
    </div>
  );
};

export default PremiumOngoingLearning;
