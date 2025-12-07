import { useState } from "react";
import { Search, Filter, Briefcase, Loader } from "lucide-react";
import toast from "react-hot-toast";
import ProfessionCard from "../../components/ui/ProfessionCard";
import { useApp } from "../../context/AppContext";

const Professions = () => {
  const { professions, professionsLoading, enrollProfession, unenrollProfession, enrollmentLoading, isProfessionEnrolled } = useApp();
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProfessions = professions.filter((profession) => {
    const difficultyMatch =
      filterDifficulty === "all" || profession.difficulty === filterDifficulty;
    const searchMatch =
      profession.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profession.description.toLowerCase().includes(searchQuery.toLowerCase());
    return difficultyMatch && searchMatch;
  });

  const handleEnroll = async (professionId) => {
    try {
      if (isProfessionEnrolled(professionId)) {
        // Unenroll from profession
        await unenrollProfession(professionId);
        toast.success('Unenrolled from profession');
      } else {
        // Enroll in profession
        await enrollProfession(professionId);
        toast.success('Successfully enrolled in profession');
      }
    } catch (error) {
      console.error('Error toggling enrollment:', error);
      toast.error(error.message || 'Failed to update enrollment');
    }
  };

  if (professionsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size={40} className="animate-spin text-blue-600" />
          <p className="text-gray-600 text-lg">Loading professions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 pb-12">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">
          <span className="text-blue-600">Explore</span> Professions
        </h1>
        <p className="text-gray-500 text-base">
          Discover and enroll in professional pathways to advance your career
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search professions by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Difficulty Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="w-4 h-4" />
            <span className="font-semibold text-sm">Level:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "beginner", "intermediate", "advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setFilterDifficulty(level)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${filterDifficulty === level
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-gray-500 text-sm font-medium">
        Showing {filteredProfessions.length} profession{filteredProfessions.length !== 1 ? "s" : ""}
      </div>

      {/* Professions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessions.map((profession) => (
          <ProfessionCard
            key={profession._id}
            data={profession}
            isEnrolled={isProfessionEnrolled(profession._id)}
            onEnroll={() => handleEnroll(profession._id)}
            isLoading={enrollmentLoading}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredProfessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No professions found
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Try adjusting your filters to explore available professions"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Professions;
