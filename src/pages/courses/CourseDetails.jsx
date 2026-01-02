"use client"

import { useState } from "react"
import { ChevronDown, ArrowLeft, Play, Loader, X, CheckCircle } from "lucide-react"
import { useParams, Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useApp } from "../../context/AppContext"

function ModuleItem({ module, index, enrolled, expandedModule, setExpandedModule, moduleProgress, setModuleProgress }) {
  const handleResumeClick = (e) => {
    e.stopPropagation()
    if (moduleProgress[module._id] === undefined) {
      setModuleProgress({ ...moduleProgress, [module._id]: 5 })
    } else {
      setModuleProgress({ ...moduleProgress, [module._id]: Math.min(moduleProgress[module._id] + 10, 100) })
    }
  }

  const currentProgress = moduleProgress[module._id] || module.progress || 0
  const isModuleExpanded = expandedModule === module._id

  return (
    <div key={module._id} className="group">
      <button
        onClick={() => setExpandedModule(isModuleExpanded ? null : module._id)}
        className="w-full transition-all duration-300"
      >
        <div className="px-6 py-5 flex items-start justify-between gap-4 border border-gray-200 rounded-xl bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-300">
          {/* Module number and title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-600 rounded-lg text-sm font-bold text-white">
              {index + 1}
            </div>
            <div className="min-w-0 text-left">
              <h3 className="text-base font-semibold text-black truncate">{module.title}</h3>
              <p className="text-xs text-gray-500 mt-1.5">
                {module.duration || "1 Day"} • {4 || 0} lessons
              </p>
            </div>
          </div>

          {enrolled && (
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${currentProgress}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full shadow-md transition-all duration-500"
                    style={{ left: `calc(${currentProgress}% - 5px)` }}
                  />
                </div>
                <span className="text-xs font-semibold text-blue-600">{currentProgress}%</span>
              </div>

              <button
                onClick={handleResumeClick}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                Resume
              </button>
            </div>
          )}

          {/* Chevron */}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 shrink-0 ${isModuleExpanded ? "rotate-180" : ""
              }`}
          />
        </div>
      </button>

      {isModuleExpanded && module.topics && (
        <div className="border border-t-0 border-gray-200 rounded-b-xl bg-gray-50 px-6 py-4 space-y-3 animate-in fade-in duration-300">
          <div className="space-y-2">
            {module.topics.map((topic, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs px-4 py-2.5 rounded-lg bg-white border border-gray-150 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <p className="text-gray-700 font-medium">{typeof topic === 'string' ? topic : topic.title || 'Topic'}</p>
                </div>
                <p className="text-gray-500 font-medium">{topic.duration || ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CourseDetails() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const { courses, enrollmentLoading, isCoursEnrolled, isCourseCompleted, enrollCourse, unenrollCourse } = useApp()
  const [expandedModule, setExpandedModule] = useState(null)
  const [moduleProgress, setModuleProgress] = useState({})
  const [showUnenrollModal, setShowUnenrollModal] = useState(false)

  // Get course from context
  const course = courses.find(c => c._id === courseId)
  const enrolled = course ? isCoursEnrolled(courseId) : false
  const completed = course ? isCourseCompleted(courseId) : false

  console.log('Course Details - course:', course)

  const handleEnroll = async (e) => {
    e?.stopPropagation()
    try {
      if (enrolled) {
        setShowUnenrollModal(true)
      } else {
        await enrollCourse(courseId)
        toast.success('Successfully enrolled in course')
        navigate('/learning')
      }
    } catch (error) {
      console.error('Error during enrollment action:', error)
      toast.error(error.message || 'Failed to update enrollment')
    }
  }

  const handleConfirmUnenroll = async () => {
    try {
      setShowUnenrollModal(false)
      await unenrollCourse(courseId)
      toast.success('Successfully unenrolled from course')
    } catch (error) {
      console.error('Error unenrolling from course:', error)
      toast.error(error.message || 'Failed to unenroll')
    }
  }

  const overallProgress = course?.modules
    ? Math.round(
      course.modules.reduce((sum, m) => sum + (moduleProgress[m._id] || m.progress || 0), 0) /
      course.modules.length,
    )
    : 0

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course not found</h2>
          <Link to="/courses" className="text-blue-600 hover:underline">
            Back to courses
          </Link>
        </div>
      </div>
    )
  }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-white flex items-center justify-center">
  //       <div className="flex flex-col items-center gap-4">
  //         <Loader size={40} className="animate-spin text-blue-600" />
  //         <p className="text-gray-600 text-lg">Loading course details...</p>
  //       </div>
  //     </div>
  //   )
  // }

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course not found</h2>
          <Link to="/courses" className="text-blue-600 hover:underline">
            Back to courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-black tracking-tight">{course.title}</h1>
        </div>

        {enrolled && (
          <div className="w-full h-0.5 bg-gray-200">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${overallProgress}%` }} />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="w-full mx-2 px-6 py-10">
        <div className="mb-12 pb-8 border-b border-gray-200">
          <div className="flex items-start justify-between gap-8 mb-6">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-3">About Course</p>
              <p className="text-sm text-gray-700 leading-relaxed">{course.description}</p>
              <p className="text-xs text-gray-500 mt-4">
                <span className="font-semibold">Difficulty:</span> {course.difficulty || 'N/A'} •
                <span className="font-semibold ml-3">Duration:</span> {course.duration || 'N/A'} •
                <span className="font-semibold ml-3">Students:</span> {course.enrolledStudents || 0}
              </p>
            </div>
            <button
              onClick={handleEnroll}
              disabled={enrollmentLoading || completed}
              className={`shrink-0 px-6 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 ${completed
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : enrolled
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              {enrollmentLoading ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  {enrolled ? "Unenrolling..." : "Enrolling..."}
                </>
              ) : completed ? (
                <>
                  <CheckCircle size={16} />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  {enrolled ? "✓ Enrolled" : "Enroll"}
                </>
              )}
            </button>
          </div>

          {enrolled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Progress</p>
                <span className="text-xs font-bold text-blue-600">{overallProgress}%</span>
              </div>
              <div className="relative h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full shadow-sm transition-all duration-500"
                  style={{ left: `calc(${overallProgress}% - 5px)` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modules section */}
        {course.modules && course.modules.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-4">Modules</p>
            {course.modules.map((module, idx) => (
              <ModuleItem
                key={module._id}
                module={module}
                index={idx}
                enrolled={enrolled}
                expandedModule={expandedModule}
                setExpandedModule={setExpandedModule}
                moduleProgress={moduleProgress}
                setModuleProgress={setModuleProgress}
              />
            ))}
          </div>
        )}
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
              Are you sure you want to unenroll from <strong>{course.title}</strong>? Your progress will be saved, but you'll lose access to course content.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUnenrollModal(false)}
                disabled={enrollmentLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnenroll}
                disabled={enrollmentLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrollmentLoading ? (
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
