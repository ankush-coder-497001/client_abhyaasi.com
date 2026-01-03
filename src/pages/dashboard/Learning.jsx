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
        <div className="px-5 py-4 flex items-start justify-between gap-4 border border-slate-200 rounded-lg bg-white hover:border-blue-300 hover:shadow-md transition-all duration-300">
          {/* Module number and title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold text-white ${isModuleCompleted ? 'bg-emerald-600' : 'bg-blue-600'
              }`}>
              {isModuleCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
            </div>
            <div className="min-w-0 text-left">
              <h3 className="text-sm font-semibold text-slate-900 truncate">{module.title}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {module.topics?.length || 0} topics
              </p>
            </div>
          </div>

          {/* Progress display */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative w-20 h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${isModuleCompleted ? 'bg-linear-to-r from-emerald-500 to-emerald-600' : 'bg-linear-to-r from-blue-600 to-blue-500'
                    }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={`text-xs font-bold ${isModuleCompleted ? 'text-emerald-600' : 'text-blue-600'
                }`}>
                {progress}%
              </span>
            </div>

            {isModuleCompleted && (
              <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200 flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircle className="w-3 h-3" />
                Done
              </div>
            )}
          </div>

          {/* Chevron */}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''
              }`}
          />
        </div>
      </button>

      {/* Expanded section - Show MCQ and Coding status */}
      {isExpanded && (
        <div className="border border-t-0 border-slate-200 rounded-b-lg bg-slate-50/50 px-5 py-3 space-y-3 animate-in fade-in duration-300">
          {/* Topics */}
          {module.topics && module.topics.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Topics</p>
              <div className="space-y-1.5">
                {module.topics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded-md bg-white border border-slate-200 hover:border-blue-300 transition-all duration-200"
                  >
                    <div className="w-1 h-1 rounded-full bg-blue-600 shrink-0" />
                    <p className="text-slate-700 font-medium truncate">
                      {typeof topic === 'string' ? topic : topic.title || 'Topic'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment Status */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Assessment</p>

            {/* MCQ Status */}
            <div className={`flex items-center justify-between px-3 py-2.5 rounded-md border text-xs transition-colors ${isMcqCompleted
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-700'
              : 'bg-amber-50/60 border-amber-200 text-amber-700'
              }`}>
              <div className="flex items-center gap-2">
                {isMcqCompleted ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                )}
                <span className="font-medium">MCQ</span>
              </div>
              <span className="font-semibold">
                {isMcqCompleted ? '✓' : '○'}
              </span>
            </div>

            {/* Coding Status */}
            <div className={`flex items-center justify-between px-3 py-2.5 rounded-md border text-xs transition-colors ${isCodingCompleted
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-700'
              : 'bg-amber-50/60 border-amber-200 text-amber-700'
              }`}>
              <div className="flex items-center gap-2">
                {isCodingCompleted ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                )}
                <span className="font-medium">Coding</span>
              </div>
              <span className="font-semibold">
                {isCodingCompleted ? '✓' : '○'}
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
    <div className="min-h-screen bg-white text-slate-900">
      {/* Floating Header */}
      <div className="sticky top-0 z-40 backdrop-blur-sm bg-white/80 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Learning</h1>
            <p className="text-sm text-slate-600 mt-1">{currentCourse.title}</p>
            {userData?.currentProfession && (
              <p className="text-xs text-blue-600 font-semibold mt-1">
                Career Path: {userData.currentProfession.name}
              </p>
            )}
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
                    className="ml-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 whitespace-nowrap"
                  >
                    <Play className="w-4 h-4" />
                    Continue
                  </button>
                );
              }
            }
            return null;
          })()}
        </div>

        {/* Premium Progress Bar */}
        <div className="w-full px-6 py-4 border-t border-slate-200/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Progress Overview
              </span>
              <span className="text-sm font-bold text-blue-600">
                {overallProgress}%
              </span>
            </div>
            <div className="relative h-2 bg-slate-200/60 rounded-full overflow-hidden">
              {/* Completed segment */}
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${(moduleStats.fullyCompleted / totalModules) * 100}%` }}
              />
              {/* In Progress segment */}
              <div
                className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{
                  width: `${((moduleStats.fullyCompleted + moduleStats.partiallyCompleted) / totalModules) * 100}%`
                }}
              />
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>{moduleStats.fullyCompleted} Completed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span>{moduleStats.partiallyCompleted} In Progress</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <span>{moduleStats.notStarted} Not Started</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-10">
        <div className="max-w-7xl mx-auto">
          {/* If enrolled through profession - show all courses */}
          {userData?.currentProfession && professionCourses ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left side - Profession Info (40%) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profession Header Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-blue-600 font-bold">🎯</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Career Path</p>
                      <h2 className="text-lg font-bold text-slate-900">{userData.currentProfession.name}</h2>
                    </div>
                  </div>
                  {userData.currentProfession?.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{userData.currentProfession.description}</p>
                  )}
                </div>

                {/* Stats Cards */}
                <div className="space-y-3">
                  <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Total Progress</span>
                      <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Modules</span>
                      <span className="text-lg font-semibold text-slate-900">{moduleStats.fullyCompleted}/{totalModules}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-linear-to-r from-blue-600 to-blue-500 transition-all duration-500"
                        style={{ width: `${(moduleStats.fullyCompleted / totalModules) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Courses List (60%) */}
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide px-1">Courses in Path</h3>
                  {professionCourses.map((courseItem, idx) => {
                    const courseData = courseItem.course;
                    if (!courseData) return null;

                    const courseProgress = (() => {
                      if (!Array.isArray(courseData.modules)) return 0;
                      let completed = 0;
                      courseData.modules.forEach(module => {
                        const moduleId = module._id?.toString() || module._id;
                        const progress = userData?.moduleProgress?.find(p => {
                          const pModuleId = p.moduleId?.toString() || p.moduleId;
                          return pModuleId === moduleId;
                        });
                        if (progress?.isMcqCompleted && progress?.isCodingCompleted) completed++;
                      });
                      return courseData.modules.length > 0 ? Math.round((completed / courseData.modules.length) * 100) : 0;
                    })();

                    const isExpanded = expandedCourses[courseData._id];

                    return (
                      <div key={courseData._id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <button
                          onClick={() => setExpandedCourses(prev => ({ ...prev, [courseData._id]: !prev[courseData._id] }))}
                          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 text-left">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">{courseData.title}</h3>
                              <p className="text-xs text-slate-500 mt-1">
                                {courseData.modules?.length || 0} modules
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="text-sm font-bold text-blue-600">{courseProgress}%</div>
                              <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                                <div
                                  className="h-full bg-linear-to-r from-blue-600 to-blue-500 transition-all duration-500"
                                  style={{ width: `${courseProgress}%` }}
                                />
                              </div>
                            </div>
                            <ChevronDown
                              className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </div>
                        </button>

                        {/* Course modules - only show if expanded */}
                        {isExpanded && (
                          <div className="border-t border-slate-200 bg-slate-50/50 px-5 py-4 space-y-3">
                            {courseData.modules?.length > 0 ? (
                              courseData.modules.map((module, moduleIdx) => (
                                <ModuleProgressItem
                                  key={module._id}
                                  module={module}
                                  index={moduleIdx}
                                  setExpandedModule={setExpandedModule}
                                  expandedModule={expandedModule}
                                />
                              ))
                            ) : (
                              <p className="text-center text-slate-500 py-4 text-sm">No modules available</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            // Direct course enrollment - show modules directly
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left side - Course Info (40%) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Course Header Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-blue-600 font-bold">📖</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Current Course</p>
                      <h2 className="text-lg font-bold text-slate-900">{currentCourse.title}</h2>
                    </div>
                  </div>
                  {currentCourse.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{currentCourse.description}</p>
                  )}
                </div>

                {/* Stats Cards */}
                <div className="space-y-3">
                  <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Overall Progress</span>
                      <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-medium">Modules</span>
                      <span className="text-lg font-semibold text-slate-900">{completedModules}/{totalModules}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-linear-to-r from-blue-600 to-blue-500 transition-all duration-500"
                        style={{ width: `${(completedModules / totalModules) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Modules List (60%) */}
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide px-1">Learning Modules</h3>
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
                    <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
                      <p className="text-slate-600">No modules available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Completion message */}
          {completedModules === totalModules && totalModules > 0 && (
            <div className="mt-12 p-8 bg-linear-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 text-center shadow-sm">
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-emerald-700 mb-2">🎉 Congratulations!</h2>
              <p className="text-emerald-600 mb-4">You've successfully completed all modules in <strong>{currentCourse.title}</strong>!</p>
              {userData?.currentProfession && (
                <p className="text-sm text-emerald-700 mb-6">You're making great progress in your <strong>{userData.currentProfession.name}</strong> career path.</p>
              )}
              <button
                onClick={() => navigate('/courses')}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200"
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
