"use client"

import { useState } from "react"
import { ChevronDown, ArrowLeft, Play, Loader, X, CheckCircle, Users, Clock, BarChart3, Zap } from "lucide-react"
import { useParams, Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useApp } from "../../context/AppContext"
import LearningCard from "../../components/ui/LearningCard"

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
    <div key={module._id} className="group cursor-pointer">
      <button
        onClick={() => setExpandedModule(isModuleExpanded ? null : module._id)}
        className="w-full transition-all duration-300"
      >
        <div className="relative px-4 py-3.5 flex items-start justify-between gap-3 border border-slate-200/60 rounded-xl bg-white/80 hover:bg-white hover:border-blue-300/60 hover:shadow-lg transition-all duration-300 group-hover:shadow-md">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="shrink-0 w-9 h-9 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg text-xs font-bold text-white shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              {index + 1}
            </div>
            <div className="min-w-0 text-left">
              <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{module.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {module.duration || "1 Day"} • {4 || 0} lessons
              </p>
            </div>
          </div>

          {enrolled && (
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex flex-col items-center gap-0.5">
                <div className="relative w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500"
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-blue-600">{currentProgress}%</span>
              </div>

              <button
                onClick={handleResumeClick}
                className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap flex items-center gap-1 active:scale-95"
              >
                <Play className="w-3 h-3" />
                <span className="hidden sm:inline">Resume</span>
              </button>
            </div>
          )}

          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 group-hover:text-blue-600 ${isModuleExpanded ? "rotate-180" : ""
              }`}
          />
        </div>
      </button>

      {isModuleExpanded && module.topics && (
        <div className="mt-2 ml-2.5 pl-3.5 border-l-2 border-blue-300/40 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          {module.topics.map((topic, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-100/40 hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-100/50 hover:to-purple-100/50 transition-all duration-200 text-xs"
            >
              <div className="w-1 h-1 rounded-full bg-blue-600" />
              <p className="text-slate-700 font-medium">
                {typeof topic === "string" ? topic : topic.title || "Topic"}
              </p>
            </div>
          ))}
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

  const course = courses.find((c) => c._id === courseId)
  const enrolled = course ? isCoursEnrolled(courseId) : false
  const completed = course ? isCourseCompleted(courseId) : false


  const handleEnroll = async (e) => {
    e?.stopPropagation()
    try {
      if (enrolled) {
        setShowUnenrollModal(true)
      } else {
        await enrollCourse(courseId)
        toast.success("Successfully enrolled in course")
        navigate("/learning")
      }
    } catch (error) {
      console.error("Error during enrollment action:", error)
      toast.error(error.message || "Failed to update enrollment")
    }
  }

  const handleConfirmUnenroll = async () => {
    try {
      setShowUnenrollModal(false)
      await unenrollCourse(courseId)
      toast.success("Successfully unenrolled from course")
    } catch (error) {
      console.error("Error unenrolling from course:", error)
      toast.error(error.message || "Failed to unenroll")
    }
  }

  const overallProgress = course?.modules
    ? Math.round(
      course.modules.reduce((sum, m) => sum + (moduleProgress[m._id] || m.progress || 0), 0) / course.modules.length,
    )
    : 0

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Course not found</h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium">
            Back to courses
          </Link>
        </div>
      </div>
    )
  }

  // Get other courses for the discovery section
  const otherCourses = courses.filter((c) => c._id !== courseId).slice(0, 6)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white text-slate-900">
      {/* Floating Header */}
      <div className="sticky top-0 z-40 backdrop-blur-sm bg-white/80 border-b border-slate-200/50 transition-all duration-300 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Link
                to="/courses"
                className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">{course.title}</h1>
            </div>
          </div>

          {enrolled && (
            <div className="w-full h-0.5 bg-slate-200 mt-3 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500 rounded-full" style={{ width: `${overallProgress}%` }} />
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Horizontal Layout */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Two Column Layout: Description + Stats (40%) | Modules Sidebar (60%) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Left Column: Course Description & Stats - 40% */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Course Title & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-3">About this course</p>
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6">{course.description}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 sm:p-6 rounded-xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 border border-blue-100/40">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Difficulty</p>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900">{course.difficulty || "N/A"}</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Duration</p>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900">{course.duration || "N/A"}</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Students</p>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900">{course.enrolledStudents || 0}</p>
                </div>
              </div>

              {/* Progress Bar */}
              {enrolled && (
                <div className="space-y-3 p-4 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Your Progress</p>
                    <span className="text-sm font-bold text-blue-600">{overallProgress}%</span>
                  </div>
                  <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Modules Sidebar - 60% */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <button
                onClick={handleEnroll}
                disabled={enrollmentLoading || completed}
                className={`w-full px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 ${completed
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : enrolled
                    ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:shadow-lg"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg"
                  }`}
              >
                {enrollmentLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>{enrolled ? "Unenrolling..." : "Enrolling..."}</span>
                  </>
                ) : completed ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Completed</span>
                  </>
                ) : (
                  <>{enrolled ? "✓ Enrolled" : "Enroll Now"}</>
                )}
              </button>

              {/* Modules Section */}
              {course.modules && course.modules.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-1">Course modules ({course.modules.length})</p>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Discover More Courses Section */}
        {otherCourses.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2">Continue Learning</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Discover More Courses</h2>
              </div>
              <Link
                to="/courses"
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherCourses.map((c) => (
                <LearningCard
                  key={c._id}
                  data={c}
                  isEnrolled={isCoursEnrolled(c._id)}
                  isCompleted={isCourseCompleted(c._id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showUnenrollModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Unenroll from course</h3>
              <button
                onClick={() => setShowUnenrollModal(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to unenroll from <strong className="text-slate-900">{course.title}</strong>? Your
              progress will be saved, but you'll lose access to course content.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUnenrollModal(false)}
                disabled={enrollmentLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-100 text-slate-900 hover:bg-slate-200 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnenroll}
                disabled={enrollmentLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
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
