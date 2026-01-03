"use client"

import { useState } from "react"
import { ChevronDown, ArrowLeft, Play, Loader, X, BookOpen, CheckCircle, Users, Clock, BarChart3 } from "lucide-react"
import { useParams, Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useApp } from "../../context/AppContext"
import LearningCard from "../../components/ui/LearningCard"

function CourseItem({ course, courseData, index, enrolled, expandedCourse, setExpandedCourse, courseProgress, setCourseProgress }) {


  const currentProgress = courseProgress[course.course] || courseData?.progress || 0
  const isExpanded = expandedCourse === course.course
  const [expandedModule, setExpandedModule] = useState(null)

  return (
    <div key={course._id} className="group cursor-pointer">
      <button
        onClick={() => setExpandedCourse(isExpanded ? null : course.course)}
        className="w-full transition-all duration-300"
      >
        <div className="relative px-4 py-3.5 flex items-start justify-between gap-3 border border-slate-200/60 rounded-xl bg-white/80 hover:bg-white hover:border-blue-300/60 hover:shadow-lg transition-all duration-300 group-hover:shadow-md">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="shrink-0 w-9 h-9 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg text-xs font-bold text-white shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
              {index + 1}
            </div>
            <div className="min-w-0 text-left">
              <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{courseData?.title || 'Course'}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {courseData?.duration || "N/A"} • {courseData?.modules?.length || 0} modules
              </p>
            </div>
          </div>

          {enrolled && (
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex flex-col items-center gap-0.5">
                <div className="relative w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-blue-600">{currentProgress}%</span>
              </div>


            </div>
          )}

          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 group-hover:text-blue-600 ${isExpanded ? "rotate-180" : ""
              }`}
          />
        </div>
      </button>

      {isExpanded && courseData?.modules && courseData.modules.length > 0 && (
        <div className="mt-2 ml-2.5 pl-3.5 border-l-2 border-blue-300/40 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3 ml-2">Modules</p>
          {courseData.modules.map((module, moduleIdx) => (
            <div key={module._id || moduleIdx} className="group">
              <button
                onClick={() => setExpandedModule(expandedModule === module._id ? null : module._id)}
                className="w-full transition-all duration-300"
              >
                <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50/50 to-slate-50/50 border border-blue-100/40 hover:border-blue-200 hover:bg-gradient-to-r hover:from-blue-100/50 hover:to-slate-100/50 transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-1 h-1 rounded-full bg-blue-600" />
                    <p className="text-slate-700 font-medium">{module.title || 'Module'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-500 font-medium">{module.duration || ''}</p>
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${expandedModule === module._id ? "rotate-180" : ""
                        }`}
                    />
                  </div>
                </div>
              </button>

              {expandedModule === module._id && module.topics && module.topics.length > 0 && (
                <div className="border border-t-0 border-blue-100/40 rounded-b-lg bg-blue-50/30 px-3 py-2.5 mt-0.5 space-y-2 animate-in fade-in duration-300">
                  {module.topics.map((topic, topicIdx) => (
                    <div
                      key={topicIdx}
                      className="flex items-center justify-between text-xs px-3 py-1.5 rounded bg-white border border-blue-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-blue-600" />
                        <p className="text-slate-700">{typeof topic === 'string' ? topic : topic.title || 'Topic'}</p>
                      </div>
                      <p className="text-slate-500">{typeof topic === 'object' && topic.duration ? topic.duration : ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
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

  // Get other professions for discovery section
  const otherProfessions = professions.filter((p) => p._id !== professionId).slice(0, 6)

  if (!profession) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Profession not found</h2>
          <Link to="/professions" className="text-blue-600 hover:underline">
            Back to professions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50/30 to-white text-slate-900">
      {/* Floating Header */}
      <div className="sticky top-0 z-40 backdrop-blur-sm bg-white/80 border-b border-slate-200/50 transition-all duration-300 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Link
                to="/professions"
                className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">{profession.name}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Horizontal Layout */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Two Column Layout: Description + Stats (40%) | Courses Sidebar (60%) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Left Column: Profession Description & Stats - 40% */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Profession Title & Description */}
              <div className="flex flex-col">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-3">About Profession</p>
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6">{profession.description}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 sm:p-6 rounded-xl bg-gradient-to-br from-blue-50/50 to-slate-50/50 border border-blue-100/40">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Duration</p>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900">{profession.estimatedDuration || "N/A"}</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Courses</p>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900">{profession.courses?.length || 0}</p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Skills</p>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-900">{profession.tags?.length || 0}</p>
                </div>
              </div>

              {/* Pathway Info */}
              <div className="p-4 sm:p-6 rounded-xl bg-blue-50/40 border border-blue-100 space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-600" />
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">Learning Pathway</p>
                </div>
                <p className="text-sm text-slate-700 font-medium">{profession.name} → Courses → Modules</p>
              </div>
            </div>
          </div>

          {/* Right Column: Courses Sidebar - 60% */}
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

              {/* Courses Section */}
              {enrichedCourses && enrichedCourses.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-1">Courses ({enrichedCourses.length})</p>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
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
                </div>
              )}

              {/* No courses */}
              {(!enrichedCourses || enrichedCourses.length === 0) && (
                <div className="text-center py-6 px-4 bg-slate-50 rounded-lg">
                  <BookOpen size={32} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-500 text-xs">No courses added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Discover More Professions Section */}
        {otherProfessions.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest mb-2">Expand Your Skills</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Discover More Professions</h2>
              </div>
              <Link
                to="/professions"
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProfessions.map((p) => (
                <Link key={p._id} to={`/profession-details/${p._id}`}>
                  <LearningCard
                    data={p}
                    isEnrolled={isProfessionEnrolled(p._id)}
                    isCompleted={isProfessionCompleted(p._id)}
                  />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Unenroll Confirmation Modal */}
      {showUnenrollModal && (
        <div className="fixed inset-0 bg-black/35 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full animate-in zoom-in-95 duration-400 border border-white/80">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-900">Unenroll from Profession</h3>
              <button
                onClick={() => setShowUnenrollModal(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-600 mb-7 leading-relaxed font-medium">
              Are you sure you want to unenroll from <strong className="text-slate-900 font-bold">{profession.name}</strong>? Your progress will be saved, but you'll lose access to profession content.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUnenrollModal(false)}
                disabled={enrollmentLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-900 hover:bg-slate-200 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnenroll}
                disabled={enrollmentLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-red-500/30"
              >
                {enrollmentLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
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
