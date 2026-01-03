import React, { useState } from "react";
import { FaCheckCircle, FaTrophy } from "react-icons/fa";
import { useApp } from "../../context/AppContext";
import CompletedDetailsModal from "../modals/CompletedDetailsModal";

const CourseHistory = () => {
  const { getUserCompletedCourses } = useApp();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get completed courses from context helper
  const completedCourses = getUserCompletedCourses() || [];

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  return (
    <>
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
                key={course._id || course.id}
                onClick={() => handleCourseClick(course)}
                className="premium-card-compact p-xs hover:bg-blue-50 transition-colors cursor-pointer hover:shadow-md"
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
                          {course.title || "Course"}
                        </h3>
                        <div className="flex flex-wrap gap-xs items-center">
                          <span className="premium-text-sm text-gray-600 text-xs">
                            {course.completionMetadata?.completedDate
                              ? new Date(course.completionMetadata.completedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                              : "Recently completed"}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="premium-text-sm text-gray-600 text-xs">
                            {course.duration || "Unknown"}
                          </span>
                        </div>
                      </div>

                      {/* Points Badge */}
                      {course.completionMetadata?.points && (
                        <div className="premium-badge premium-badge-blue text-xs shrink-0">
                          +{course.completionMetadata.points}
                        </div>
                      )}
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
            {completedCourses.reduce((sum, course) => sum + (course.completionMetadata?.points || 0), 0)} pts
          </span>
        </div>
      </div>

      {/* Details Modal */}
      <CompletedDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedCourse}
        type="course"
      />
    </>
  );
};

export default CourseHistory;
