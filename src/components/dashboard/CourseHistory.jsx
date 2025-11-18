import React from "react";
import { FaCheckCircle, FaTrophy } from "react-icons/fa";

const CourseHistory = () => {
  // Mock data - replace with actual completed courses
  const completedCourses = [
    {
      id: 1,
      title: "JavaScript Basics",
      points: 1200,
      completedDate: "Oct 15, 2024",
      duration: "4 weeks",
      certificate: true,
    },
    {
      id: 2,
      title: "HTML & CSS Essentials",
      points: 800,
      completedDate: "Oct 1, 2024",
      duration: "3 weeks",
      certificate: true,
    },
    {
      id: 3,
      title: "Git & GitHub Mastery",
      points: 600,
      completedDate: "Sep 20, 2024",
      duration: "2 weeks",
      certificate: false,
    },
    {
      id: 4,
      title: "Web Development Fundamentals",
      points: 1500,
      completedDate: "Sep 1, 2024",
      duration: "5 weeks",
      certificate: true,
    },
  ];

  return (
    <div className="premium-card p-xs">
      {/* Header */}
      <div className="mb-xs">
        <div className="flex items-center gap-xs mb-xs">
          <FaTrophy className="text-yellow-500" size={12} />
          <h2 className="text-sm font-semibold text-gray-900">Completed</h2>
        </div>
        <p className="text-xs text-gray-600">{completedCourses.length} courses</p>
      </div>

      {/* Courses List */}
      <div className="space-y-xs overflow-y-auto max-h-52 premium-scrollbar">
        {completedCourses.map((course, index) => (
          <div
            key={course.id}
            className="premium-card-compact p-xs hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-start gap-xs">
              {/* Icon */}
              <div className="shrink-0 mt-0.5">
                <FaCheckCircle className="text-green-500" size={12} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-xs">
                  <div className="flex-1">
                    <h3 className="premium-heading-sm text-gray-900 mb-xs text-xs">
                      {course.title}
                    </h3>
                    <div className="flex flex-wrap gap-xs items-center">
                      <span className="premium-text-sm text-gray-600 text-xs">
                        {course.completedDate}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="premium-text-sm text-gray-600 text-xs">
                        {course.duration}
                      </span>
                    </div>
                  </div>

                  {/* Points and Certificate */}
                  <div className="flex flex-col items-end gap-xs shrink-0">
                    <div className="premium-badge premium-badge-blue text-xs">
                      +{course.points}
                    </div>
                    {course.certificate && (
                      <div className="premium-badge premium-badge-success text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Points */}
      <div className="premium-divider mt-sm"></div>
      <div className="flex items-center justify-between pt-sm">
        <span className="premium-heading-sm text-gray-600 text-xs">Total</span>
        <span className="premium-heading-sm text-blue-600">
          {completedCourses.reduce((sum, course) => sum + course.points, 0)}
        </span>
      </div>
    </div>
  );
};

export default CourseHistory;
