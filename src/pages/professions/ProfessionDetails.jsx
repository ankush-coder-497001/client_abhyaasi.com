"use client"

import { useState } from "react"
import { ChevronDown, ArrowLeft, Play, Loader, X, BookOpen, CheckCircle } from "lucide-react"
import { useParams, Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useApp } from "../../context/AppContext"

function CourseItem({ course, courseData, index, enrolled, expandedCourse, setExpandedCourse, courseProgress, setCourseProgress }) {
  const handleResumeClick = (e) => {
    e.stopPropagation()
    if (courseProgress[course.course] === undefined) {
      setCourseProgress({ ...courseProgress, [course.course]: 5 })
    } else {
      setCourseProgress({ ...courseProgress, [course.course]: Math.min(courseProgress[course.course] + 10, 100) })
    }
  }

  const currentProgress = courseProgress[course.course] || courseData?.progress || 0
  const isExpanded = expandedCourse === course.course
  const [expandedModule, setExpandedModule] = useState(null)

  return (
    <div key={course._id} className="group">
      <button
        onClick={() => setExpandedCourse(isExpanded ? null : course.course)}
        className="w-full transition-all duration-300"
      >
        <div className="px-6 py-5 flex items-start justify-between gap-4 border border-gray-200 rounded-xl bg-white hover:border-purple-400 hover:shadow-lg transition-all duration-300">
          {/* Course number and title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-purple-600 rounded-lg text-sm font-bold text-white">
              {index + 1}
            </div>
            <div className="min-w-0 text-left">
              <h3 className="text-base font-semibold text-black truncate">{courseData?.title || 'Course'}</h3>
              <p className="text-xs text-gray-500 mt-1.5">
                {courseData?.duration || "N/A"} • {courseData?.modules?.length || 0} modules
              </p>
            </div>
          </div>

          {enrolled && (
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 transition-all duration-500"
                    style={{ width: `${currentProgress}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-purple-600 rounded-full shadow-md transition-all duration-500"
                    style={{ left: `calc(${currentProgress}% - 5px)` }}
                  />
                </div>
                <span className="text-xs font-semibold text-purple-600">{currentProgress}%</span>
              </div>

              <button
                onClick={handleResumeClick}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                Resume
              </button>
            </div>
          )}

          {/* Chevron */}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 shrink-0 ${isExpanded ? "rotate-180" : ""
              }`}
          />
        </div>
      </button>

      {isExpanded && courseData?.modules && courseData.modules.length > 0 && (
        <div className="border border-t-0 border-gray-200 rounded-b-xl bg-gray-50 px-6 py-4 space-y-3 animate-in fade-in duration-300">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Modules</p>
          <div className="space-y-2">
            {courseData.modules.map((module, moduleIdx) => (
              <div key={module._id || moduleIdx} className="group">
                <button
                  onClick={() => setExpandedModule(expandedModule === module._id ? null : module._id)}
                  className="w-full transition-all duration-300"
                >
                  <div className="flex items-center justify-between text-xs px-4 py-2.5 rounded-lg bg-white border border-gray-150 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                      <p className="text-gray-700 font-medium">{module.title || 'Module'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-500 font-medium">{module.duration || ''}</p>
                      <ChevronDown
                        className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${expandedModule === module._id ? "rotate-180" : ""
                          }`}
                      />
                    </div>
                  </div>
                </button>

                {expandedModule === module._id && module.topics && module.topics.length > 0 && (
                  <div className="border border-t-0 border-gray-150 rounded-b-lg bg-gray-100 px-4 py-3 mt-0.5 space-y-2 animate-in fade-in duration-300">
                    {module.topics.map((topic, topicIdx) => (
                      <div
                        key={topicIdx}
                        className="flex items-center justify-between text-xs px-3 py-2 rounded bg-white border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-purple-600" />
                          <p className="text-gray-700">{typeof topic === 'string' ? topic : topic.title || 'Topic'}</p>
                        </div>
                        <p className="text-gray-500">{typeof topic === 'object' && topic.duration ? topic.duration : ''}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProfessionDetails() {
  const navigate = useNavigate()
  const { professionId } = useParams()
  const { professions, courses, enrollmentLoading, isProfessionEnrolled, isProfessionCompleted, enrollProfession, unenrollProfession } = useApp()
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [courseProgress, setCourseProgress] = useState({})
  const [showUnenrollModal, setShowUnenrollModal] = useState(false)

  // Get profession from context
  const profession = professions.find(p => p._id === professionId)
  const enrolled = profession ? isProfessionEnrolled(professionId) : false
  const completed = profession ? isProfessionCompleted(professionId) : false

  // Enrich profession courses with full course data
  const enrichedCourses = profession?.courses?.map(pc => ({
    ...pc,
    courseData: courses.find(c => c._id === pc.course)
  })) || []

  const handleEnroll = async (e) => {
    e?.stopPropagation()
    try {
      if (enrolled) {
        setShowUnenrollModal(true)
      } else {
        await enrollProfession(professionId)
        toast.success('Successfully enrolled in profession')
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
      await unenrollProfession(professionId)
      toast.success('Successfully unenrolled from profession')
    } catch (error) {
      console.error('Error unenrolling from profession:', error)
      toast.error(error.message || 'Failed to unenroll')
    }
  }

  const overallProgress = enrichedCourses
    ? Math.round(
      enrichedCourses.reduce((sum, c) => sum + (courseProgress[c.course] || c.courseData?.progress || 0), 0) /
      (enrichedCourses.length || 1),
    )
    : 0

  if (!profession) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profession not found</h2>
          <Link to="/professions" className="text-blue-600 hover:underline">
            Back to professions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header with back button */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
              title="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-black tracking-tight flex-1">{profession.name}</h1>
          </div>
        </div>

        {enrolled && (
          <div className="w-full h-0.5 bg-gray-200">
            <div className="h-full bg-purple-600 transition-all duration-500" style={{ width: `${overallProgress}%` }} />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="w-full mx-2 px-6 py-10">
        <div className="mb-12 pb-8 border-b border-gray-200">
          <div className="flex items-start justify-between gap-8 mb-6">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-3">About Profession</p>
              <p className="text-sm text-gray-700 leading-relaxed">{profession.description}</p>
              <p className="text-xs text-gray-500 mt-4">
                <span className="font-semibold">Duration:</span> {profession.estimatedDuration || 'N/A'} •
                <span className="font-semibold ml-3">Courses:</span> {profession.courses?.length || 0} •
                <span className="font-semibold ml-3">Skills:</span> {profession.tags?.length || 0}
              </p>
            </div>
            <button
              onClick={handleEnroll}
              disabled={enrollmentLoading || completed}
              className={`shrink-0 px-6 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 ${completed
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : enrolled
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-purple-600 text-white hover:bg-purple-700"
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
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Overall Progress</p>
                <span className="text-xs font-bold text-purple-600">{overallProgress}%</span>
              </div>
              <div className="relative h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-purple-600 rounded-full shadow-sm transition-all duration-500"
                  style={{ left: `calc(${overallProgress}% - 5px)` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Profession Hierarchy */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-purple-600" />
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Profession Pathway</p>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            {profession.name} → Courses → Modules
          </p>
        </div>

        {/* Courses section */}
        {enrichedCourses && enrichedCourses.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-4">Courses</p>
            {enrichedCourses
              .sort((a, b) => a.order - b.order)
              .map((course, idx) => (
                <CourseItem
                  key={course._id}
                  course={course}
                  courseData={course.courseData}
                  index={idx}
                  enrolled={enrolled}
                  expandedCourse={expandedCourse}
                  setExpandedCourse={setExpandedCourse}
                  courseProgress={courseProgress}
                  setCourseProgress={setCourseProgress}
                />
              ))}
          </div>
        )}

        {/* No courses */}
        {(!enrichedCourses || enrichedCourses.length === 0) && (
          <div className="text-center py-8">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No courses added to this profession yet</p>
          </div>
        )}
      </div>

      {/* Unenroll Confirmation Modal */}
      {showUnenrollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Unenroll from Profession</h3>
              <button
                onClick={() => setShowUnenrollModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to unenroll from <strong>{profession.name}</strong>? Your progress will be saved, but you'll lose access to profession content.
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
