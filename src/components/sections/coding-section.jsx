"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Code2, Check, CheckCircle, Loader2, AlertCircle, Moon, Sun } from "lucide-react"
import { submitCode } from "../../api_services/modules.api"
import { useApp } from "../../context/AppContext"
import toast from "react-hot-toast"
import ResultModal from "../modals/ResultModal"
import CodeEditor from "../editors/CodeEditor"
import { useEditorTheme } from "../../context/EditorThemeContext"

// Default problem template
const DEFAULT_PROBLEM = {
  title: "Build a Counter Component",
  difficulty: "Easy",
  description: "Create a React component that displays a counter with increment and decrement buttons.",
  examples: [
    {
      input: "User clicks increment button 3 times",
      output: "Counter displays: 3",
    },
    {
      input: "User clicks decrement button 2 times",
      output: "Counter displays: -2",
    },
  ],
  testcases: [
    {
      id: "1",
      input: "Click increment",
      expectedOutput: "Count: 1",
    },
    {
      id: "2",
      input: "Click decrement",
      expectedOutput: "Count: -1",
    },
  ],
  templateCode: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-2xl font-bold">Count: {count}</p>
      <div className="flex gap-2">
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Increment
        </button>
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Decrement
        </button>
      </div>
    </div>
  );
}`,
}

export default function CodingSection({ moduleData, moduleId, onSuccess, onNavigate }) {
  const navigate = useNavigate()
  const { refetchUser } = useApp()
  const { theme, toggleTheme } = useEditorTheme()

  // Get template code from server's templateFiles array
  const templateFile = moduleData?.codingTask?.templateFiles?.find(
    (file) => file.path.includes("main") || file.path.includes("index") || file.path.includes("Main"),
  )
  const templateCode = templateFile ? templateFile.content : DEFAULT_PROBLEM.templateCode

  // Check if coding is already completed from moduleData
  const isCodingAlreadyCompleted = moduleData?.isCodingCompleted || false
  const codingScore = moduleData?.codingScore || 0

  // Get supported languages from backend or use defaults
  const supportedLanguages = moduleData?.codingTask?.languages || [
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "c",
    "go",
    "json",
  ]

  // Map server coding task structure to expected format
  const problem = moduleData?.codingTask
    ? {
      title: moduleData.codingTask.title || "Coding Challenge",
      difficulty: moduleData.codingTask.difficulty || "Medium",
      description: moduleData.codingTask.description || "Complete the coding challenge",
      examples: [
        {
          input: "Run the test cases below",
          output: "Your code should pass all tests",
        },
      ],
      testcases: moduleData.codingTask.testcases || DEFAULT_PROBLEM.testcases,
      templateCode: templateCode,
    }
    : DEFAULT_PROBLEM

  // Initialize code: use stored code if available, otherwise use template
  const initialCode = moduleData?.storedCode || moduleData?.currentCode || problem.templateCode
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState(supportedLanguages[0] || "javascript")
  const [testResults, setTestResults] = useState(null)
  const [dividerPos, setDividerPos] = useState(35)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [showResultModal, setShowResultModal] = useState(false)
  const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState(null)
  const containerRef = useRef(null)

  // Get cooldown info
  const codingCooldown = moduleData?.codingCooldown
  const isInCooldown = codingCooldown?.isInCooldown || false

  // Initialize cooldown time remaining from backend data if available
  const initialCountdownSeconds = codingCooldown?.cooldownRemainingSeconds

  // Format seconds to MM:SS format
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Use selected language
      const selectedLanguage = language || supportedLanguages[0] || "javascript"

      const response = await submitCode(moduleId, { code, language: selectedLanguage })
      const { data } = response

      setSubmissionResult(data)
      setSubmitted(true)

      // Handle test results display
      if (data.testResults) {
        const passedCount = data.testResults.filter((r) => r.passed).length
        setTestResults({
          passed: passedCount,
          total: data.testResults.length,
          details: data.testResults,
        })
      } else if (data.runResult?.testResults) {
        const passedCount = data.runResult.testResults.filter((r) => r.passed).length
        setTestResults({
          passed: passedCount,
          total: data.runResult.testResults.length,
          details: data.runResult.testResults,
        })
      }

      // Show result modal for both passed and failed
      setShowResultModal(true)
    } catch (err) {
      let errorMsg = "Failed to submit code. Please try again."

      if (err.status === 404) {
        if (err.message.includes("Module") || err.message.includes("coding task")) {
          errorMsg = "Module or coding task not found."
        }
      } else if (err.status === 400) {
        if (err.message.includes("Language")) {
          errorMsg = err.message
        } else {
          errorMsg = "Invalid code submission. Please check your input."
        }
      } else if (err.status === 500) {
        errorMsg = "Server error processing your code. Please try again later."
      }

      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const newPos = ((e.clientX - rect.left) / rect.width) * 100

    if (newPos > 25 && newPos < 75) {
      setDividerPos(newPos)
    }
  }

  const handleReset = () => {
    // Restore to the initial code (stored code or template)
    setCode(initialCode)
    setSubmitted(false)
    setSubmissionResult(null)
    setTestResults(null)
    setError(null)
  }

  const handleModalNext = async () => {
    setShowResultModal(false)

    // Handle different completion scenarios based on backend response
    const { isCourseCompleted, isProfessionCompleted, isModuleCompleted, status } = submissionResult

    if (isProfessionCompleted) {
      toast.success("🎓 Profession completed! Certificate generated.")
      onNavigate("interview")
      onSuccess()
    } else if (isCourseCompleted) {
      toast.success("🎉 Course completed! Certificate generated.")
      onNavigate("interview")
      onSuccess()
    } else if (isModuleCompleted) {
      toast.success('Module completed! Click "Next Module" button to continue.')
      onNavigate("interview")
      onSuccess()
    } else if (status === "passed") {
      onNavigate("mcq")
      onSuccess()
    }
  }

  useEffect(() => {
    if (!isInCooldown || !codingCooldown?.cooldownUntil) {
      setCooldownTimeRemaining(null)
      return
    }

    const updateCountdown = () => {
      const now = new Date()
      const cooldownEnd = new Date(codingCooldown.cooldownUntil)
      const remaining = Math.ceil((cooldownEnd - now) / 1000)

      if (remaining <= 0) {
        setCooldownTimeRemaining(null)
      } else {
        setCooldownTimeRemaining(remaining)
      }
    }

    if (initialCountdownSeconds) {
      setCooldownTimeRemaining(initialCountdownSeconds)
    } else {
      updateCountdown()
    }

    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [isInCooldown, codingCooldown?.cooldownUntil, initialCountdownSeconds])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging])

  return (
    <>
      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        onNext={handleModalNext}
        result={submissionResult}
        type="coding"
        cooldownInfo={moduleData?.codingCooldown}
      />
      <div ref={containerRef} className="h-full w-full flex overflow-hidden bg-white">
        <div className="overflow-y-auto border-r border-gray-200" style={{ width: `${dividerPos}%` }}>
          <div className="p-6 space-y-5 bg-white">
            {/* Problem Title & Difficulty - Minimal styling */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{problem.title}</h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${problem.difficulty === "Easy"
                        ? "bg-emerald-100 text-emerald-700"
                        : problem.difficulty === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            problem.difficulty === "Easy"
                              ? "#059669"
                              : problem.difficulty === "Medium"
                                ? "#d97706"
                                : "#dc2626",
                        }}
                      ></div>
                      {problem.difficulty}
                    </span>
                    {isCodingAlreadyCompleted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section - Minimal styling */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Description</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {problem.description}
              </p>
            </div>

            {/* Examples Section - Minimal */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Examples</h3>
                <div className="space-y-2">
                  {problem.examples.map((example, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs"
                    >
                      <p className="text-gray-700"><span className="font-semibold">Input:</span> {example.input}</p>
                      <p className="text-gray-700 mt-1"><span className="font-semibold">Output:</span> {example.output}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Cases Section - Minimal */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Test Cases</h3>
                <span className="text-xs text-gray-500">{problem.testcases.length} cases</span>
              </div>

              <div className="space-y-2">
                {problem.testcases.map((test, idx) => (
                  <div
                    key={test.id}
                    className="border border-gray-200 rounded-md p-3 bg-gray-50 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-gray-700">Case #{test.id}</span>
                    </div>
                    <div className="text-xs space-y-1.5 ml-7">
                      <p><span className="font-semibold text-gray-600">Input:</span> <code className="text-gray-700 bg-gray-200 px-1.5 py-0.5 rounded">{test.input}</code></p>
                      {test.expectedOutput && (
                        <p><span className="font-semibold text-gray-600">Output:</span> <code className="text-gray-700 bg-gray-200 px-1.5 py-0.5 rounded">{test.expectedOutput}</code></p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          onMouseDown={handleMouseDown}
          className={`w-0.5 bg-gray-200 hover:bg-blue-500 cursor-col-resize transition-all duration-200 ${isDragging ? "bg-blue-500" : ""
            }`}
        ></div>

        <div className="flex flex-col overflow-hidden h-full bg-gray-50" style={{ width: `${100 - dividerPos}%` }}>
          {/* Editor Header */}
          <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-3 gap-4">
            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">Code Editor</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isCodingAlreadyCompleted}
                className="px-3 py-1.5 bg-white text-gray-900 text-xs font-semibold rounded-md border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {supportedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>

              <button
                onClick={toggleTheme}
                title={theme === "vs-dark" ? "Light Theme" : "Dark Theme"}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-500 hover:text-gray-700"
              >
                {theme === "vs-dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {isCodingAlreadyCompleted && !submitted ? (
                <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-md flex items-center gap-2 border border-emerald-300">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Completed
                </div>
              ) : submitted && submissionResult?.status === "passed" ? (
                <button
                  onClick={handleReset}
                  className="px-4 py-1.5 border border-gray-300 text-gray-700 text-xs font-semibold rounded-md hover:bg-gray-100 transition-colors"
                >
                  Try Again
                </button>
              ) : submitted && submissionResult?.status === "failed" ? (
                <button
                  onClick={handleReset}
                  className="px-4 py-1.5 border border-amber-300 text-amber-700 text-xs font-semibold rounded-md hover:bg-amber-50 transition-colors"
                >
                  Retry
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isCodingAlreadyCompleted}
                  className="px-5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>

          {/* Code Editor - Fixed height, no scroll with description */}
          <div className="flex-1 w-full overflow-hidden bg-gray-900">
            <CodeEditor
              code={code}
              setCode={setCode}
              language={language}
              theme={theme}
              readOnly={isCodingAlreadyCompleted}
            />
          </div>

          {/* Results Panel - Fixed at bottom */}
          {(isInCooldown || error || submitted) && (
            <div className="border-t border-gray-300 bg-white max-h-60 overflow-y-auto">
              {/* Cooldown Display */}
              {isInCooldown && (
                <div className="p-4 bg-amber-50 border-b border-amber-200 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">Cooldown Active</p>
                      <p className="text-2xl font-bold text-amber-600 font-mono mt-2">
                        {cooldownTimeRemaining !== null
                          ? formatCountdown(cooldownTimeRemaining)
                          : formatCountdown(initialCountdownSeconds || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && !isInCooldown && (
                <div className="p-4 bg-red-50 border-b border-red-200">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 font-semibold">{error}</p>
                  </div>
                </div>
              )}

              {/* Failed Submission */}
              {submitted && submissionResult && submissionResult.status === "failed" && (
                <div className="p-4 bg-amber-50 border-b border-amber-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">Tests Failed</p>
                    <span className="ml-auto text-sm font-bold text-amber-700">
                      {submissionResult.score?.toFixed(1) || 0}% • {(submissionResult.testResults || submissionResult.runResult?.testResults)?.filter((r) => r.passed).length || 0}/{(submissionResult.testResults || submissionResult.runResult?.testResults)?.length || 0}
                    </span>
                  </div>

                  {(submissionResult.testResults || submissionResult.runResult?.testResults) &&
                    (submissionResult.testResults || submissionResult.runResult?.testResults).length > 0 && (
                      <div className="space-y-2 mt-3">
                        {(submissionResult.testResults || submissionResult.runResult?.testResults).map(
                          (testCase, idx) => (
                            <div
                              key={testCase.testcaseId || idx}
                              className={`p-2.5 rounded text-xs border ${testCase.passed
                                ? "bg-green-100 border-green-300"
                                : "bg-red-100 border-red-300"
                                }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${testCase.passed ? "bg-green-600" : "bg-red-600"}`}
                                ></div>
                                <span className="font-semibold">Test {idx + 1}</span>
                                <span className="ml-auto font-bold">
                                  {testCase.passed ? "✓ PASS" : "✗ FAIL"}
                                </span>
                              </div>
                              {!testCase.hidden && testCase.error && (
                                <p className="text-xs mt-1 ml-4">{testCase.error}</p>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                </div>
              )}

              {/* Passed Submission */}
              {submitted && submissionResult && submissionResult.status === "passed" && (
                <div className="p-4 bg-green-50 border-b border-green-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <p className="text-xs font-bold text-green-900 uppercase tracking-wide">All Tests Passed</p>
                    <span className="ml-auto text-sm font-bold text-green-700">
                      {submissionResult.score?.toFixed(1) || 100}%
                    </span>
                  </div>

                  {(submissionResult.testResults || submissionResult.runResult?.testResults) &&
                    (submissionResult.testResults || submissionResult.runResult?.testResults).length > 0 && (
                      <div className="space-y-2 mt-3">
                        {(submissionResult.testResults || submissionResult.runResult?.testResults).map(
                          (testCase, idx) => (
                            <div
                              key={testCase.testcaseId || idx}
                              className="p-2.5 rounded text-xs bg-green-100 border border-green-300"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                <span className="font-semibold">Test {idx + 1}</span>
                                <span className="ml-auto font-bold text-green-600">✓ PASS</span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
