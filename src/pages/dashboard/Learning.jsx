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
  const { user: userData, courses } = useApp();
  const [expandedModule, setExpandedModule] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);

  useEffect(() => {
    // Get current course from user data
    if (userData?.currentCourse) {
      const course = userData.currentCourse;
      if (course && course._id) {
        // The currentCourse from userData now has fully populated modules
        let modulesWithProgress = [];

        if (Array.isArray(course.modules)) {
          modulesWithProgress = course.modules.map(module => {
            // module is now a full object with _id, title, order, topics
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
  }, [userData]);


  // Calculate overall progress
  const overallProgress = modules.length > 0
    ? Math.round(
      modules.reduce((sum, m) => {
        let progress = 0;
        if (m.isMcqCompleted) progress += 50;
        if (m.isCodingCompleted) progress += 50;
        return sum + progress;
      }, 0) / modules.length
    )
    : 0;

  // Count completed modules
  const completedModules = modules.filter(m => m.isMcqCompleted && m.isCodingCompleted).length;

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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black tracking-tight">My Learning</h1>
            <p className="text-gray-600 mt-2">{currentCourse.title}</p>
          </div>

          {/* Resume Button - Only show if there's a current module and it's not completed */}
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

        {/* Overall progress bar */}
        <div className="w-full h-1 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="w-full mx-2 px-6 py-10">
        {/* Course info section */}
        <div className="mb-12 pb-8 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Overall Progress */}
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Overall Progress</h3>
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{overallProgress}%</div>
              <p className="text-xs text-gray-600">Course completion</p>
            </div>

            {/* Modules Completed */}
            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Modules Completed</h3>
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{completedModules}/{modules.length}</div>
              <p className="text-xs text-gray-600">Modules finished</p>
            </div>


          </div>

          {/* Course description */}
          {currentCourse.description && (
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-3">About This Course</p>
              <p className="text-gray-700 leading-relaxed">{currentCourse.description}</p>
            </div>
          )}
        </div>

        {/* Modules Section */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-4">Course Modules</p>
            <p className="text-sm text-gray-600 mb-6">
              Complete all assessments in each module to unlock the next one
            </p>
          </div>

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
              <div className="text-center py-12">
                <p className="text-gray-600">No modules available</p>
              </div>
            )}
          </div>
        </div>

        {/* Completion message */}
        {completedModules === modules.length && modules.length > 0 && (
          <div className="mt-12 p-8 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">🎉 Course Completed!</h2>
            <p className="text-green-600 mb-6">Congratulations on completing all modules in this course!</p>
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
  );
}
