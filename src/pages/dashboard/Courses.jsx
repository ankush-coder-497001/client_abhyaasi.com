import { useState } from "react";
import { FaBook, FaFilter } from "react-icons/fa";
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
    },{
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

  const filteredCourses = courses.filter((course) => {
    const difficultyMatch =
      filterDifficulty === "all" || course.difficulty === filterDifficulty;
    return difficultyMatch && course.isPublished;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 py-5 pb-12">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          <span className="text-blue-600">Explore</span> Courses
        </h2>
        <p className="text-gray-500 text-base">
          Learn new skills and advance your career
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <FaFilter className="text-blue-600" />
            <span className="font-semibold text-gray-700">Filters:</span>
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-2 flex-wrap">
            {["all", "easy", "medium", "hard"].map((level) => (
              <button
                key={level}
                onClick={() => setFilterDifficulty(level)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  filterDifficulty === level
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <LearningCard key={course._id} data={course} />
        ))}
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
