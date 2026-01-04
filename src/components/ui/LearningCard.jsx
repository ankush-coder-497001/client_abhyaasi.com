"use client"

import { useState } from "react"
import { FaBook, FaClock, FaUserGraduate } from "react-icons/fa"
import { Loader, X, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const LearningCard = ({ data, isEnrolled, isCompleted, onEnroll, isLoading }) => {
  const navigate = useNavigate()
  const [showUnenrollModal, setShowUnenrollModal] = useState(false)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200"
      case "medium":
        return "bg-amber-50 text-amber-700 border border-amber-200"
      case "hard":
        return "bg-red-50 text-red-700 border border-red-200"
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200"
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
      <div className="relative h-56 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        <img
          src={data.thumbnailUrl || "/placeholder.svg"}
          alt={data.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize transition-all duration-300 ${getDifficultyColor(
              data.difficulty,
            )}`}
          >
            {data.difficulty}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col grow">
        <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2 leading-tight">{data.title}</h3>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2 grow leading-relaxed">{data.description}</p>

        <div className="flex items-center gap-5 mb-5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <FaClock className="text-blue-500" size={14} />
            <span className="font-medium">{data.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaBook className="text-emerald-500" size={14} />
            <span className="font-medium">{data.moduleCount} modules</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaUserGraduate className="text-slate-500" size={14} />
            <span className="font-medium">{data.enrolledStudents}</span>
          </div>
        </div>

        <div className="flex gap-2.5 mt-auto pt-1">
          <button
            onClick={() => navigate(`/course-details/${data._id}`)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium text-sm transition-all duration-200 border border-slate-200 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
          >
            View Details
          </button>
          {isCompleted ? (
            <button
              disabled
              className="flex-1 px-3.5 py-2.5 rounded-lg bg-emerald-50 text-emerald-700 font-medium text-sm transition-all duration-200 border border-emerald-200 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              <span>Completed</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (isEnrolled) {
                  setShowUnenrollModal(true)
                } else {
                  onEnroll && onEnroll()
                }
              }}
              disabled={isLoading}
              className={`flex-1 px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border ${isEnrolled
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600 hover:shadow-md hover:shadow-emerald-600/30"
                  : "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 hover:shadow-md hover:shadow-blue-600/30"
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
                "Enroll Now"
              )}
            </button>
          )}
        </div>
      </div>

      {showUnenrollModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Unenroll from Course</h3>
              <button
                onClick={() => setShowUnenrollModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed text-sm">
              Are you sure you want to unenroll from <strong className="text-slate-900">{data.title}</strong>? Your
              progress will be saved, but you'll lose access to the course content.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUnenrollModal(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 hover:border-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUnenrollModal(false)
                  onEnroll && onEnroll()
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-red-600 hover:shadow-md hover:shadow-red-600/30"
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
  )
}

export default LearningCard
