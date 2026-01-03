"use client"

import { useState } from "react"
import { Search, Briefcase, Loader, Award, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import ProfessionCard from "../../components/ui/ProfessionCard"
import { useApp } from "../../context/AppContext"

const Professions = () => {
  const navigate = useNavigate()
  const {
    professions,
    professionsLoading,
    enrollProfession,
    unenrollProfession,
    enrollmentLoading,
    isProfessionEnrolled,
    isProfessionCompleted,
  } = useApp()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProfessions = professions.filter((profession) => {
    const searchMatch =
      profession.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profession.description.toLowerCase().includes(searchQuery.toLowerCase())
    return searchMatch
  })


  const handleEnroll = async (professionId) => {
    try {
      if (isProfessionEnrolled(professionId)) {
        await unenrollProfession(professionId)
        toast.success("Unenrolled from profession")
      } else {
        await enrollProfession(professionId)
        toast.success("Successfully enrolled in profession")
        navigate("/learning")
      }
    } catch (error) {
      console.error("Error toggling enrollment:", error)
      toast.error(error.message || "Failed to update enrollment")
    }
  }

  if (professionsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size={40} className="animate-spin text-blue-600" />
          <p className="text-gray-600 text-lg">Loading professions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 md:px-8 pt-12 pb-16">


        <div className="max-w-2xl mx-auto ">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-white border border-slate-200 rounded-2xl flex items-center px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-300">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search professions by title or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ml-4 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-base"
              />
              <span className="ml-4 text-sm font-medium text-blue-600 whitespace-nowrap">
                {filteredProfessions.length} {filteredProfessions.length === 1 ? "result" : "results"}
              </span>
            </div>
          </div>
        </div>
      </div>


      <div className="px-4 md:px-8 pb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Explore All Professions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessions.map((profession) => (
              <ProfessionCard
                key={profession._id}
                data={profession}
                isEnrolled={isProfessionEnrolled(profession._id)}
                isCompleted={isProfessionCompleted(profession._id)}
                onEnroll={() => handleEnroll(profession._id)}
                isLoading={enrollmentLoading}
              />
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredProfessions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No professions found</h3>
            <p className="text-slate-500 text-center max-w-md">
              Try adjusting your search terms to explore available professions
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Professions
