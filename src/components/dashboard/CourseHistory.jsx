import React from "react";
import { FaCheckCircle, FaTrophy } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

const CourseHistory = () => {
  const { user, courses } = useApp();

  // Get completed courses from user data
  const completedCourses = (user?.completedCourses || []).map((completedCourse) => {
    const course = courses.find(c => c._id === completedCourse.courseId || c._id === completedCourse);
    return {
      id: completedCourse._id || completedCourse,
      title: course?.title || "Course",
      points: completedCourse.points || 500,
      completedDate: completedCourse.completedDate
        ? new Date(completedCourse.completedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : "Recently completed",
      duration: course?.duration || "Unknown",
      certificate: completedCourse.certificate || !!completedCourse.certificateId,
    };
  }) || [];

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
        {completedCourses && completedCourses.length > 0 ? (
          completedCourses.map((course, index) => (
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
          ))
        ) : (
          <div className="p-4 text-center">
            <p className="text-xs text-gray-600">No courses completed yet</p>
            <p className="text-xs text-gray-500 mt-1">Complete courses to earn certificates and points!</p>
          </div>
        )}
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
