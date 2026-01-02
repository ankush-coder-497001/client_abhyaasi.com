import React, { useEffect, useState } from "react";
import { FaBook, FaBriefcase, FaGraduationCap, FaPlayCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const ModuleInfoBar = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [moduleData, setModuleData] = useState({
    currentModule: "No Module",
    currentCourse: "No Course",
    currentProfession: "",
    progress: 0,
    points: 0,
  });

  useEffect(() => {
    if (!user?.currentCourse) return;

    try {
      const currentModule = user.currentModule;
      const currentCourse = user.currentCourse;
      const currentProfession = user.currentProfession;

      // Get module title
      const moduleName = typeof currentModule === 'object'
        ? (currentModule.title || "No Module")
        : "No Module";

      // Get course title
      const courseName = typeof currentCourse === 'object'
        ? (currentCourse.title || "No Course")
        : "No Course";

      // Get profession name
      const professionName = typeof currentProfession === 'object'
        ? (currentProfession.name || "")
        : currentProfession || "";

      // Calculate module progress
      let moduleProgress = 0;
      if (user.moduleProgress && Array.isArray(user.moduleProgress)) {
        const currentModuleId = typeof currentModule === 'object'
          ? currentModule._id
          : currentModule;

        const moduleProgData = user.moduleProgress.find(
          m => m.moduleId === currentModuleId
        );

        if (moduleProgData) {
          if (moduleProgData.isMcqCompleted) moduleProgress += 50;
          if (moduleProgData.isCodingCompleted) moduleProgress += 50;
        }
      }

      setModuleData({
        currentModule: moduleName,
        currentCourse: courseName,
        currentProfession: professionName,
        progress: moduleProgress,
        points: user.points || 0,
      });
    } catch (error) {
      console.error('Error calculating module data:', error);
    }
  }, [user?.currentModule, user?.currentCourse, user?.currentProfession, user?.moduleProgress, user?.points]);

  const handleResume = () => {
    navigate('/learning');
  };

  // Don't show if no current course
  if (!user?.currentCourse) {
    return null;
  }

  return (
    <div className="premium-card p-3 rounded-lg shadow-md border-l-4 border-l-blue-500">
      <div className="flex flex-col gap-2">
        {/* Top Row - Title and Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-0.5">Continue Learning</h2>
            <p className="text-xs text-gray-600">{moduleData.currentModule}</p>
          </div>
          <button
            onClick={handleResume}
            className="flex items-center gap-1 bg-linear-to-r from-blue-500 to-blue-600 text-white px-2.5 py-1 rounded-lg font-semibold text-xs hover:shadow-lg transform hover:scale-105 transition-all"
          >
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
            <p className="text-xs font-bold text-gray-900 truncate ml-0.5" title={moduleData.currentModule}>{moduleData.currentModule}</p>
          </div>

          {/* Course Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <FaGraduationCap className="text-blue-600" size={10} />
              </div>
              <span className="text-xs font-semibold text-gray-700">Course</span>
            </div>
            <p className="text-xs font-bold text-gray-900 truncate ml-0.5" title={moduleData.currentCourse}>{moduleData.currentCourse}</p>
          </div>

          {/* Profession Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <FaBriefcase className="text-blue-600" size={10} />
              </div>
              <span className="text-xs font-semibold text-gray-700">Career</span>
            </div>
            <p
              className="text-xs font-bold text-gray-900 truncate ml-0.5"
              title={moduleData.currentProfession || "Not in profession"}
            >
              {moduleData.currentProfession || "—"}
            </p>
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
