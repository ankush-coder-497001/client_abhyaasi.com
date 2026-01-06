import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, Brain, Code2, Briefcase, Loader, CheckCircle } from 'lucide-react';
import { getModule } from '../../api_services/modules.api';
import { useApp } from '../../context/AppContext';
import PageTransition from './PageTransition.jsx';
import TheorySection from '../sections/theory-section';
import MCQSection from '../sections/mcq-section';
import CodingSection from '../sections/coding-section';
import InterviewSection from '../sections/interview-section';

const SECTIONS = [
  { id: 'theory', title: 'Theory', icon: BookOpen },
  { id: 'mcq', title: 'MCQ', icon: Brain },
  { id: 'coding', title: 'Coding', icon: Code2 },
  { id: 'interview', title: 'Interview', icon: Briefcase },
];

const USER_MESSAGES = [
  "Keep up the great work! You're making progress.",
  "Consistency is key to mastery. Keep learning.",
  "You're on the right track. One step at a time.",
  "Great effort! Your dedication will pay off.",
  "Stay focused and achieve your goals.",
];

export default function ModuleLayout() {
  const navigate = useNavigate();
  const { user, userLoading, refetchUser } = useApp();

  useEffect(() => {
    if (user && !user.currentModule) {
      navigate('/dashboard');
    }
  }, [])
  // Get moduleId from user's currentModule
  const moduleId = user?.currentModule._id;

  const [activeSection, setActiveSection] = useState('theory');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Redirect to dashboard if no current module
  useEffect(() => {
    if (!userLoading && !moduleId) {
      navigate('/dashboard');
    }
  }, [moduleId, userLoading, navigate]);

  // Fetch module data
  const fetchModule = async () => {
    if (!moduleId) return;
    try {
      setLoading(true);
      const data = await getModule(moduleId);
      setModuleData(data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching module:', err);
      setError('Failed to load module');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  // Auto-changing message
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % USER_MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'theory':
        return <TheorySection moduleData={moduleData} />;
      case 'mcq':
        return <MCQSection moduleData={moduleData} moduleId={moduleId} onSuccess={fetchModule} onNavigate={setActiveSection} />;
      case 'coding':
        return <CodingSection moduleData={moduleData} moduleId={moduleId} onSuccess={fetchModule} onNavigate={setActiveSection} />;
      case 'interview':
        return <InterviewSection moduleData={moduleData} />;
      default:
        return null;
    }
  };

  const activeTitle = SECTIONS.find(s => s.id === activeSection)?.title || '';

  return (
    <div className="h-screen bg-gradient-to-br from-white via-blue-50 to-white flex flex-col text-gray-900">
      {/* Minimal Top Bar - Responsive */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-40 border-b border-gray-100">
        <div className="flex items-center justify-between h-14 md:h-16 px-3 md:px-8 gap-2 md:gap-4">
          {/* Left Section - Logo & Module Info */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div className="shrink-0 w-7 md:w-9 h-7 md:h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <div className="min-w-0 flex-1">
              {loading ? (
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Loader className="w-3 md:w-4 h-3 md:h-4 animate-spin text-blue-600 shrink-0" />
                  <p className="text-xs md:text-xs text-gray-500 font-medium truncate">Loading...</p>
                </div>
              ) : error ? (
                <p className="text-xs text-red-600 font-semibold truncate">{error}</p>
              ) : (
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <h1 className="text-gray-900 text-xs md:text-sm font-bold truncate">{moduleData?.title?.substring(0, 20) || 'Module'}</h1>
                    <span className="hidden sm:inline-block px-1.5 md:px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-200 shrink-0">
                      #{moduleData?.order || '1'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-blue-600 shrink-0"></span>
                    <span className="truncate text-xs">{activeTitle}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Action Button - Responsive */}
          <div className="flex items-center justify-end shrink-0">
            {moduleData?.isProfessionCompleted || moduleData?.isCourseCompleted || moduleData?.isModuleCompleted ? (
              <button
                onClick={async () => {
                  await refetchUser();
                  if (moduleData?.isProfessionCompleted || moduleData?.isCourseCompleted) {
                    navigate('/learning');
                  } else {
                    setActiveSection('theory');
                  }
                }}
                className="px-2.5 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-1.5 md:gap-2 whitespace-nowrap shadow-sm hover:shadow-md"
              >
                <CheckCircle className="w-3 md:w-3.5 h-3 md:h-3.5 shrink-0" />
                <span className="hidden sm:inline">Continue</span>
              </button>
            ) : null}
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden pt-14 md:pt-16 pb-16 md:pb-0">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block">
                <Loader className="w-12 md:w-16 h-12 md:h-16 animate-spin text-blue-600 mb-3 md:mb-4" />
              </div>
              <p className="text-gray-700 font-semibold text-base md:text-lg">Loading module...</p>
              <p className="text-gray-500 text-xs md:text-sm mt-1">Please wait a moment</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-red-600 font-bold text-2xl md:text-3xl mb-2">⚠️</p>
              <p className="text-red-600 font-semibold text-base md:text-lg mb-2">Error Loading Module</p>
              <p className="text-gray-600 mb-4 text-sm md:text-base">{error}</p>
              <button
                onClick={fetchModule}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs md:text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Premium Sidebar - Desktop Only */}
            <div
              className={`hidden md:flex bg-white border-r border-gray-200 flex-col transition-all duration-300 ease-in-out overflow-hidden ${sidebarOpen ? 'w-56' : 'w-0'
                }`}
            >
              {/* Sidebar Header */}
              <div className="px-5 py-6 border-b border-gray-200 bg-gradient-to-b from-blue-50 to-transparent">
                <h2 className="text-gray-900 font-bold text-base tracking-tight">Navigation</h2>
                {user?.currentProfession && (
                  <p className="text-blue-600 text-xs mt-2.5 font-semibold flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    {user.currentProfession.name}
                  </p>
                )}
                {user?.currentCourse && (
                  <p className="text-gray-700 text-xs mt-2 font-medium truncate" title={typeof user.currentCourse === 'object' ? user.currentCourse.title : 'Course'}>
                    {typeof user.currentCourse === 'object' ? user.currentCourse.title?.substring(0, 25) : 'Course'}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1.5 font-medium">{moduleData?.title?.substring(0, 25) || 'Learning'}</p>
              </div>

              {/* Section Navigation */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;

                  // Check if section is completed based on moduleData
                  let isCompleted = false;
                  if (section.id === 'mcq') {
                    isCompleted = moduleData?.isMcqCompleted || false;
                  } else if (section.id === 'coding') {
                    isCompleted = moduleData?.isCodingCompleted || false;
                  }

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-semibold group ${activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                        }`}
                    >
                      <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform duration-200 ${activeSection === section.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className="flex-1 text-left">{section.title}</span>
                      {isCompleted && (
                        <CheckCircle className={`w-4 h-4 shrink-0 transition-all ${activeSection === section.id ? 'text-white scale-100' : 'text-green-500 scale-100'}`} />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Footer */}
              <div className="border-t border-gray-200 px-3 py-4 bg-gradient-to-t from-blue-50 to-transparent">
                <p className="text-xs text-gray-600 font-medium text-center">Keep learning</p>
              </div>
            </div>

            {/* Main Content Area - Responsive */}
            <div className="flex-1 overflow-auto bg-gradient-to-br from-white via-blue-50/30 to-white">
              <PageTransition>
                {renderSection()}
              </PageTransition>
            </div>
          </>
        )}
      </div>

      {/* Desktop Toggle Sidebar Button - Hidden on Mobile */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 bg-gradient-to-b from-blue-600 to-blue-700 text-white p-2 rounded-r-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 z-50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-110 active:scale-95"
        aria-label="Toggle sidebar"
        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-4 h-4 transition-transform" />
        ) : (
          <ChevronRight className="w-4 h-4 transition-transform" />
        )}
      </button>

      {/* Mobile Bottom Navigation - Horizontal Tabs */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around px-2 py-2 gap-1">
          {SECTIONS.map((section) => {
            const Icon = section.icon;

            // Check if section is completed based on moduleData
            let isCompleted = false;
            if (section.id === 'mcq') {
              isCompleted = moduleData?.isMcqCompleted || false;
            } else if (section.id === 'coding') {
              isCompleted = moduleData?.isCodingCompleted || false;
            }

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-lg transition-all duration-200 gap-0.5 min-w-fit ${activeSection === section.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                title={section.title}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${activeSection === section.id ? 'scale-110' : ''}`} />
                <span className="text-xs font-semibold truncate">{section.title}</span>
                {isCompleted && (
                  <CheckCircle className={`w-3 h-3 -mt-1 ${activeSection === section.id ? 'text-white' : 'text-green-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
