import React, { useState } from "react";
import { FaBook, FaClock, FaUserGraduate } from "react-icons/fa";
import { Loader, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LearningCard = ({ data, isEnrolled, isCompleted, onEnroll, isLoading }) => {
  const navigate = useNavigate();
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group border border-gray-100 flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative h-60 bg-gray-200 overflow-hidden">
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getDifficultyColor(
              data.difficulty
            )}`}
          >
            {data.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col grow">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {data.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 grow">
          {data.description}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <FaClock className="text-blue-600" />
            <span>{data.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBook className="text-green-600" />
            <span>{data.moduleCount} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <FaUserGraduate className="text-purple-600" />
            <span>{data.enrolledStudents} enrolled</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => navigate(`/course-details/${data._id}`)}
            disabled={isLoading}
            className="flex-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Details
          </button>
          {isCompleted ? (
            <button
              disabled
              className="flex-1 px-3 py-2 rounded-lg bg-green-100 text-green-700 font-medium text-sm transition-colors cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              <span>Completed</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isEnrolled) {
                  setShowUnenrollModal(true);
                } else {
                  onEnroll && onEnroll();
                }
              }}
              disabled={isLoading}
              className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isEnrolled
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              {isLoading ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  <span>Loading...</span>
                </>
              ) : isEnrolled ? (
                <>
                  <span>✓ Enrolled</span>
                </>
              ) : (
                "Enroll"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Unenroll Confirmation Modal */}
      {showUnenrollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Unenroll from Course</h3>
              <button
                onClick={() => setShowUnenrollModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to unenroll from <strong>{data.title}</strong>? Your progress will be saved, but you'll lose access to the course content.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUnenrollModal(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUnenrollModal(false);
                  onEnroll && onEnroll();
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    <span>Unenrolling...</span>
                  </>
                ) : (
                  "Unenroll"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningCard;