import React, { useState } from "react";
import { FaBriefcase, FaClock, FaBook } from "react-icons/fa";
import { Loader, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfessionCard = ({ data, isEnrolled, isCompleted, onEnroll, isLoading }) => {
  const navigate = useNavigate();
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group border border-slate-100 flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative h-60 bg-slate-200 overflow-hidden">
        <img
          src={data.thumbnail}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 capitalize">
            Profession
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col grow">
        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
          {data.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 grow">
          {data.description}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <FaClock className="text-blue-600" />
            <span>{data.estimatedDuration}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBook className="text-blue-600" />
            <span>{data.courses?.length || 0} courses</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBriefcase className="text-blue-600" />
            <span>{data.tags?.length || 0} skills</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => navigate(`/profession-details/${data._id}`)}
            disabled={isLoading}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                ? "bg-slate-900 text-white hover:bg-slate-800"
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Unenroll from Profession</h3>
              <button
                onClick={() => setShowUnenrollModal(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to unenroll from <strong className="text-slate-900">{data.name}</strong>? Your progress will be saved, but you'll lose access to the profession content.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUnenrollModal(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-100 text-slate-900 hover:bg-slate-200 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUnenrollModal(false);
                  onEnroll && onEnroll();
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
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

export default ProfessionCard;
