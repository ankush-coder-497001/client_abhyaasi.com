'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Brain, Code2, Briefcase } from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState('theory');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % USER_MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'theory':
        return <TheorySection />;
      case 'mcq':
        return <MCQSection />;
      case 'coding':
        return <CodingSection />;
      case 'interview':
        return <InterviewSection />;
      default:
        return null;
    }
  };

  const activeTitle = SECTIONS.find(s => s.id === activeSection)?.title || '';

  return (
    <div className="h-screen bg-white flex flex-col text-gray-900">
      <nav className="fixed top-0 left-0 right-0 border-b border-gray-200 bg-white z-40">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="shrink-0 w-8 h-8 bg-linier-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-blue-600/50 transition-all">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <div className="min-w-0 h-[100px] flex-1">
              <h1 className="text-black! md:text-lg font-bold">React Fundamentals</h1>
              <p className="text-xs text-gray-500 font-medium">Module 1 of 8 • {activeTitle}</p>
            </div>
          </div>

          {/* Auto-changing message */}
          <p className="hidden md:block text-xs md:text-sm text-blue-600 font-medium text-right max-w-xs transition-all duration-500 text-pretty">
            {USER_MESSAGES[messageIndex]}
          </p>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden pt-16">
        <div
          className={`bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${sidebarOpen ? 'w-48' : 'w-0'
            }`}
        >
          {/* Sidebar Header */}
          <div className="px-4 py-4 border-b border-gray-200">
            <h2 className="text-gray-900 font-bold text-sm">LearnHub</h2>
            <p className="text-gray-500 text-xs mt-0.5">Master React</p>
          </div>

          {/* Section Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded transition-all text-xs font-medium ${activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{section.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-3 py-3 border-t border-gray-200 space-y-2">
            <div className="space-y-0.5">
              <p className="text-gray-600 text-xs font-semibold">Progress</p>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-blue-600 h-1 rounded-full w-1/3 transition-all"></div>
              </div>
              <p className="text-gray-500 text-xs">33% Complete</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {renderSection()}
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-linear-to-r from-blue-600 to-blue-700 text-white p-1.5 rounded-r-lg hover:from-blue-700 hover:to-blue-800 transition-all z-50 shadow-lg hover:shadow-xl"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
