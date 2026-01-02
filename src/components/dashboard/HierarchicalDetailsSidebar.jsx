import React, { useState, useEffect } from "react";
import {
  FaChevronDown, FaChevronUp, FaTimes, FaGraduationCap, FaTrophy,
  FaCertificate, FaBook, FaQuestionCircle
} from "react-icons/fa";
import { useApp } from "../../context/AppContext";

const HierarchicalDetailsSidebar = ({ isOpen, onClose, item, type }) => {
  const { courses, professions, fetchModuleDetails, moduleCache } = useApp();
  const [expandedItems, setExpandedItems] = useState({});
  const [moduleDetails, setModuleDetails] = useState({});
  const [selectedModule, setSelectedModule] = useState(null);

  // Fetch module details when sidebar opens
  useEffect(() => {
    if (!isOpen || !item) return;

    const fetchModules = async () => {
      const details = {};
      let modulesToFetch = [];

      if (type === "course" && item?.modules) {
        modulesToFetch = item.modules;
      } else if (type === "profession" && item?.courses) {
        // Get all modules from all courses in the profession
        for (const courseRef of item.courses) {
          const courseId = courseRef.course || courseRef;
          const course = courses.find(c => c._id === courseId);
          if (course?.modules) {
            modulesToFetch = [...modulesToFetch, ...course.modules];
          }
        }
      }

      for (const moduleId of modulesToFetch) {
        // Extract ID if moduleId is an object (it should be a string)
        const moduleIdStr = typeof moduleId === 'string' ? moduleId : (moduleId?._id || moduleId?.id);

        if (!moduleIdStr) continue; // Skip if no valid ID

        if (moduleCache[moduleIdStr]) {
          details[moduleIdStr] = moduleCache[moduleIdStr];
        } else {
          try {
            const moduleData = await fetchModuleDetails(moduleIdStr);
            if (moduleData) {
              details[moduleIdStr] = moduleData;
            }
          } catch (error) {
            console.error(`Error fetching module ${moduleIdStr}:`, error);
          }
        }
      }
      setModuleDetails(details);
    };

    fetchModules();
  }, [isOpen, type, item, courses, fetchModuleDetails, moduleCache]);

  if (!isOpen || !item) return null;

  const toggleExpand = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getRelatedCourses = () => {
    if (type === "course") return [];
    if (type === "profession" && item.courses) {
      return item.courses
        .map(c => {
          const course = courses.find(co => co._id === (c.course || c));
          return course;
        })
        .filter(Boolean);
    }
    return [];
  };

  const getCoursesForItem = () => {
    if (type === "course") return [item];
    return getRelatedCourses();
  };

  const renderTheory = (module, moduleKey) => {
    if (!module?.theoryNotes?.text) return null;

    const theoryKey = `theory-${moduleKey}`;
    const isExpanded = expandedItems[theoryKey];

    return (
      <div className="mt-3 border border-blue-200 rounded-lg overflow-hidden bg-white">
        {/* Theory Header - Clickable Dropdown */}
        <button
          onClick={() => toggleExpand(theoryKey)}
          className="w-full px-3 py-2 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-between"
        >
          <h5 className="text-xs font-semibold text-blue-900 flex items-center gap-2">
            <FaBook size={12} /> Theory Notes
          </h5>
          {isExpanded ? (
            <FaChevronUp className="text-blue-600" size={12} />
          ) : (
            <FaChevronDown className="text-blue-400" size={12} />
          )}
        </button>

        {/* Theory Content - Expandable */}
        {isExpanded && (
          <div className="px-3 py-3 bg-blue-50 border-t border-blue-200 max-h-96 overflow-y-auto prose prose-sm text-xs text-blue-800">
            {/* Render HTML content safely */}
            <div
              className="text-xs text-blue-900 space-y-2"
              dangerouslySetInnerHTML={{ __html: module.theoryNotes.text }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderInterviewQuestions = (module) => {
    if (!module?.interviewQuestions || module.interviewQuestions.length === 0) return null;

    return (
      <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <h5 className="text-xs font-semibold text-amber-900 flex items-center gap-2 mb-2">
          <FaQuestionCircle size={12} /> Interview Questions
        </h5>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {module.interviewQuestions.slice(0, 3).map((q, idx) => (
            <div key={idx} className="text-xs">
              <p className="font-semibold text-amber-900">Q{idx + 1}: {q.question || q}</p>
              {q.suggestedAnswer && (
                <p className="text-amber-800 mt-1 italic">
                  A: {q.suggestedAnswer.substring(0, 100)}...
                </p>
              )}
            </div>
          ))}
          {module.interviewQuestions.length > 3 && (
            <p className="text-amber-700 italic text-xs">+ {module.interviewQuestions.length - 3} more questions</p>
          )}
        </div>
      </div>
    );
  };

  const relatedCourses = getRelatedCourses();
  const allCoursesForDisplay = getCoursesForItem();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0  bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar - Wider for hierarchical display */}
      <div
        className="fixed right-0 top-0 h-screen w-full sm:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto flex flex-col"
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
            {item.completionMetadata?.completedDate && (
              <p className="text-xs opacity-90 mt-1">
                Completed: {new Date(item.completionMetadata.completedDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 hover:bg-opacity-20 hover:bg-white rounded-lg transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

          {/* Courses Level (for Professions) */}
          {type === "profession" && relatedCourses.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-800 border-b-2 border-purple-500 pb-2">
                📚 Courses in this Profession
              </h3>
              {relatedCourses.map((course, courseIdx) => {
                const courseKey = `course-${course._id}`;
                const isExpanded = expandedItems[courseKey];
                const courseModules = course.modules || [];

                return (
                  <div key={course._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Course Header */}
                    <button
                      onClick={() => toggleExpand(courseKey)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <FaGraduationCap className="text-blue-600 shrink-0" size={16} />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{courseIdx + 1}. {course.title}</p>
                          <p className="text-xs text-gray-600">{courseModules.length} modules</p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <FaChevronUp className="text-blue-600" size={14} />
                      ) : (
                        <FaChevronDown className="text-gray-400" size={14} />
                      )}
                    </button>

                    {/* Modules for this Course */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
                        {courseModules.length > 0 ? (
                          courseModules.map((moduleItem, moduleIdx) => {
                            // Extract module ID - handle both string IDs and object references
                            const moduleId = typeof moduleItem === 'string' ? moduleItem : (moduleItem?._id || moduleItem?.id);
                            if (!moduleId) return null;

                            const module = moduleDetails[moduleId];
                            const moduleKey = `module-${moduleId}`;
                            const moduleExpanded = expandedItems[moduleKey];

                            return (
                              <div key={moduleId} className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                                {/* Module Header */}
                                <button
                                  onClick={() => {
                                    toggleExpand(moduleKey);
                                    setSelectedModule(moduleExpanded ? null : moduleId);
                                  }}
                                  className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2 flex-1 text-left">
                                    <span className="text-xs font-bold w-6 h-6 flex items-center justify-center bg-blue-500 text-white rounded-full">
                                      {moduleIdx + 1}
                                    </span>
                                    <div>
                                      <p className="text-xs font-semibold text-gray-800">{module?.title || 'Loading...'}</p>
                                    </div>
                                  </div>
                                  {moduleExpanded ? (
                                    <FaChevronUp className="text-gray-600" size={12} />
                                  ) : (
                                    <FaChevronDown className="text-gray-400" size={12} />
                                  )}
                                </button>

                                {/* Module Content */}
                                {moduleExpanded && module && (
                                  <div className="px-3 py-3 space-y-2 text-xs">
                                    {/* Theory */}
                                    {renderTheory(module, moduleKey)}

                                    {/* Interview Questions */}
                                    {renderInterviewQuestions(module)}

                                    {/* Topics */}
                                    {module.topics && module.topics.length > 0 && (
                                      <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                                        <p className="font-semibold text-green-900 mb-1">Topics Covered:</p>
                                        <ul className="space-y-0.5">
                                          {module.topics.slice(0, 5).map((topic, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-green-800">
                                              <span className="mt-1">•</span>
                                              <span>{topic.title || topic}</span>
                                            </li>
                                          ))}
                                          {module.topics.length > 5 && (
                                            <li className="text-green-700 italic">+ {module.topics.length - 5} more topics</li>
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-gray-500">No modules in this course</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Modules Level (for Courses) */}
          {type === "course" && item.modules && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-800 border-b-2 border-blue-500 pb-2">
                📚 Modules in this Course
              </h3>
              {item.modules.map((moduleItem, moduleIdx) => {
                // Extract module ID - handle both string IDs and object references
                const moduleId = typeof moduleItem === 'string' ? moduleItem : (moduleItem?._id || moduleItem?.id);
                if (!moduleId) return null;

                const module = moduleDetails[moduleId];
                const moduleKey = `module-${moduleId}`;
                const isExpanded = expandedItems[moduleKey];

                return (
                  <div key={moduleId} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Module Header */}
                    <button
                      onClick={() => {
                        toggleExpand(moduleKey);
                        setSelectedModule(isExpanded ? null : moduleId);
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <span className="text-sm font-bold w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full">
                          {moduleIdx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{module?.title || 'Loading...'}</p>
                          {module?.topics && (
                            <p className="text-xs text-gray-600">{module.topics.length} topics</p>
                          )}
                        </div>
                      </div>
                      {isExpanded ? (
                        <FaChevronUp className="text-blue-600" size={16} />
                      ) : (
                        <FaChevronDown className="text-gray-400" size={16} />
                      )}
                    </button>

                    {/* Module Content */}
                    {isExpanded && module && (
                      <div className="px-4 py-4 bg-gray-50 space-y-4 border-t border-gray-200">
                        {/* Theory */}
                        {renderTheory(module, moduleKey)}

                        {/* Interview Questions */}
                        {renderInterviewQuestions(module)}

                        {/* Topics */}
                        {module.topics && module.topics.length > 0 && (
                          <div className="p-3 bg-green-50 rounded border border-green-200">
                            <p className="text-xs font-semibold text-green-900 mb-2">📝 Topics Covered</p>
                            <ul className="space-y-1">
                              {module.topics.slice(0, 8).map((topic, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-green-800">
                                  <span className="mt-0.5">•</span>
                                  <span>{topic.title || topic}</span>
                                </li>
                              ))}
                              {module.topics.length > 8 && (
                                <li className="text-green-700 italic text-xs">+ {module.topics.length - 8} more topics</li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Completion Status */}
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
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Summary Section */}
          <div className="border-t-2 border-gray-200 pt-4 mt-6">
            <h3 className="text-sm font-bold text-gray-800 mb-3">📊 Summary</h3>
            <div className="grid grid-cols-2 gap-3">
              {type === "course" && item.modules && (
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold">Total Modules</p>
                  <p className="text-2xl font-bold text-blue-700">{item.modules.length}</p>
                </div>
              )}
              {type === "profession" && relatedCourses.length > 0 && (
                <div className="p-3 bg-purple-50 rounded border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold">Total Courses</p>
                  <p className="text-2xl font-bold text-purple-700">{relatedCourses.length}</p>
                </div>
              )}
              {item.completionMetadata?.points && (
                <div className="p-3 bg-amber-50 rounded border border-amber-200">
                  <p className="text-xs text-amber-600 font-semibold">Points Earned</p>
                  <p className="text-2xl font-bold text-amber-700">+{item.completionMetadata.points}</p>
                </div>
              )}
              {item.completionMetadata?.certificate && (
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                    <FaCertificate size={12} /> Certificate
                  </p>
                  <p className="text-sm font-bold text-green-700">✓ Awarded</p>
                </div>
              )}
            </div>
          </div>
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

export default HierarchicalDetailsSidebar;
