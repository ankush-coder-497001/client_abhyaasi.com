"use client"

import { useState } from "react"
import { ChevronDown, ArrowLeft, Play } from "lucide-react"
import { Link } from "react-router-dom"

const mockCourseData = {
  id: 1,
  title: "React Fundamentals Mastery",
  description: "Master React from basics to advanced concepts with real-world projects and hands-on coding challenges.",
  rating: 4.8,
  students: 12500,
  duration: "48 hours",
  level: "Intermediate",
  enrolled: true,
  progress: 33,
  modules: [
    {
      id: 1,
      title: "React Basics",
      order: 1,
      duration: "6 hours",
      lessons: 12,
      progress: 100,
      description: "Learn the fundamentals of React including components, JSX syntax, props, and state management.",
      topics: [
        { name: "Introduction to React", duration: "45 min" },
        { name: "Components & JSX", duration: "1h 20min" },
        { name: "Props & State", duration: "1h 15min" },
        { name: "Event Handling", duration: "1h 10min" },
      ],
    },
    {
      id: 2,
      title: "Hooks & State Management",
      order: 2,
      duration: "8 hours",
      lessons: 16,
      progress: 60,
      description: "Master React Hooks including useState, useEffect, and custom hooks for better state management.",
      topics: [
        { name: "useState Hook", duration: "1h 10min" },
        { name: "useEffect Hook", duration: "1h 30min" },
        { name: "Custom Hooks", duration: "1h 45min" },
        { name: "Context API", duration: "1h 20min" },
      ],
    },
    {
      id: 3,
      title: "Advanced React Patterns",
      order: 3,
      duration: "7 hours",
      lessons: 14,
      progress: 0,
      description:
        "Explore advanced patterns like Higher Order Components, Render Props, and performance optimization.",
      topics: [
        { name: "Higher Order Components", duration: "1h 15min" },
        { name: "Render Props", duration: "1h 10min" },
        { name: "Performance Optimization", duration: "1h 25min" },
        { name: "Lazy Loading", duration: "55min" },
      ],
    },
    {
      id: 4,
      title: "Building Real Projects",
      order: 4,
      duration: "10 hours",
      lessons: 20,
      progress: 0,
      description: "Build production-ready applications with proper architecture, API integration, and deployment.",
      topics: [
        { name: "Project Setup", duration: "45 min" },
        { name: "Component Architecture", duration: "2h 10min" },
        { name: "API Integration", duration: "1h 55min" },
        { name: "Deployment", duration: "1h 20min" },
      ],
    },
    {
      id: 5,
      title: "Interview Preparation",
      order: 5,
      duration: "9 hours",
      lessons: 18,
      progress: 0,
      description: "Prepare for React interviews with common questions, coding challenges, and system design.",
      topics: [
        { name: "Common Questions", duration: "2h 15min" },
        { name: "Coding Challenges", duration: "2h 30min" },
        { name: "System Design", duration: "2h 10min" },
        { name: "Mock Interviews", duration: "1h 45min" },
      ],
    },
  ],
}

function ModuleItem({ module, index, enrolled, expandedModule, setExpandedModule, moduleProgress, setModuleProgress }) {
  const handleResumeClick = (e) => {
    e.stopPropagation()
    if (moduleProgress[module.id] === undefined) {
      setModuleProgress({ ...moduleProgress, [module.id]: 5 })
    } else {
      setModuleProgress({ ...moduleProgress, [module.id]: Math.min(moduleProgress[module.id] + 10, 100) })
    }
  }

  const currentProgress = moduleProgress[module.id] || module.progress || 0
  const isModuleExpanded = expandedModule === module.id

  return (
    <div key={module.id} className="group">
      <button
        onClick={() => setExpandedModule(isModuleExpanded ? null : module.id)}
        className="w-full transition-all duration-300"
      >
        <div className="px-6 py-5 flex items-start justify-between gap-4 border border-gray-200 rounded-xl bg-white hover:border-blue-400 hover:shadow-lg transition-all duration-300">
          {/* Module number and title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-600 rounded-lg text-sm font-bold text-white">
              {index + 1}
            </div>
            <div className="min-w-0 text-left">
              <h3 className="text-base font-semibold text-black truncate">{module.title}</h3>
              <p className="text-xs text-gray-500 mt-1.5">
                {module.duration} • {module.lessons} lessons
              </p>
            </div>
          </div>

          {enrolled && (
            <div className="flex items-center gap-4 shrink-0">
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${currentProgress}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full shadow-md transition-all duration-500"
                    style={{ left: `calc(${currentProgress}% - 5px)` }}
                  />
                </div>
                <span className="text-xs font-semibold text-blue-600">{currentProgress}%</span>
              </div>

              <button
                onClick={handleResumeClick}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                Resume
              </button>
            </div>
          )}

          {/* Chevron */}
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 shrink-0 ${isModuleExpanded ? "rotate-180" : ""
              }`}
          />
        </div>
      </button>

      {isModuleExpanded && (
        <div className="border border-t-0 border-gray-200 rounded-b-xl bg-gray-50 px-6 py-4 space-y-3 animate-in fade-in duration-300">
          <div className="space-y-2">
            {module.topics.map((topic, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs px-4 py-2.5 rounded-lg bg-white border border-gray-150 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <p className="text-gray-700 font-medium">{topic.name}</p>
                </div>
                <p className="text-gray-500 font-medium">{topic.duration}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CourseDetails() {
  const [expandedModule, setExpandedModule] = useState(null)
  const [enrolled, setEnrolled] = useState(true)
  const [moduleProgress, setModuleProgress] = useState({})

  const overallProgress = Math.round(
    mockCourseData.modules.reduce((sum, m) => sum + (moduleProgress[m.id] || m.progress || 0), 0) /
    mockCourseData.modules.length,
  )

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4">

          <h1 className="text-2xl font-bold text-black tracking-tight">{mockCourseData.title}</h1>
        </div>

        <div className="w-full h-0.5 bg-gray-200">
          <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${overallProgress}%` }} />
        </div>
      </div>

      {/* Main content */}
      <div className="w-full mx-2 px-6 py-10">
        <div className="mb-12 pb-8 border-b border-gray-200">
          <div className="flex items-start justify-between gap-8 mb-6">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-3">About Course</p>
              <p className="text-sm text-gray-700 leading-relaxed">{mockCourseData.description}</p>
            </div>
            <button
              onClick={() => setEnrolled(!enrolled)}
              className={`shrink-0 px-6 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 whitespace-nowrap shadow-sm hover:shadow-md ${enrolled ? "bg-black text-white hover:bg-gray-800" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              {enrolled ? "✓ Enrolled" : "Enroll"}
            </button>
          </div>

          {enrolled && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Progress</p>
                <span className="text-xs font-bold text-blue-600">{overallProgress}%</span>
              </div>
              <div className="relative h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-blue-600 rounded-full shadow-sm transition-all duration-500"
                  style={{ left: `calc(${overallProgress}% - 5px)` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modules section */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-4">Modules</p>
          {mockCourseData.modules.map((module, idx) => (
            <ModuleItem
              key={module.id}
              module={module}
              index={idx}
              enrolled={enrolled}
              expandedModule={expandedModule}
              setExpandedModule={setExpandedModule}
              moduleProgress={moduleProgress}
              setModuleProgress={setModuleProgress}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
