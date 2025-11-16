import React from "react";
import { FaBook, FaClock, FaUserGraduate } from "react-icons/fa";

const LearningCard = ({ data }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer border border-gray-100"
    >
      {/* Thumbnail */}
      <div className="relative h-60 bg-gray-200 overflow-hidden">
        <img
          src={data.thumbnailUrl}
          alt={data.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getDifficultyColor(
              data.difficulty
            )}`}
          >
            {data.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {data.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {data.description}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <FaClock className="text-blue-600" />
            <span>{data.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBook className="text-green-600" />
            <span>{data.moduleCount} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <FaUserGraduate className="text-purple-600" />
            <span>{data.enrolledStudents} enrolled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningCard;
