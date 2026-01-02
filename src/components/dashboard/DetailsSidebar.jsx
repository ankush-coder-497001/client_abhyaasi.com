import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaTimes, FaGraduationCap, FaTrophy, FaCertificate } from "react-icons/fa";
import { useApp } from "../../context/AppContext";

const DetailsSidebar = ({ isOpen, onClose, item, type }) => {
  const { courses, professions, fetchModuleDetails, moduleCache } = useApp();
  const [moduleDetails, setModuleDetails] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    modules: true,
    relatedCourses: true,
    details: true,
  });

  // Fetch module details when sidebar opens or modules change
  useEffect(() => {
    if (type === "course" && item?.modules && item.modules.length > 0) {
      // Fetch all modules for this course
      const fetchModules = async () => {
        const details = {};
        for (const moduleId of item.modules) {
          if (moduleCache[moduleId]) {
            details[moduleId] = moduleCache[moduleId];
          } else {
            const moduleData = await fetchModuleDetails(moduleId);
            console.log(`Module data for ${moduleId}:`, moduleData);
            if (moduleData) {
              details[moduleId] = moduleData;
            }
          }
        }
        setModuleDetails(details);
      };
      fetchModules();
    }
  }, [type, item?.modules, fetchModuleDetails, moduleCache]);

  if (!isOpen || !item) return null;

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Get full course data
  const courseData = type === "course" ? item : null;

  // Get related courses for profession
  const relatedCourses = type === "profession" && item.courses
    ? item.courses.map(c => {
      const course = courses.find(co => co._id === (c.course || c));
      return course;
    }).filter(Boolean)
    : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0  bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto flex flex-col"
        style={{ animation: "slideInRight 0.3s ease-out" }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 flex items-start justify-between gap-4 z-10"
          style={type === "profession" ? {
            backgroundImage: 'linear-gradient(to right, #9333ea, #a855f7)'
          } : undefined}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {type === "course" ? (
                <FaGraduationCap size={16} />
              ) : (
                <FaTrophy size={16} />
              )}
              <span className="text-xs font-medium opacity-90">
                {type === "course" ? "Course Details" : "Profession Details"}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold line-clamp-2">{item.name || item.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 hover:bg-opacity-20 hover:bg-white rounded-lg transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Basic Details Section */}
          <div className="border-b border-gray-200">
            <button
              onClick={() => toggleSection("details")}
              className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-800">Details</span>
              {expandedSections.details ? (
                <FaChevronUp className={type === "profession" ? "text-purple-600" : "text-blue-600"} />
              ) : (
                <FaChevronDown className="text-gray-400" />
              )}
            </button>
            {expandedSections.details && (
              <div className="px-4 sm:px-6 pb-4 space-y-3">
                {/* Description */}
                {(item.description || item.estimatedDuration) && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Description
                    </p>
                    <p className="text-sm text-gray-700">
                      {item.description || "No description available"}
                    </p>
                  </div>
                )}

                {/* Duration */}
                {(item.duration || item.estimatedDuration) && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Duration
                    </p>
                    <p className="text-sm text-gray-700">
                      {item.duration || item.estimatedDuration}
                    </p>
                  </div>
                )}

                {/* Difficulty (for courses) */}
                {item.difficulty && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Difficulty
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${item.difficulty === "easy"
                      ? "bg-green-100 text-green-700"
                      : item.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}>
                      {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
                    </span>
                  </div>
                )}

                {/* Tags (for professions) */}
                {item.tags && item.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Date */}
                {(item.completionMetadata?.completedDate || item.completedDate) && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                      Completed On
                    </p>
                    <p className="text-sm text-gray-700">
                      {new Date(item.completionMetadata?.completedDate || item.completedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {/* Certificate Points */}
                {(item.completionMetadata?.points || item.points) && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCertificate className="text-blue-600" size={14} />
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Certificate Points
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">+{item.completionMetadata?.points || item.points}</p>
                  </div>
                )}

                {/* Certificate Badge */}
                {(item.completionMetadata?.certificate || item.certificate) && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <FaCertificate className="text-green-600" size={14} />
                      <span className="text-sm font-medium text-green-700">
                        Certificate Awarded
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modules Section (for courses) */}
          {type === "course" && courseData?.modules && courseData.modules.length > 0 && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection("modules")}
                className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800">
                  Modules ({courseData.modules.length})
                </span>
                {expandedSections.modules ? (
                  <FaChevronUp className="text-blue-600" />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>
              {expandedSections.modules && (
                <div className="px-4 sm:px-6 pb-4 space-y-4">
                  {courseData.modules.map((moduleId, idx) => {
                    const module = moduleDetails[moduleId];
                    return (
                      <div
                        key={moduleId || idx}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4 space-y-3"
                      >
                        {/* Module Header */}
                        <div>
                          <p className="text-sm font-bold text-blue-900">
                            Module {idx + 1}: {module?.title || "Loading..."}
                          </p>
                          {module?.order && (
                            <p className="text-xs text-blue-600 mt-0.5">Order: {module.order}</p>
                          )}
                        </div>

                        {/* Topics Covered */}
                        {module?.topics && module.topics.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-blue-800 uppercase">📚 Topics Covered</p>
                            <ul className="text-xs text-blue-700 space-y-0.5">
                              {module.topics.slice(0, 3).map((topic, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-0.5">•</span>
                                  <span>{topic.title || topic}</span>
                                </li>
                              ))}
                              {module.topics.length > 3 && (
                                <li className="text-blue-600 italic">+ {module.topics.length - 3} more topics</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Learning Components */}
                        <div className="grid grid-cols-2 gap-2">
                          {module?.mcqs && module.mcqs.length > 0 && (
                            <div className="bg-white rounded p-2 border border-blue-200">
                              <p className="text-xs font-semibold text-gray-700">MCQ Questions</p>
                              <p className="text-sm font-bold text-blue-600">{module.mcqs.length}</p>
                              {module.mcqScore !== undefined && (
                                <p className="text-xs text-gray-600">Score: {module.mcqScore}%</p>
                              )}
                            </div>
                          )}
                          {module?.codingTask && (
                            <div className="bg-white rounded p-2 border border-blue-200">
                              <p className="text-xs font-semibold text-gray-700">Coding Task</p>
                              <p className="text-sm font-bold text-green-600">1</p>
                              {module.codingScore !== undefined && (
                                <p className="text-xs text-gray-600">Score: {module.codingScore}%</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Interview Questions */}
                        {module?.interviewQuestions && module.interviewQuestions.length > 0 && (
                          <div className="space-y-1 bg-white rounded p-2 border border-amber-200">
                            <p className="text-xs font-semibold text-amber-800 uppercase">❓ Interview Questions</p>
                            <ul className="text-xs text-gray-700 space-y-1">
                              {module.interviewQuestions.slice(0, 2).map((q, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-amber-600 font-bold">{i + 1}.</span>
                                  <span className="line-clamp-2">{q.question || q}</span>
                                </li>
                              ))}
                              {module.interviewQuestions.length > 2 && (
                                <li className="text-amber-600 italic text-xs">+ {module.interviewQuestions.length - 2} more questions</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Completion Status */}
                        {module && (
                          <div className="flex flex-wrap gap-2">
                            {module.isMcqCompleted && (
                              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                ✓ MCQ Passed
                              </span>
                            )}
                            {module.isCodingCompleted && (
                              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                ✓ Coding Passed
                              </span>
                            )}
                            {module.isModuleCompleted && (
                              <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                                ✓ Module Complete
                              </span>
                            )}
                          </div>
                        )}

                        {!module && (
                          <p className="text-xs text-gray-500 text-center py-2">Loading module details...</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Courses Section (for professions) */}
          {type === "profession" && relatedCourses.length > 0 && (
            <div className="border-b border-gray-200">
              <button
                onClick={() => toggleSection("relatedCourses")}
                className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800">
                  Courses ({relatedCourses.length})
                </span>
                {expandedSections.relatedCourses ? (
                  <FaChevronUp className="text-blue-600" />
                ) : (
                  <FaChevronDown className="text-gray-400" />
                )}
              </button>
              {expandedSections.relatedCourses && (
                <div className="px-4 sm:px-6 pb-4 space-y-2">
                  {relatedCourses.map((course, idx) => (
                    <div
                      key={course._id || idx}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {course.title || "Untitled Course"}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                        {course.difficulty && (
                          <span className={`px-2 py-0.5 rounded-full ${course.difficulty === "easy"
                            ? "bg-green-100 text-green-700"
                            : course.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                            }`}>
                            {course.difficulty}
                          </span>
                        )}
                        {course.duration && (
                          <span className="text-gray-600">{course.duration}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default DetailsSidebar;
