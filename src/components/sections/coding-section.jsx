'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Play, Copy, Check, CheckCircle, Loader2, AlertCircle, Trophy } from 'lucide-react';
import { submitCode } from '../../api_services/modules.api';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';
import ResultModal from '../modals/ResultModal';

const DEFAULT_PROBLEM = {
  title: 'Build a Counter Component',
  difficulty: 'Easy',
  description: 'Create a React component that displays a counter with increment and decrement buttons.',
  examples: [
    {
      input: 'User clicks increment button 3 times',
      output: 'Counter displays: 3'
    },
    {
      input: 'User clicks decrement button 2 times',
      output: 'Counter displays: -2'
    }
  ],
  testcases: [
    {
      id: '1',
      input: 'Click increment',
      expectedOutput: 'Count: 1'
    },
    {
      id: '2',
      input: 'Click decrement',
      expectedOutput: 'Count: -1'
    }
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
}`
};

export default function CodingSection({ moduleData, moduleId, onSuccess }) {
  const navigate = useNavigate();
  const { refetchUser } = useApp();

  // Get template code from server's templateFiles array
  const templateFile = moduleData?.codingTask?.templateFiles?.find(file => file.path.includes("main"));
  const templateCode = templateFile ? templateFile.content : DEFAULT_PROBLEM.templateCode;

  // Check if coding is already completed from moduleData
  const isCodingAlreadyCompleted = moduleData?.isCodingCompleted || false;
  const codingScore = moduleData?.codingScore || 0;

  // Map server coding task structure to expected format
  const problem = moduleData?.codingTask ? {
    title: moduleData.codingTask.title || 'Coding Challenge',
    difficulty: moduleData.codingTask.difficulty || 'Medium',
    description: moduleData.codingTask.description || 'Complete the coding challenge',
    examples: [
      {
        input: 'Run the test cases below',
        output: 'Your code should pass all tests'
      }
    ],
    testcases: moduleData.codingTask.testcases || DEFAULT_PROBLEM.testcases,
    templateCode: templateCode
  } : DEFAULT_PROBLEM;

  const [code, setCode] = useState(problem.templateCode);
  const [copied, setCopied] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [dividerPos, setDividerPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState(null);
  const containerRef = useRef(null);

  // Get cooldown info
  const codingCooldown = moduleData?.codingCooldown;
  const isInCooldown = codingCooldown?.isInCooldown || false;

  // Initialize cooldown time remaining from backend data if available
  const initialCountdownSeconds = codingCooldown?.cooldownRemainingSeconds;

  // Countdown timer effect
  useEffect(() => {
    if (!isInCooldown || !codingCooldown?.cooldownUntil) {
      setCooldownTimeRemaining(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const cooldownEnd = new Date(codingCooldown.cooldownUntil);
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
  }, [isInCooldown, codingCooldown?.cooldownUntil, initialCountdownSeconds]);

  // Format seconds to MM:SS format
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Infer language from file or use default
      const language = moduleData?.codingTask?.languages?.[0] || 'javascript';

      const response = await submitCode(moduleId, { code, language });
      const { data } = response;

      setSubmissionResult(data);
      setSubmitted(true);

      // Handle test results display
      if (data.testResults) {
        const passedCount = data.testResults.filter(r => r.passed).length;
        setTestResults({
          passed: passedCount,
          total: data.testResults.length,
          details: data.testResults
        });
      }

      // Show modal immediately for feedback
      setSubmissionResult(data);
      setShowResultModal(true);

      // Silently refetch data in background ONLY if passed
      // Don't refetch on fail to avoid unnecessary reloads
      if (data.status === 'passed') {
        // Delay slightly to ensure modal is displayed first
        setTimeout(() => onSuccess?.(), 100);
      }
    } catch (err) {
      let errorMsg = 'Failed to submit code. Please try again.';

      if (err.status === 404) {
        if (err.message.includes('Module') || err.message.includes('coding task')) {
          errorMsg = 'Module or coding task not found.';
        }
      } else if (err.status === 400) {
        if (err.message.includes('Language')) {
          errorMsg = err.message;
        } else {
          errorMsg = 'Invalid code submission. Please check your input.';
        }
      } else if (err.status === 500) {
        errorMsg = 'Server error processing your code. Please try again later.';
      }

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRun = () => {
    setTestResults({
      passed: 2,
      total: 2,
      details: [
        { id: '1', status: 'passed', message: 'Test case 1 passed' },
        { id: '2', status: 'passed', message: 'Test case 2 passed' }
      ]
    });
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const newPos = ((e.clientX - rect.left) / rect.width) * 100;

    if (newPos > 25 && newPos < 75) {
      setDividerPos(newPos);
    }
  };

  const handleReset = () => {
    setCode(problem.templateCode);
    setSubmitted(false);
    setSubmissionResult(null);
    setTestResults(null);
    setError(null);
  };

  const handleModalNext = async () => {
    setShowResultModal(false);

    // Handle different completion scenarios based on backend response
    const { isCourseCompleted, isProfessionCompleted, isModuleCompleted, status } = submissionResult;

    if (isProfessionCompleted) {
      // User completed entire profession
      toast.success('🎓 Profession completed! Certificate generated.');
      setTimeout(() => navigate('/learning'), 800);
    } else if (isCourseCompleted) {
      // User completed all modules in course
      toast.success('🎉 Course completed! Certificate generated.');
      setTimeout(() => navigate('/learning'), 800);
    } else if (isModuleCompleted) {
      // User completed current module and moved to next
      toast.success('Module completed! Moving to next module...');
      await refetchUser(); // Refetch to get updated currentModule
      setTimeout(() => window.location.reload(), 500); // Reload to show next module
    } else if (status === 'passed') {
      // Passed coding challenge but MCQ not yet done (or vice versa)
      toast.success('✓ Code passed! Complete the MCQ to finish the module.');
      // Silently refetch in background
      await refetchUser();
    } else {
      // Failed - reset for retry
      handleReset();
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

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
          <div className="p-2.5 space-y-2">
            {/* Completion Status */}
            {isCodingAlreadyCompleted && (
              <div className="p-1.5 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-green-700">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <p className="text-xs font-semibold">✓ Completed ({codingScore.toFixed(1)}%)</p>
              </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-1.5 flex-1 min-w-0">
                <Code2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-black line-clamp-2">{problem.title}</h2>
                  <span className="inline-block px-1 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded mt-0.5">
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pt-1">
              <h3 className="text-xs font-bold text-gray-700 mb-0.5 uppercase tracking-wider">Description</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{problem.description}</p>
            </div>

            {/* Examples */}
            <div className="pt-1 border-t border-gray-200">
              <h3 className="text-xs font-bold text-gray-700 mb-0.5 uppercase tracking-wider">Examples</h3>
              <div className="space-y-0.5">
                {problem.examples.map((example, idx) => (
                  <div key={idx} className="bg-gray-50 rounded p-1 text-xs border border-gray-200">
                    <p className="text-gray-700"><span className="font-semibold text-xs">Input:</span> {example.input}</p>
                    <p className="text-gray-700 mt-0.5"><span className="font-semibold text-xs">Output:</span> {example.output}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Cases */}
            <div className="pt-1 border-t border-gray-200">
              <h3 className="text-xs font-bold text-gray-700 mb-0.5 uppercase tracking-wider">Test Cases</h3>
              <div className="space-y-0.5">
                {problem.testcases.map((test) => (
                  <div key={test.id} className="bg-gray-50 rounded p-1 text-xs border border-gray-200">
                    <p className="text-gray-700"><span className="font-semibold text-xs">Test #{test.id}:</span> {test.input}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          onMouseDown={handleMouseDown}
          className={`w-1 bg-gray-200 hover:bg-blue-400 cursor-col-resize transition-colors ${isDragging ? 'bg-blue-400' : ''}`}
        ></div>

        <div className="flex flex-col overflow-hidden" style={{ width: `${100 - dividerPos}%` }}>
          {/* Editor Header with Buttons */}
          <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-2.5 py-1.5 gap-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Solution.jsx</span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className="p-0.5 hover:bg-gray-200 rounded transition-colors text-gray-600 hover:text-gray-900"
                title="Copy code"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>

              {isCodingAlreadyCompleted && !submitted ? (
                <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </div>
              ) : submitted && submissionResult?.status === 'passed' ? (
                <button
                  onClick={handleReset}
                  className="px-2 py-0.5 border border-gray-300 text-gray-700 text-xs font-semibold rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
                >
                  Try Again
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isCodingAlreadyCompleted}
                  className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  {isSubmitting && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </div>

          {/* Code Editor - Full height */}
          <textarea
            value={code}
            onChange={(e) => !isCodingAlreadyCompleted && setCode(e.target.value)}
            disabled={isCodingAlreadyCompleted}
            className="flex-1 bg-gray-900 text-gray-100 p-2.5 font-mono text-xs focus:outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            spellCheck="false"
          />

          {/* Error Display & Cooldown */}
          {isInCooldown && (
            <>
              {console.log('Rendering coding cooldown box - isInCooldown:', isInCooldown, 'codingCooldown:', codingCooldown)}
              <div className={`border-t p-2 text-xs flex items-start gap-2 bg-orange-50 border-orange-200 text-orange-700`}>
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
                    Attempt {codingCooldown?.attemptNumber}
                  </p>
                </div>
              </div>
            </>
          )}

          {error && !isInCooldown && (
            <div className={`border-t p-2 text-xs flex items-start gap-2 bg-red-50 border-red-200 text-red-700`}>
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{error}</p>
              </div>
            </div>
          )}

          {/* Submission Result Display */}
          {submitted && submissionResult && (
            <div className={`border-t p-2 max-h-56 overflow-y-auto ${submissionResult.status === 'passed'
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-200'
              }`}>
              <div className="flex items-center gap-2 mb-1.5">
                {submissionResult.status === 'passed' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                )}
                <p className={`text-xs font-bold ${submissionResult.status === 'passed' ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                  {submissionResult.status === 'passed' ? '✓ All Tests Passed!' : 'Some Tests Failed'}
                </p>
              </div>
              <p className={`text-xs mb-2 ${submissionResult.status === 'passed' ? 'text-green-700' : 'text-yellow-700'
                }`}>
                Score: <span className="font-bold">{submissionResult.score?.toFixed(1) || 0}%</span>
                {submissionResult.testResults && ` • ${submissionResult.testResults.filter(r => r.passed).length}/${submissionResult.testResults.length} tests passed`}
              </p>

              {/* Detailed Test Cases */}
              {submissionResult.testResults && submissionResult.testResults.length > 0 && (
                <div className="mb-2 space-y-1">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Test Results:</p>
                  {submissionResult.testResults.map((testCase, idx) => (
                    <div
                      key={testCase.testcaseId || idx}
                      className={`p-1.5 rounded border text-xs ${testCase.passed
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-red-100 border-red-300 text-red-800'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${testCase.passed ? 'bg-green-600' : 'bg-red-600'}`}></div>
                        <span className="font-semibold">Test Case {idx + 1}</span>
                        <span className={`ml-auto font-bold ${testCase.passed ? 'text-green-600' : 'text-red-600'}`}>
                          {testCase.passed ? '✓ PASSED' : '✗ FAILED'}
                        </span>
                      </div>
                      {testCase.hidden ? (
                        <div className="ml-3 text-xs italic opacity-75">
                          Hidden test case
                        </div>
                      ) : (
                        <div className="ml-3 text-xs space-y-0.5">
                          {testCase.input && (
                            <p><span className="font-semibold">Input:</span> {testCase.input}</p>
                          )}
                          {testCase.expectedOutput && (
                            <p><span className="font-semibold">Expected:</span> {testCase.expectedOutput}</p>
                          )}
                          {testCase.output && (
                            <p><span className="font-semibold">Output:</span> {testCase.output}</p>
                          )}
                        </div>
                      )}
                      {testCase.error && (
                        <div className="ml-3 text-xs">
                          <p><span className="font-semibold">Error:</span> {testCase.error}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

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

              {submissionResult.isModuleCompleted && (
                <div className="mt-2 p-1.5 bg-indigo-100 border border-indigo-300 rounded text-xs text-indigo-700 font-semibold flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  Module Completed! 🎉
                </div>
              )}
            </div>
          )}

          {/* Output Section from Test Run */}
          {testResults && !submitted && (
            <div className="bg-gray-50 border-t border-gray-200 p-2 max-h-16 overflow-y-auto">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Output</p>
                <p className={`text-xs font-bold ${testResults.passed === testResults.total ? 'text-green-600' : 'text-yellow-600'}`}>
                  {testResults.passed}/{testResults.total} Passed
                </p>
              </div>
              <div className="space-y-0.5">
                {testResults.details.map((detail, idx) => (
                  <div key={detail.id || idx} className={`text-xs flex items-center gap-1.5 ${detail.status === 'passed' ? 'text-green-700' : 'text-gray-700'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${detail.status === 'passed' ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                    <span>{detail.message || `Test case ${detail.id}`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
