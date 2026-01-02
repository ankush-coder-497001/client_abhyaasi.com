import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Play, Clock, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';

function ModuleProgressItem({ module, index, setExpandedModule, expandedModule }) {
  const navigate = useNavigate();

  // Determine completion status
  const isMcqCompleted = module.isMcqCompleted || false;
  const isCodingCompleted = module.isCodingCompleted || false;
  const isModuleCompleted = isMcqCompleted && isCodingCompleted;

  // Calculate progress
  let progress = 0;
  if (isMcqCompleted) progress += 50;
  if (isCodingCompleted) progress += 50;

  const isExpanded = expandedModule === module._id;

  const handleResumeClick = (e) => {
    e.stopPropagation();
    navigate('/module', { state: { moduleId: module._id } });
  };

  return (
    <div key={module._id} className="group">
      <button
        onClick={() => setExpandedModule(isExpanded ? null : module._id)}
        className="w-full transition-all duration-300"
      >
        <div className="px-6 py-5 flex items-start justify-between gap-4 border border-gray-200 rounded-xl bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-300">
          {/* Module number and title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold text-white ${isModuleCompleted ? 'bg-green-600' : 'bg-blue-600'
              }`}>
              {isModuleCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
            </div>
            <div className="min-w-0 text-left">
              <h3 className="text-base font-semibold text-black truncate">{module.title}</h3>
              <p className="text-xs text-gray-500 mt-1.5">
                Module {index + 1} • {module.topics?.length || 0} topics
              </p>
            </div>
          </div>

          {/* Progress display */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isModuleCompleted ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={`text-xs font-semibold ${isModuleCompleted ? 'text-green-600' : 'text-blue-600'
                }`}>
                {progress}%
              </span>
            </div>

            {isModuleCompleted && (
              <div className="px-4 py-2 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" />
                Completed
              </div>
            )}
          </div>

          {/* Chevron */}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''
              }`}
          />
        </div>
      </button>

      {/* Expanded section - Show MCQ and Coding status */}
      {isExpanded && (
        <div className="border border-t-0 border-gray-200 rounded-b-xl bg-gray-50 px-6 py-4 space-y-4 animate-in fade-in duration-300">
          {/* Topics */}
          {module.topics && module.topics.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase">Topics Covered</p>
              {module.topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs px-4 py-2.5 rounded-lg bg-white border border-gray-150 hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <p className="text-gray-700 font-medium">
                      {typeof topic === 'string' ? topic : topic.title || 'Topic'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Assessment Status */}
          <div className="space-y-2 mt-4">
            <p className="text-xs font-semibold text-gray-600 uppercase">Assessment Status</p>

            {/* MCQ Status */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${isMcqCompleted
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
              }`}>
              <div className="flex items-center gap-3">
                {isMcqCompleted ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                )}
                <span className={`text-xs font-semibold ${isMcqCompleted ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                  Multiple Choice Questions
                </span>
              </div>
              <span className={`text-xs font-bold ${isMcqCompleted ? 'text-green-600' : 'text-yellow-600'
                }`}>
                {isMcqCompleted ? '✓ Passed' : 'Not Attempted'}
              </span>
            </div>

            {/* Coding Status */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${isCodingCompleted
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
              }`}>
              <div className="flex items-center gap-3">
                {isCodingCompleted ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                )}
                <span className={`text-xs font-semibold ${isCodingCompleted ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                  Coding Challenge
                </span>
              </div>
              <span className={`text-xs font-bold ${isCodingCompleted ? 'text-green-600' : 'text-yellow-600'
                }`}>
                {isCodingCompleted ? '✓ Passed' : 'Not Attempted'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Learning() {
  const navigate = useNavigate();
  const { user: userData, courses, professions } = useApp();
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [currentCourse, setCurrentCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [professionCourses, setProfessionCourses] = useState(null);

  useEffect(() => {
    // If enrolled through profession - get all courses in profession
    if (userData?.currentProfession && professions && professions.length > 0 && courses && courses.length > 0) {
      const profession = professions.find(p => p._id === userData.currentProfession._id || p._id === userData.currentProfession);
      if (profession && profession.courses && profession.courses.length > 0) {
        // Filter courses from context based on profession course IDs
        const profCourses = profession.courses.map(profCourse => {
          const courseId = profCourse.course?._id || profCourse.course;
          const fullCourseData = courses.find(c => c._id === courseId);

          // Enrich with progress data if it's the current course
          if (userData.currentCourse && (userData.currentCourse._id === courseId || userData.currentCourse === courseId)) {
            let modulesWithProgress = [];
            if (Array.isArray(fullCourseData?.modules)) {
              modulesWithProgress = fullCourseData.modules.map(module => {
                const progress = userData?.moduleProgress?.find(p => p.moduleId === module._id);
                return {
                  ...module,
                  isMcqCompleted: progress?.isMcqCompleted || false,
                  isCodingCompleted: progress?.isCodingCompleted || false,
                  mcqScore: progress?.mcqScore || 0,
                  codingScore: progress?.codingScore || 0
                };
              });
            }

            // Update current course and modules if this is the active course
            setCurrentCourse(fullCourseData);
            setModules(modulesWithProgress);
          }

          return {
            ...profCourse,
            course: fullCourseData // Use full course data from context
          };
        });

        setProfessionCourses(profCourses);

        // Initialize expandedCourses state - expand first course by default
        const expandedState = {};
        profCourses.forEach((course, idx) => {
          const courseId = course.course?._id || course.course;
          expandedState[courseId] = idx === 0;
        });
        setExpandedCourses(expandedState);
      }
    } else if (userData?.currentCourse) {
      // Direct course enrollment - not through profession
      const course = userData.currentCourse;
      if (course && course._id) {
        let modulesWithProgress = [];

        if (Array.isArray(course.modules)) {
          modulesWithProgress = course.modules.map(module => {
            const progress = userData?.moduleProgress?.find(p => p.moduleId === module._id);
            return {
              ...module,
              isMcqCompleted: progress?.isMcqCompleted || false,
              isCodingCompleted: progress?.isCodingCompleted || false,
              mcqScore: progress?.mcqScore || 0,
              codingScore: progress?.codingScore || 0
            };
          });
        }

        setCurrentCourse(course);
        setModules(modulesWithProgress);
      }
    }

    // Set current module from user data
    if (userData?.currentModule) {
      setCurrentModule(userData.currentModule._id || userData.currentModule);
    }
  }, [userData, professions, courses]);


  // Calculate progress based on MCQ + Coding completion (0%, 50%, or 100%)
  const calculateProgress = () => {
    if (userData?.currentProfession && professionCourses) {
      // For profession: calculate across all courses
      let totalProgress = 0;
      let totalModules = 0;

      professionCourses.forEach(courseItem => {
        const courseData = courseItem.course;
        if (courseData && Array.isArray(courseData.modules)) {
          courseData.modules.forEach(module => {
            totalModules++;
            const moduleId = module._id?.toString() || module._id;
            const progress = userData?.moduleProgress?.find(p => {
              const pModuleId = p.moduleId?.toString() || p.moduleId;
              return pModuleId === moduleId;
            });
            let moduleProgress = 0;
            if (progress?.isMcqCompleted) moduleProgress += 50;
            if (progress?.isCodingCompleted) moduleProgress += 50;
            totalProgress += moduleProgress;
          });
        }
      });

      return totalModules > 0 ? Math.round(totalProgress / totalModules) : 0;
    } else {
      // For direct course enrollment: calculate from moduleProgress
      if (modules.length === 0) return 0;
      let totalProgress = 0;
      modules.forEach(m => {
        const moduleId = m._id?.toString() || m._id;
        const progress = userData?.moduleProgress?.find(p => {
          const pModuleId = p.moduleId?.toString() || p.moduleId;
          return pModuleId === moduleId;
        });
        let moduleProgress = 0;
        if (progress?.isMcqCompleted) moduleProgress += 50;
        if (progress?.isCodingCompleted) moduleProgress += 50;
        totalProgress += moduleProgress;
      });
      return modules.length > 0 ? Math.round(totalProgress / modules.length) : 0;
    }
  };

  const overallProgress = calculateProgress();

  // Count modules at different stages
  const calculateModuleStats = () => {
    let stats = {
      total: 0,
      fullyCompleted: 0,      // Both MCQ + Coding done
      partiallyCompleted: 0,  // Either MCQ or Coding done
      notStarted: 0           // Neither MCQ nor Coding done
    };

    if (userData?.currentProfession && professionCourses) {
      professionCourses.forEach(courseItem => {
        const courseData = courseItem.course;
        if (courseData && Array.isArray(courseData.modules)) {
          courseData.modules.forEach(module => {
            stats.total++;
            const moduleId = module._id?.toString() || module._id;
            const progress = userData?.moduleProgress?.find(p => {
              const pModuleId = p.moduleId?.toString() || p.moduleId;
              return pModuleId === moduleId;
            });
            const mcqDone = progress?.isMcqCompleted || false;
            const codingDone = progress?.isCodingCompleted || false;

            if (mcqDone && codingDone) {
              stats.fullyCompleted++;
            } else if (mcqDone || codingDone) {
              stats.partiallyCompleted++;
            } else {
              stats.notStarted++;
            }
          });
        }
      });
    } else {
      modules.forEach(m => {
        stats.total++;
        const moduleId = m._id?.toString() || m._id;
        const progress = userData?.moduleProgress?.find(p => {
          const pModuleId = p.moduleId?.toString() || p.moduleId;
          return pModuleId === moduleId;
        });
        const mcqDone = progress?.isMcqCompleted || false;
        const codingDone = progress?.isCodingCompleted || false;

        if (mcqDone && codingDone) {
          stats.fullyCompleted++;
        } else if (mcqDone || codingDone) {
          stats.partiallyCompleted++;
        } else {
          stats.notStarted++;
        }
      });
    }

    return stats;
  };

  const moduleStats = calculateModuleStats();
  const completedModules = moduleStats.fullyCompleted;
  const totalModules = moduleStats.total;

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">No Active Course</h2>
          <p className="text-gray-600 max-w-md">
            You haven't enrolled in any course yet. Explore our courses and start learning!
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Explore Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight">My Learning</h1>
            {userData?.currentProfession && (
              <p className="text-xs text-purple-600 font-semibold mt-1">
                📚 Career Path: {userData.currentProfession.name}
              </p>
            )}
            <p className="text-gray-600 mt-2">{currentCourse.title}</p>
          </div>

          {/* Resume Button */}
          {currentModule && modules.length > 0 && (() => {
            const currentModuleData = modules.find(m => m._id === currentModule);
            if (currentModuleData) {
              const isModuleCompleted = currentModuleData.isMcqCompleted && currentModuleData.isCodingCompleted;
              if (!isModuleCompleted) {
                return (
                  <button
                    onClick={() => window.open(`/module`, '_blank')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                  >
                    <Play className="w-4 h-4" />
                    Continue Learning
                  </button>
                );
              }
            }
            return null;
          })()}
        </div>

        {/* Overall progress bar with detailed state info */}
        <div className="w-full px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 uppercase">
              {userData?.currentProfession ? '📚 Profession Progress' : '📖 Course Progress'}
            </span>
            <span className="text-xs font-bold text-blue-600">
              {overallProgress}% • {moduleStats.fullyCompleted} completed, {moduleStats.partiallyCompleted} in progress, {moduleStats.notStarted} not started
            </span>
          </div>
          <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
            {/* Completed segment (green) */}
            <div
              className="h-full bg-green-600 transition-all duration-500"
              style={{ width: `${(moduleStats.fullyCompleted / totalModules) * 100}%` }}
            />
            {/* In Progress segment (blue) - positioned after completed */}
            <div
              className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${((moduleStats.fullyCompleted + moduleStats.partiallyCompleted) / totalModules) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {/* If enrolled through profession - show all courses */}
          {userData?.currentProfession && professionCourses ? (
            <div className="space-y-6">
              {/* Profession Header */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📚</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Career Path</p>
                    <h2 className="text-xl font-bold text-gray-900">{userData.currentProfession.name}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 mt-4">
                  <span>Courses: <strong>{professionCourses.length}</strong></span>
                </div>
              </div>

              {/* All Courses in Profession */}
              <div className="space-y-3">
                {professionCourses.map((courseItem, idx) => {
                  const courseId = courseItem.course?._id || courseItem.course;
                  const courseData = courseItem.course;
                  const isExpanded = expandedCourses[courseId];

                  // Get modules for this course with progress
                  let courseModules = [];
                  if (courseData && Array.isArray(courseData.modules)) {
                    courseModules = courseData.modules.map(module => {
                      const progress = userData?.moduleProgress?.find(p => p.moduleId === module._id);
                      return {
                        ...module,
                        isMcqCompleted: progress?.isMcqCompleted || false,
                        isCodingCompleted: progress?.isCodingCompleted || false,
                        mcqScore: progress?.mcqScore || 0,
                        codingScore: progress?.codingScore || 0
                      };
                    });
                  }

                  const courseCompletedModules = courseModules.filter(m => m.isMcqCompleted && m.isCodingCompleted).length;
                  const courseTotalModules = courseModules.length;
                  const courseProgress = courseTotalModules > 0 ? Math.round((courseCompletedModules / courseTotalModules) * 100) : 0;

                  return (
                    <div key={courseId} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => setExpandedCourses({ ...expandedCourses, [courseId]: !isExpanded })}
                        className="w-full px-6 py-5 flex items-center justify-between gap-4 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div className="min-w-0 text-left">
                            <h3 className="text-base font-semibold text-black truncate">{courseData?.title || 'Course'}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {courseTotalModules} modules • {courseCompletedModules} completed
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="text-sm font-bold text-blue-600">{courseProgress}%</div>
                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1 relative">
                              {/* Completed part (green) */}
                              <div
                                className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-500"
                                style={{ width: `${(courseCompletedModules / courseTotalModules) * 100}%` }}
                              />
                              {/* In progress part (blue) */}
                              <div
                                className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${courseProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{courseCompletedModules} done</p>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </button>

                      {/* Course modules - only show if expanded */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                          <div className="space-y-4">
                            {courseModules.length > 0 ? (
                              courseModules.map((module, moduleIdx) => (
                                <ModuleProgressItem
                                  key={module._id}
                                  module={module}
                                  index={moduleIdx}
                                  setExpandedModule={setExpandedModule}
                                  expandedModule={expandedModule}
                                />
                              ))
                            ) : (
                              <p className="text-center text-gray-600 py-8">No modules available</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // Direct course enrollment - show modules directly
            <div className="space-y-6">
              {/* Course Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Current Course</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">{currentCourse.title}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{overallProgress}%</div>
                    <p className="text-xs text-gray-600">{completedModules}/{totalModules} modules</p>
                  </div>
                </div>
                {currentCourse.description && (
                  <p className="text-sm text-gray-600 leading-relaxed mt-4">{currentCourse.description}</p>
                )}
              </div>

              {/* Modules List */}
              <div className="space-y-4">
                {modules.length > 0 ? (
                  modules.map((module, index) => (
                    <ModuleProgressItem
                      key={module._id}
                      module={module}
                      index={index}
                      setExpandedModule={setExpandedModule}
                      expandedModule={expandedModule}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-600">No modules available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Completion message */}
          {completedModules === totalModules && totalModules > 0 && (
            <div className="mt-12 p-8 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Course Completed!</h2>
              <p className="text-green-600 mb-4">Congratulations on completing all modules in <strong>{currentCourse.title}</strong>!</p>
              {userData?.currentProfession && (
                <p className="text-sm text-green-700 mb-6">You're making great progress in your <strong>{userData.currentProfession.name}</strong> career path.</p>
              )}
              <button
                onClick={() => navigate('/courses')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Explore More Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
