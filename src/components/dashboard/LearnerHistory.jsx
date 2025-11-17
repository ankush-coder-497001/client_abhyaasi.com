import React from "react";
import { FaBookOpen, FaUserTie } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";

const LearnerHistory = () => {
  const learnerData = {
    completedCourses: [
      {
        id: 1,
        title: "JavaScript Fundamentals",
        progress: 100,
        link: "/courses/javascript",
      },
      { id: 2, title: "React Basics", progress: 100, link: "/courses/react" },
      {
        id: 3,
        title: "Node.js Essentials",
        progress: 85,
        link: "/courses/node",
      },
    ],
    completedProfessions: [
      {
        id: 1,
        title: "Frontend Developer",
        progress: 100,
        link: "/profession/frontend",
      },
      {
        id: 2,
        title: "UI Designer",
        progress: 90,
        link: "/profession/ui-designer",
      },
    ],
  };

  return (
    <>
      {/* Completed Courses */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
            <FaBookOpen className="text-blue-600 flex-shrink-0" /> Completed
            Courses
          </h2>
        </div>

        <ul className="space-y-2 sm:space-y-4">
          {learnerData.completedCourses.map((course) => (
            <li
              key={course.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {course.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Progress: {course.progress}%
                </p>
              </div>
              <button
                onClick={() => (window.location.href = course.link)}
                className="flex items-center justify-center gap-1 bg-blue-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-md hover:bg-blue-700 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
              >
                Go <MdArrowForward />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Completed Professions */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-4 border-pink-500">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
            <FaUserTie className="text-pink-600 flex-shrink-0" /> Completed
            Professions
          </h2>
        </div>

        <ul className="space-y-2 sm:space-y-4">
          {learnerData.completedProfessions.map((prof) => (
            <li
              key={prof.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">
                  {prof.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Completion: {prof.progress}%
                </p>
              </div>
              <button
                onClick={() => (window.location.href = prof.link)}
                className="flex items-center justify-center gap-1 bg-pink-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-md hover:bg-pink-700 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
              >
                Go <MdArrowForward />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default LearnerHistory;
