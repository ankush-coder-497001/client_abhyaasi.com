"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Brain, Loader2, AlertCircle, CheckCircle, Lock, ChevronRight } from "lucide-react"
import { submitMCQ } from "../../api_services/modules.api"
import { useApp } from "../../context/AppContext"
import toast from "react-hot-toast"
import ResultModal from "../modals/ResultModal"

const DEFAULT_MCQS = [
  {
    id: 1,
    question: "What is the correct way to pass data from parent to child component in React?",
    options: ["Using props", "Using global variables", "Using local storage", "Using context API directly"],
    correctOptionIndex: 0,
    explanation: "Props are the standard way to pass data from parent to child components in React.",
  },
  {
    id: 2,
    question: "Which hook is used to handle side effects in functional components?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctOptionIndex: 1,
    explanation: "The useEffect hook is designed for handling side effects such as API calls and subscriptions.",
  },
]

export default function MCQSection({ moduleData, moduleId, onSuccess, onNavigate }) {
  const navigate = useNavigate()
  const { refetchUser } = useApp()
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [submissionResult, setSubmissionResult] = useState(null)
  const [cooldownUntil, setCooldownUntil] = useState(null)
  const [showResultModal, setShowResultModal] = useState(false)
  const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState(null)

  const isMcqAlreadyCompleted = moduleData?.isMcqCompleted || false
  const mcqScore = moduleData?.mcqScore || 0

  const mcqs =
    moduleData?.mcqs?.map((mcq) => ({
      id: mcq._id,
      question: mcq.question,
      options: mcq.options || [],
      correctOptionIndex: 0,
      explanation: mcq.explanation || "Review the content to understand this better.",
      maxAttempts: mcq.maxAttempts || 20,
    })) || DEFAULT_MCQS

  const mcqCooldown = moduleData?.mcqCooldown
  const mcqAttemptsLeft = moduleData?.mcqAttemptsLeft
  const isNoAttemptsLeft = mcqAttemptsLeft !== null && mcqAttemptsLeft === 0
  const isInCooldown = mcqCooldown?.isInCooldown || false
  const initialCountdownSeconds = mcqCooldown?.cooldownRemainingSeconds

  useEffect(() => {
    if (!isInCooldown || !mcqCooldown?.cooldownUntil) {
      setCooldownTimeRemaining(null)
      return
    }

    const updateCountdown = () => {
      const now = new Date()
      const cooldownEnd = new Date(mcqCooldown.cooldownUntil)
      const remaining = Math.ceil((cooldownEnd - now) / 1000)
      if (remaining <= 0) setCooldownTimeRemaining(null)
      else setCooldownTimeRemaining(remaining)
    }

    if (initialCountdownSeconds) setCooldownTimeRemaining(initialCountdownSeconds)
    else updateCountdown()

    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [isInCooldown, mcqCooldown?.cooldownUntil, initialCountdownSeconds])

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const handleSelectOption = (mcqId, index) => {
    if (!submitted && !isMcqAlreadyCompleted && !isNoAttemptsLeft) {
      setSelectedAnswers({ ...selectedAnswers, [mcqId]: index })
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const answers = Object.entries(selectedAnswers).map(([_, answerIndex]) => answerIndex)
      const response = await submitMCQ(moduleId, { answers })
      const { data } = response
      setSubmissionResult(data)
      if (data.cooldownUntil) setCooldownUntil(new Date(data.cooldownUntil))
      setShowResultModal(true)
      setSubmitted(true)
    } catch (err) {
      let errorMsg = "Failed to submit MCQ. Please try again."
      if (err.status === 400) errorMsg = err.message || "Please answer all questions."
      else if (err.status === 403 && err.message.includes("already completed")) {
        setSubmitted(true)
        setSubmissionResult({ passed: true, score: 100 })
        return
      }
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setSubmitted(false)
    setSubmissionResult(null)
    setError(null)
    setCooldownUntil(null)
  }

  const handleModalNext = async () => {
    setShowResultModal(false)

    // Handle different completion scenarios based on backend response
    const { isCourseCompleted, isProfessionCompleted, isModuleCompleted, passed } = submissionResult

    if (isProfessionCompleted) {
      onSuccess()
      onNavigate("interview")
    } else if (isCourseCompleted) {
      onSuccess()
      onNavigate("interview")
    } else if (isModuleCompleted) {
      onSuccess()
      onNavigate("interview")
    } else if (passed) {
      onSuccess()
      onNavigate("interview")
    } else {
      // Failed - allow retry if not in cooldown
      handleReset()
    }
  }

  const progress = Object.keys(selectedAnswers).length

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] font-sans text-[#1F1F1F]">
      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        onNext={handleModalNext}
        result={submissionResult}
        type="mcq"
        cooldownInfo={moduleData?.mcqCooldown}
      />

      {/* Header */}
      <div className="px-6 py-5 bg-white border-b border-[#E1E1E1] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0056D2]/10 rounded-lg">
              <Brain className="w-5 h-5 text-[#0056D2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[#1F1F1F]">Knowledge Check</h2>
              <p className="text-sm text-[#636363]">Select the best answer for each question</p>
            </div>
          </div>
          {(isMcqAlreadyCompleted || submitted) && (
            <div
              className={`px-3 py-1.5 rounded-full text-sm font-bold border ${submissionResult?.passed || isMcqAlreadyCompleted
                ? "bg-[#E7F3EF] text-[#006944] border-[#B2D6C9]"
                : "bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]"
                }`}
            >
              Score: {submissionResult?.score?.toFixed(0) || mcqScore.toFixed(0)}%
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#636363]">
            <span>Assessment Progress</span>
            <span>
              {progress} of {mcqs.length} answered
            </span>
          </div>
          <div className="h-1.5 w-full bg-[#E1E1E1] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0056D2] transition-all duration-500 ease-out"
              style={{ width: `${(progress / mcqs.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 custom-scrollbar">
        {isInCooldown && (
          <div className="flex items-center gap-4 p-4 bg-[#FFF3E0] border border-[#FFE0B2] rounded-xl animate-in fade-in slide-in-from-top-2">
            <div className="p-2 bg-white rounded-full">
              <Lock className="w-5 h-5 text-[#E65100]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#E65100]">Cooldown in effect</p>
              <p className="text-xs text-[#636363]">
                Next attempt available in{" "}
                {cooldownTimeRemaining !== null ? formatCountdown(cooldownTimeRemaining) : "..."}
              </p>
            </div>
          </div>
        )}

        {mcqs.map((mcq, idx) => (
          <div
            key={mcq.id}
            className="group animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex gap-4 mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-[#E1E1E1] text-sm font-bold text-[#1F1F1F] shrink-0 shadow-sm">
                {idx + 1}
              </span>
              <p className="text-[15px] font-medium leading-relaxed text-[#1F1F1F] pt-1">{mcq.question}</p>
            </div>

            <div className="grid gap-3 pl-12">
              {mcq.options.map((option, index) => {
                const isSelected = selectedAnswers[mcq.id] === index
                const isCorrect = submitted && index === mcq.correctOptionIndex
                const isWrong = submitted && isSelected && index !== mcq.correctOptionIndex

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(mcq.id, index)}
                    disabled={submitted || isMcqAlreadyCompleted || isNoAttemptsLeft}
                    className={`
                      relative w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 group/btn
                      ${isSelected ? "border-[#0056D2] bg-white shadow-md" : "border-transparent bg-white hover:border-[#E1E1E1] shadow-sm"}
                      ${isCorrect ? "!border-[#006944] !bg-[#E7F3EF]" : ""}
                      ${isWrong ? "!border-[#D32F2F] !bg-[#FFEBEE]" : ""}
                      ${submitted || isNoAttemptsLeft ? "cursor-default" : "cursor-pointer active:scale-[0.99]"}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                        ${isSelected ? "border-[#0056D2]" : "border-[#E1E1E1] group-hover/btn:border-[#0056D2]"}
                        ${isCorrect ? "!border-[#006944]" : ""}
                        ${isWrong ? "!border-[#D32F2F]" : ""}
                      `}
                      >
                        {(isSelected || isCorrect || isWrong) && (
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${isCorrect ? "bg-[#006944]" : isWrong ? "bg-[#D32F2F]" : "bg-[#0056D2]"
                              }`}
                          />
                        )}
                      </div>
                      <span className={`text-[15px] ${isSelected ? "font-bold text-[#1F1F1F]" : "text-[#3D3D3D]"}`}>
                        {option}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {submitted && selectedAnswers[mcq.id] !== undefined && (
              <div className="mt-4 ml-12 p-4 bg-white border border-[#E1E1E1] rounded-xl shadow-sm animate-in zoom-in-95">
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswers[mcq.id] === mcq.correctOptionIndex ? (
                    <CheckCircle className="w-4 h-4 text-[#006944]" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#D32F2F]" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-[#636363]">Explanation</span>
                </div>
                <p className="text-sm leading-relaxed text-[#3D3D3D]">{mcq.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-6 bg-white border-t border-[#E1E1E1] flex gap-4 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {submitted ? (
          <button
            onClick={handleReset}
            disabled={isInCooldown || (cooldownUntil && new Date() < cooldownUntil)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[#3D3D3D] bg-white border-2 border-[#E1E1E1] hover:bg-[#F8F9FA] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(isInCooldown || (cooldownUntil && new Date() < cooldownUntil)) ? (
              <>
                <Lock className="w-4 h-4" />
                Locked
              </>
            ) : submissionResult?.passed || isMcqAlreadyCompleted ? (
              "Review Content"
            ) : (
              "Try Again"
            )}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={progress < mcqs.length || isLoading || isInCooldown || isMcqAlreadyCompleted || isNoAttemptsLeft}
            className={`
              flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all
              ${progress < mcqs.length || isLoading || isInCooldown || isMcqAlreadyCompleted || isNoAttemptsLeft
                ? "bg-[#E1E1E1] cursor-not-allowed shadow-none text-[#636363]"
                : "bg-[#0056D2] hover:bg-[#00419E] hover:-translate-y-0.5 active:translate-y-0"
              }
            `}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isNoAttemptsLeft ? (
              <>
                <Lock className="w-5 h-5" />
                No Attempts Left
              </>
            ) : isMcqAlreadyCompleted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Completed
              </>
            ) : (
              <>
                Submit Assessment
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
