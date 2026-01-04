"use client"

import { useState } from "react"
import { Search, BookOpen, Loader } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import LearningCard from "../../components/ui/LearningCard"
import { useApp } from "../../context/AppContext"

const Courses = () => {
  const navigate = useNavigate()
  const {
    courses,
    coursesLoading,
    enrollCourse,
    unenrollCourse,
    enrollmentLoading,
    isCoursEnrolled,
    isCourseCompleted,
  } = useApp()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCourses = courses.filter((course) => {
    const searchMatch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return course.status === "published" && searchMatch
  })

  const handleEnroll = async (courseId) => {
    try {
      if (isCoursEnrolled(courseId)) {
        await unenrollCourse(courseId)
        toast.success("Unenrolled from course")
      } else {
        await enrollCourse(courseId)
        toast.success("Successfully enrolled in course")
        navigate("/learning")
      }
    } catch (error) {
      console.error("Error toggling enrollment:", error)
      toast.error(error.message || "Failed to update enrollment")
    }
  }

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size={40} className="animate-spin text-blue-600" />
          <p className="text-gray-600 text-lg">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100/50">
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Search Bar Container */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            {/* Search Input */}
            <div className="w-full md:w-96 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-slate-600/10 rounded-full blur-lg group-focus-within:blur-xl transition-all duration-300 opacity-0 group-focus-within:opacity-100" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-5 py-3 rounded-full border border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg text-sm"
                />
              </div>
            </div>

            {/* Results Count */}
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-slate-600">
                <span className="text-blue-600 font-semibold">{filteredCourses.length}</span>
                <span className="ml-2">course{filteredCourses.length !== 1 ? "s" : ""}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {filteredCourses.length === 0 ? (
          // No Results State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No courses found</h3>
            <p className="text-slate-500 text-center max-w-md text-sm">
              {searchQuery
                ? "Try adjusting your search terms to discover available courses"
                : "Explore our course collection to get started"}
            </p>
          </div>
        ) : (
          // Courses Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredCourses.map((course) => (
              <LearningCard
                key={course._id}
                data={course}
                isEnrolled={isCoursEnrolled(course._id)}
                isCompleted={isCourseCompleted(course._id)}
                onEnroll={() => handleEnroll(course._id)}
                isLoading={enrollmentLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses
