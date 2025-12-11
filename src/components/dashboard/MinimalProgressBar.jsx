import React, { useEffect, useState } from "react";
import { FaPlayCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const MinimalProgressBar = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [progressData, setProgressData] = useState({
    module: "",
    course: "",
    moduleProgress: 0,
    courseProgress: 0,
    points: 0,
    completedModules: 0,
    totalModules: 0,
  });

  useEffect(() => {
    if (!user?.currentCourse || !user?.moduleProgress) return;

    try {
      const currentCourse = user.currentCourse;
      const currentModule = user.currentModule;

      // Calculate course progress
      let completedModules = 0;
      let totalModules = currentCourse.modules?.length || 0;
      let courseProgress = 0;
      let moduleProgress = 0;

      if (user.moduleProgress && Array.isArray(user.moduleProgress)) {
        // Count completed modules
        completedModules = user.moduleProgress.filter(
          m => m.isMcqCompleted && m.isCodingCompleted
        ).length;

        // Calculate course progress percentage
        if (totalModules > 0) {
          courseProgress = Math.round((completedModules / totalModules) * 100);
        }

        // Calculate current module progress
        if (currentModule) {
          const currentModuleProgress = user.moduleProgress.find(
            m => m.moduleId === currentModule._id || m.moduleId === currentModule
          );
          if (currentModuleProgress) {
            let progress = 0;
            if (currentModuleProgress.isMcqCompleted) progress += 50;
            if (currentModuleProgress.isCodingCompleted) progress += 50;
            moduleProgress = progress;
          }
        }
      }

      const currentModuleTitle = currentModule?.title ||
        currentCourse.modules?.find(m => m._id === user.currentModule)?._id ||
        "Current Module";

      setProgressData({
        module: currentModuleTitle,
        moduleId: currentModule?._id || user.currentModule,
        course: currentCourse.title || "Current Course",
        moduleProgress,
        courseProgress,
        points: user.points || 0,
        completedModules,
        totalModules,
      });
    } catch (error) {
      console.error('Error calculating progress:', error);
    }
  }, [user?.currentCourse, user?.moduleProgress, user?.currentModule, user?.points]);

  // If user doesn't have a current course
  if (!user?.currentCourse) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-6">
          <p className="text-xs text-gray-600 mb-2">No Active Course</p>
          <button
            onClick={() => navigate('/courses')}
            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {/* Course Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-700">Course Progress</span>
              <span className="text-xs text-gray-600">{progressData.courseProgress}%</span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">{progressData.course}</p>
            <p className="text-xs text-gray-500 mt-1">{progressData.completedModules}/{progressData.totalModules} modules completed</p>
          </div>
          <button
            onClick={() => navigate('/learning')}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold transition-colors transform hover:scale-105"
          >
            <FaPlayCircle size={9} />
            <span>Resume</span>
          </button>
        </div>

        {/* Course Progress bar */}
        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progressData.courseProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Module Progress Section */}
      {progressData.moduleProgress > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-700">Current Module</span>
                <span className="text-xs text-gray-600">{progressData.moduleProgress}%</span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5 truncate">{progressData.module}</p>
            </div>
          </div>

          {/* Module Progress bar */}
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-3">
            <div
              className="h-1.5 rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${progressData.moduleProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Points info */}
      <div className="border-t border-gray-200 pt-3 mt-3">
        <div className="text-xs text-gray-600">
          <span className="font-semibold">Points Earned:</span>
          <span className="text-blue-600 font-semibold ml-1">+{progressData.points} pts</span>
        </div>
      </div>
    </div>
  );
};

export default MinimalProgressBar;