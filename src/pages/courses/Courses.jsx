import { useState } from "react";
import { Search, Filter, BookOpen } from "lucide-react";
import LearningCard from "../../components/ui/LearningCard";

const Courses = () => {
  const courses = [
    {
      _id: "c1",
      title: "Introduction to Python",
      slug: "introduction-to-python",
      description:
        "A hands-on Python course designed to teach you programming fundamentals through examples, quizzes, and coding exercises.",
      difficulty: "medium",
      duration: "4 weeks",
      status: "draft",
      isPublished: true,
      thumbnailUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png",
      moduleCount: 8,
      enrolledStudents: 245,
    }, {
      _id: "o1",
      title: "Introduction to Python",
      slug: "introduction-to-python",
      description:
        "A hands-on Python course designed to teach you programming fundamentals through examples, quizzes, and coding exercises.",
      difficulty: "medium",
      duration: "4 weeks",
      status: "draft",
      isPublished: true,
      thumbnailUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png",
      moduleCount: 8,
      enrolledStudents: 245,
    },
    {
      _id: "c2",
      title: "JavaScript Essentials",
      slug: "javascript-essentials",
      description:
        "Learn core JavaScript concepts, DOM manipulation, and modern ES6+ features.",
      difficulty: "medium",
      duration: "3 weeks",
      status: "published",
      isPublished: true,
      thumbnailUrl:
        "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
      moduleCount: 6,
      enrolledStudents: 389,
    },
    {
      _id: "c3",
      title: "React for Beginners",
      slug: "react-for-beginners",
      description: "Build interactive UI using React, components, and hooks.",
      difficulty: "medium",
      duration: "4 weeks",
      status: "draft",
      isPublished: false,
      thumbnailUrl:
        "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      moduleCount: 7,
      enrolledStudents: 156,
    },
    {
      _id: "c4",
      title: "Node.js Fundamentals",
      slug: "nodejs-fundamentals",
      description:
        "Learn backend development using Node.js, Express, and APIs.",
      difficulty: "hard",
      duration: "5 weeks",
      status: "published",
      isPublished: true,
      thumbnailUrl:
        "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
      moduleCount: 9,
      enrolledStudents: 178,
    },
    {
      _id: "c5",
      title: "Data Structures & Algorithms",
      slug: "data-structures-algorithms",
      description:
        "Master fundamental DS & Algo concepts for interviews and problem-solving.",
      difficulty: "hard",
      duration: "6 weeks",
      status: "draft",
      isPublished: false,
      thumbnailUrl:
        "https://upload.wikimedia.org/wikipedia/commons/1/10/Data-structure.png",
      moduleCount: 10,
      enrolledStudents: 92,
    },
  ];

  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((course) => {
    const difficultyMatch =
      filterDifficulty === "all" || course.difficulty === filterDifficulty;
    const searchMatch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return difficultyMatch && course.isPublished && searchMatch;
  });

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 pb-12">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2">
          <span className="text-blue-600">Explore</span> Courses
        </h1>
        <p className="text-gray-500 text-base">
          Discover and enroll in premium courses to advance your skills
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Difficulty Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter className="w-4 h-4" />
            <span className="font-semibold text-sm">Difficulty:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "easy", "medium", "hard"].map((level) => (
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
        Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
      </div>      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <LearningCard key={course._id} data={course} />
        ))}
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Try adjusting your filters to explore available courses"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Courses;
