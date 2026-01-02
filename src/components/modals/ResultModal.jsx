import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Trophy, Zap, X, Lock } from 'lucide-react';

export default function ResultModal({
  isOpen,
  onClose,
  onNext,
  result,
  type = 'mcq', // 'mcq' or 'coding'
  cooldownInfo = null
}) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
    }
  }, [isOpen]);

  // Countdown timer for cooldown
  useEffect(() => {
    if (!cooldownInfo?.isInCooldown) return;

    const interval = setInterval(() => {
      const now = new Date();
      const cooldownEnd = new Date(cooldownInfo.cooldownUntil);
      const remaining = Math.ceil((cooldownEnd - now) / 1000);

      if (remaining <= 0) {
        setCooldownTimeRemaining(null);
        clearInterval(interval);
      } else {
        setCooldownTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownInfo?.isInCooldown, cooldownInfo?.cooldownUntil]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !result) return null;

  // Determine result status and messaging
  const isPassed = result.passed || result.status === 'passed';
  const isCourseCompleted = result.isCourseCompleted;
  const isProfessionCompleted = result.isProfessionCompleted;
  const isModuleCompleted = result.isModuleCompleted;

  // Calculate test pass rate for coding
  const testPassRate = result.testResults
    ? `${result.testResults.filter(r => r.passed).length}/${result.testResults.length}`
    : '';

  // Messaging system
  const getTitle = () => {
    if (isCourseCompleted) return '🎓 Course Completed!';
    if (isProfessionCompleted) return '🏆 Profession Completed!';
    if (isModuleCompleted) return '✨ Module Completed!';
    if (isPassed) return type === 'mcq' ? '🎉 Great Job!' : '🚀 All Tests Passed!';
    return '⚠️ Keep Trying!';
  };

  const getMessage = () => {
    if (isCourseCompleted) {
      return 'You have successfully completed the entire course! A certificate has been generated. Congratulations on this amazing achievement!';
    }
    if (isProfessionCompleted) {
      return 'Outstanding! You have completed all courses in this profession track. You are now a certified professional!';
    }
    if (isModuleCompleted) {
      return 'Excellent work! You have completed this module. Ready to take on the next challenge?';
    }
    if (isPassed) {
      if (type === 'mcq') {
        return `Perfect score! You answered all MCQs correctly. Score: ${result.score?.toFixed(1) || 0}%. Excellent understanding of the concepts!`;
      } else {
        return `Outstanding! All ${testPassRate} tests passed. Your code is working perfectly! Score: ${result.score?.toFixed(1) || 0}%`;
      }
    }
    if (type === 'mcq') {
      return `Score: ${result.score?.toFixed(1) || 0}%. Review the concepts and try again. Every attempt helps you learn better!`;
    } else {
      const passed = result.testResults?.filter(r => r.passed).length || 0;
      const total = result.testResults?.length || 0;
      return `${passed}/${total} tests passed. Score: ${result.score?.toFixed(1) || 0}%. Review the failed test cases and give it another shot!`;
    }
  };

  const getButtonText = () => {
    if (isCourseCompleted || isProfessionCompleted) return 'Nicee!';
    if (isModuleCompleted) return 'Cool!';
    if (isPassed) {
      if (type === 'coding') return 'Next Section';
      return type === 'mcq' ? 'Next Section' : 'Next Section';
    }
    return 'Try Again';
  };

  const getScoreColor = () => {
    if (isCourseCompleted || isProfessionCompleted || isModuleCompleted) return 'text-purple-600';
    if (isPassed) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getBgColor = () => {
    if (isCourseCompleted || isProfessionCompleted || isModuleCompleted) return 'bg-purple-50 border-purple-200';
    if (isPassed) return 'bg-green-50 border-green-200';
    return 'bg-yellow-50 border-yellow-200';
  };

  const getIconColor = () => {
    if (isCourseCompleted || isProfessionCompleted || isModuleCompleted) return 'text-purple-600';
    if (isPassed) return 'text-green-600';
    return 'text-yellow-600';
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 ${showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
      >
        {/* Header */}
        <div className={`border-b ${getBgColor()} p-4 flex items-start justify-between`}>
          <div className="flex items-start gap-3">
            <div className={`${getIconColor()} mt-1`}>
              {(isCourseCompleted || isProfessionCompleted || isModuleCompleted) ? (
                <Trophy className="w-6 h-6" />
              ) : isPassed ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className={`text-lg font-bold ${getScoreColor()}`}>{getTitle()}</h2>
            </div>
          </div>
          {/* Hide close button for passed coding, module completed, or course/profession completed */}
          {!(type === 'coding' && isPassed) && !isModuleCompleted && !isCourseCompleted && !isProfessionCompleted && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Score Display */}
        <div className="p-6 text-center">
          <div className={`text-5xl font-bold ${getScoreColor()} mb-2`}>
            {result.score?.toFixed(1) || 0}%
          </div>
          {type === 'coding' && result.testResults && (
            <p className="text-sm text-gray-600 mb-4">
              {result.testResults.filter(r => r.passed).length}/{result.testResults.length} Tests Passed
            </p>
          )}
          {type === 'mcq' && (
            <p className="text-sm text-gray-600 mb-4">
              Attempt #{result.attemptNumber || 1}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="px-6 pb-4">
          <p className="text-gray-700 text-center text-sm leading-relaxed">
            {getMessage()}
          </p>
        </div>

        {/* Test Results Summary for Coding */}
        {type === 'coding' && result.testResults && result.testResults.length > 0 && !isPassed && (
          <div className="px-6 pb-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Test Details:</p>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {result.testResults.map((test, idx) => (
                <div key={test.testcaseId || idx} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${test.passed ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  <span className="text-gray-700">Test Case {idx + 1}</span>
                  <span className={`ml-auto font-semibold ${test.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {test.passed ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cooldown Information */}
        {cooldownInfo?.isInCooldown && (
          <div className="px-6 pb-4 border-t border-red-100 bg-red-50">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-red-600" />
              <p className="text-sm font-semibold text-red-900">Section Locked</p>
            </div>
            <p className="text-xs text-red-800 mb-2">
              You're in cooldown. Try again after:
            </p>
            <div className="bg-white rounded px-3 py-2 text-center">
              <p className="text-2xl font-bold text-red-600">
                {cooldownTimeRemaining ? formatTime(cooldownTimeRemaining) : 'Refreshing...'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Attempt {cooldownInfo.attemptNumber || 1}
              </p>
            </div>
          </div>
        )}

        {/* Completion Messages */}
        {(isCourseCompleted || isProfessionCompleted || isModuleCompleted) && (
          <div className={`px-6 pb-4 border-t ${isPassed ? 'border-green-100' : 'border-gray-100'}`}>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-500" />
              <p className="text-gray-700 font-medium">
                {isCourseCompleted && 'Your certificate is ready!'}
                {isProfessionCompleted && 'You are now a certified professional!'}
                {isModuleCompleted && 'Amazing progress! Keep it up!'}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          {/* Show Close button only if: NOT (passed coding OR module/course/profession completed) */}
          {!(type === 'coding' && isPassed) && !isModuleCompleted && !isCourseCompleted && !isProfessionCompleted && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Close
            </button>
          )}
          <button
            onClick={onNext}
            className={`${(type === 'coding' && isPassed) || isModuleCompleted || isCourseCompleted || isProfessionCompleted ? 'w-full' : 'flex-1'} px-4 py-2 text-white rounded-lg transition-colors text-sm font-medium ${isCourseCompleted || isProfessionCompleted
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}
