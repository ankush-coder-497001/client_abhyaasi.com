
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Loader2, AlertCircle, CheckCircle, Trophy, Lock } from 'lucide-react';
import { submitMCQ } from '../../api_services/modules.api';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';
import ResultModal from '../modals/ResultModal';

const DEFAULT_MCQS = [
  {
    id: 1,
    question: 'What is the correct way to pass data from parent to child component in React?',
    options: [
      'Using props',
      'Using global variables',
      'Using local storage',
      'Using context API directly'
    ],
    correctOptionIndex: 0,
    explanation: 'Props are the standard way to pass data from parent to child components in React. They are passed as arguments to the component function.'
  },
  {
    id: 2,
    question: 'Which hook is used to handle side effects in functional components?',
    options: [
      'useState',
      'useEffect',
      'useContext',
      'useReducer'
    ],
    correctOptionIndex: 1,
    explanation: 'The useEffect hook is designed for handling side effects such as API calls, subscriptions, and DOM manipulation.'
  },
];

export default function MCQSection({ moduleData, moduleId, onSuccess, onNavigate }) {
  const navigate = useNavigate();
  const { refetchUser } = useApp();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [showResultModal, setShowResultModal] = useState(false);
  const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState(null);

  // Check if MCQ is already completed from moduleData
  const isMcqAlreadyCompleted = moduleData?.isMcqCompleted || false;
  const mcqScore = moduleData?.mcqScore || 0;

  // Use module MCQs if available, otherwise use defaults
  // Map server MCQ structure to expected format
  const mcqs = moduleData?.mcqs?.map((mcq) => ({
    id: mcq._id,
    question: mcq.question,
    options: mcq.options || [],
    correctOptionIndex: 0, // Note: Server doesn't send correct option index, so we can't validate
    explanation: mcq.explanation || 'Review the content to understand this better.',
    maxAttempts: mcq.maxAttempts || 20
  })) || DEFAULT_MCQS;

  // Get cooldown and attempts info
  const mcqCooldown = moduleData?.mcqCooldown;
  const mcqAttemptsLeft = moduleData?.mcqAttemptsLeft;
  const isNoAttemptsLeft = mcqAttemptsLeft !== null && mcqAttemptsLeft === 0;
  const isInCooldown = mcqCooldown?.isInCooldown || false;

  // Initialize cooldown time remaining from backend data if available
  const initialCountdownSeconds = mcqCooldown?.cooldownRemainingSeconds;

  // Countdown timer effect
  useEffect(() => {
    if (!isInCooldown || !mcqCooldown?.cooldownUntil) {
      setCooldownTimeRemaining(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const cooldownEnd = new Date(mcqCooldown.cooldownUntil);
      const remaining = Math.ceil((cooldownEnd - now) / 1000);

      if (remaining <= 0) {
        setCooldownTimeRemaining(null);
      } else {
        setCooldownTimeRemaining(remaining);
      }
    };

    // Set initial value immediately
    if (initialCountdownSeconds) {
      setCooldownTimeRemaining(initialCountdownSeconds);
    } else {
      updateCountdown();
    }

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isInCooldown, mcqCooldown?.cooldownUntil, initialCountdownSeconds]);

  // Format seconds to MM:SS format
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (mcqId, index) => {
    if (!submitted && !isMcqAlreadyCompleted && !isNoAttemptsLeft) {
      setSelectedAnswers({
        ...selectedAnswers,
        [mcqId]: index
      });
    }
  };



  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Convert selectedAnswers object to array format expected by backend
      // selectedAnswers is { mcqId: answerIndex, ... }
      const answers = Object.entries(selectedAnswers).map(([_, answerIndex]) => answerIndex);

      const response = await submitMCQ(moduleId, { answers });

      // Handle successful response
      const { data } = response;
      setSubmissionResult(data);
      setAttemptNumber(data.attemptNumber || 1);

      if (data.cooldownUntil) {
        setCooldownUntil(new Date(data.cooldownUntil));
      }

      // Show modal immediately for feedback
      setSubmissionResult(data);
      setShowResultModal(true);
      setSubmitted(true);
    } catch (err) {
      // Handle different error scenarios
      let errorMsg = 'Failed to submit MCQ. Please try again.';
      let isBlockingError = false;
      console.error('MCQ Submission Error:', err);
      if (err.status === 404) {
        if (err.message.includes('Module not found')) {
          errorMsg = 'Module not found. Please check and try again.';
        } else if (err.message.includes('User not found')) {
          errorMsg = 'User session expired. Please login again.';
        }
      } else if (err.status === 400) {
        errorMsg = err.message || 'Invalid answer format. Please answer all questions.';
      } else if (err.status === 403) {
        // Cooldown or already completed
        if (err.message.includes('cooldown')) {
          errorMsg = err.message; // Use server's cooldown message
          const cooldownMatch = err.message.match(/(\d{1,2}:\d{2}:\d{2})/);
          if (cooldownMatch) {
            setCooldownUntil(new Date(err.message.split('at ')[1]));
          }
        } else if (err.message.includes('cooldown')) {
          errorMsg = err.message;
          isBlockingError = true;
        } else if (err.message.includes('already completed')) {
          errorMsg = '✓ MCQs already completed successfully!';
          setSubmitted(true);
          setSubmissionResult({ passed: true, score: 100 });
          toast.success('You have already passed this module!');
          return;
        }
      } else if (err.status === 500) {
        errorMsg = 'Server error. Please try again later.';
      }

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setSubmissionResult(null);
    setError(null);
    setCooldownUntil(null);
  };

  const handleModalNext = async () => {
    setShowResultModal(false);

    // Handle different completion scenarios based on backend response
    const { isCourseCompleted, isProfessionCompleted, isModuleCompleted, passed } = submissionResult;

    if (isProfessionCompleted) {
      // Do not auto redirect - user will click button
      toast.success('🎓 Profession completed! Certificate generated.');
      onNavigate('interview');
    } else if (isCourseCompleted) {
      // Do not auto redirect - user will click button
      toast.success('🎉 Course completed! Certificate generated.');
      onNavigate('interview');
    } else if (isModuleCompleted) {
      // Do not auto redirect - user will click button
      toast.success('Module completed! Click "Next Module" button to continue.');
      onNavigate('interview');
    } else if (passed) {
      // Passed MCQ but coding not yet done (or vice versa) - don't close modal, just refetch silently
      toast.success('✓ MCQ passed! Complete the coding challenge to finish the module.');
      //reload the data
      onSuccess()
      // move to coding section
      onNavigate('coding');
    } else {
      // Failed - show retry button, don't navigate or reload
      if (!cooldownUntil || new Date() >= cooldownUntil) {
        handleReset();
      }
    }
  };

  const progress = Object.keys(selectedAnswers).length;
  const correctAnswers = Object.entries(selectedAnswers).filter(
    ([mcqId, answerIndex]) => {
      const mcq = mcqs.find(m => m.id === parseInt(mcqId));
      return mcq && mcq.correctOptionIndex === answerIndex;
    }
  ).length;

  return (
    <>
      <ResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        onNext={handleModalNext}
        result={submissionResult}
        type="mcq"
        cooldownInfo={moduleData?.mcqCooldown}
      />
      <div className="p-2.5 space-y-1.5 h-full flex flex-col">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-blue-600" />
              <h2 className="text-xs font-bold text-black">Multiple Choice Questions</h2>
            </div>

          </div>
          <div className="flex items-center justify-between text-xs">
            <p className="text-gray-600">
              Answer all <span className="font-semibold">{mcqs.length}</span> questions
            </p>
            {isMcqAlreadyCompleted && !submitted && (
              <p className="text-xs font-bold px-1.5 py-0.5 rounded-full text-green-700 bg-green-50">
                ✓ {mcqScore.toFixed(1)}%
              </p>
            )}
            {submitted && submissionResult && (
              <p className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${submissionResult.passed
                ? 'text-green-700 bg-green-50'
                : 'text-yellow-700 bg-yellow-50'
                }`}>
                {submissionResult.passed ? '✓' : '⚠'} {submissionResult.score?.toFixed(1) || 0}%
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-0.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 font-medium">
              {isMcqAlreadyCompleted && !submitted ? 'Completed' : 'Progress'}
            </span>
            <span className="text-gray-500 text-xs">
              {isMcqAlreadyCompleted && !submitted ? 'All Questions Done' : `${progress}/${mcqs.length}`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-0.5">
            <div
              className={`h-0.5 rounded-full transition-all duration-300 ${isMcqAlreadyCompleted && !submitted ? 'bg-green-600' : 'bg-blue-600'
                }`}
              style={{ width: `${isMcqAlreadyCompleted && !submitted ? 100 : (progress / mcqs.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {isInCooldown && (
          <>

            <div className={`text-xs border p-2 rounded flex items-start gap-2 bg-orange-50 border-orange-200 text-orange-700`}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">In Cooldown Period</p>
                <div className="text-xs mt-2 bg-white bg-opacity-50 rounded p-2 text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {cooldownTimeRemaining !== null ? formatCountdown(cooldownTimeRemaining) : formatCountdown(initialCountdownSeconds || 0)}
                  </p>
                  <p className="text-xs mt-1 text-gray-700">Time until next attempt</p>
                </div>
                <p className="text-xs mt-2">
                  Attempt {mcqCooldown?.attemptNumber}
                </p>
              </div>
            </div>
          </>
        )}

        {isNoAttemptsLeft && (
          <div className={`text-xs border p-2 rounded flex items-start gap-2 bg-red-50 border-red-200 text-red-700`}>
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">No Attempts Remaining</p>
              <p className="text-xs mt-1">
                You have exhausted all your MCQ attempts. You cannot take this section again.
              </p>
            </div>
          </div>
        )}

        {error && !isInCooldown && !isNoAttemptsLeft && (
          <div className={`text-xs border p-2 rounded flex items-start gap-2 bg-red-50 border-red-200 text-red-700`}>
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
              {cooldownUntil && (
                <p className="text-xs mt-1">
                  Next attempt: {cooldownUntil.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        )}        {submissionResult && submitted && (
          <div className={`p-2 rounded border ${submissionResult.passed
            ? 'bg-green-50 border-green-200'
            : 'bg-yellow-50 border-yellow-200'
            }`}>
            <div className="flex items-center gap-2 mb-1.5">
              {submissionResult.passed ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-600" />
              )}
              <p className={`text-xs font-bold ${submissionResult.passed ? 'text-green-700' : 'text-yellow-700'}`}>
                {submissionResult.passed ? '✓ Success!' : 'Review Your Answers'}
              </p>
            </div>
            <p className={`text-xs mb-1 ${submissionResult.passed ? 'text-green-700' : 'text-yellow-700'}`}>
              Score: <span className="font-bold">{submissionResult.score?.toFixed(1) || 0}%</span>
              {submissionResult.totalQuestions && ` • ${submissionResult.results?.filter(r => r.isCorrect).length || 0}/${submissionResult.totalQuestions}`}
            </p>
            <p className={`text-xs ${submissionResult.passed ? 'text-green-600' : 'text-yellow-600'}`}>
              Attempt: {submissionResult.attemptNumber}
              {submissionResult.attemptNumber && submissionResult.attemptNumber > 3 && ' (Cooldown Active)'}
            </p>

            {submissionResult.isCourseCompleted && (
              <div className="mt-2 p-1.5 bg-blue-100 border border-blue-300 rounded text-xs text-blue-700 font-semibold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                Course Completed! Certificate generated.
              </div>
            )}

            {submissionResult.isProfessionCompleted && (
              <div className="mt-2 p-1.5 bg-purple-100 border border-purple-300 rounded text-xs text-purple-700 font-semibold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                Profession Completed! 🎓
              </div>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto pr-1.5 space-y-1">
          {mcqs.map((mcq, idx) => {
            const selected = selectedAnswers[mcq.id];
            const isCorrect = selected === mcq.correctOptionIndex;
            const isAnswered = selected !== undefined;

            return (
              <div key={mcq.id} className="bg-white border border-gray-200 rounded p-1.5 space-y-1 hover:border-blue-300 transition-all">
                {/* Question */}
                <div className="flex items-start gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-xs font-semibold text-gray-900 leading-snug">{mcq.question}</p>
                </div>

                {/* Options */}
                <div className="space-y-0.5 pl-5">
                  {mcq.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(mcq.id, index)}
                      disabled={submitted || isMcqAlreadyCompleted || isNoAttemptsLeft}
                      className={`w-full text-left p-1 border rounded transition-all text-xs ${selected === index
                        ? 'border-blue-400 bg-blue-50 text-gray-900'
                        : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
                        } ${submitted || isNoAttemptsLeft ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2.5 h-2.5 rounded-full border-2 shrink-0 transition-all ${selected === index
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300 bg-white'
                            }`}
                        >
                          {selected === index && <span className="text-white text-xs flex items-center justify-center">✓</span>}
                        </div>
                        <span className="text-xs">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {submitted && isAnswered && (
                  <div className="p-1 rounded border-l-4 border-l-blue-500 text-xs ml-5 bg-blue-50 text-gray-800">
                    <p className="font-semibold text-xs mb-0.5">
                      {isCorrect ? '✓ Correct' : '✗ Review'}
                    </p>
                    <p className="leading-relaxed text-gray-700 text-xs">{mcq.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-1.5 pt-1.5 border-t border-gray-200 shrink-0">
          {isMcqAlreadyCompleted && !submitted && (
            <div className="flex-1 flex items-center justify-center px-2.5 py-1 bg-green-50 border border-green-300 rounded text-xs font-semibold text-green-700">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
              ✓ Completed ({mcqScore.toFixed(1)}%)
            </div>
          )}

          {submitted && !submissionResult?.passed && (
            <button
              onClick={handleReset}
              disabled={cooldownUntil && new Date() < cooldownUntil}
              className="px-2.5 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-colors flex items-center gap-1"
            >
              {cooldownUntil && new Date() < cooldownUntil ? (
                <>
                  <Lock className="w-3 h-3" />
                  Cooldown Active
                </>
              ) : (
                'Try Again'
              )}
            </button>
          )}

          {submitted && submissionResult?.passed && (
            <button
              onClick={handleReset}
              className="px-2.5 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-xs font-semibold transition-colors"
            >
              Review Again
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={
              progress === 0 ||
              isLoading ||
              (submissionResult?.passed) ||
              (cooldownUntil && new Date() < cooldownUntil) ||
              isMcqAlreadyCompleted ||
              isNoAttemptsLeft
            }
            className="flex-1 px-2.5 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-colors flex items-center justify-center gap-1"
          >
            {isMcqAlreadyCompleted ? (
              <>
                <CheckCircle className="w-3 h-3" />
                Completed
              </>
            ) : isLoading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Submitting...
              </>
            ) : submitted && submissionResult?.passed ? (
              <>
                <CheckCircle className="w-3 h-3" />
                Passed
              </>
            ) : isNoAttemptsLeft ? (
              <>
                <Lock className="w-3 h-3" />
                No Attempts
              </>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
