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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-500 ${showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
      >
        {/* Header with Gradient */}
        <div className={`relative overflow-hidden p-6 ${getBgColor()}`}>
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white to-transparent"></div>
          <div className="relative flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getBgColor()} border-2 ${isPassed ? 'border-green-300' : isProfessionCompleted || isCourseCompleted ? 'border-purple-300' : 'border-yellow-300'
              }`}>
              {(isCourseCompleted || isProfessionCompleted || isModuleCompleted) ? (
                <Trophy className={`w-6 h-6 ${getIconColor()}`} />
              ) : isPassed ? (
                <CheckCircle className={`w-6 h-6 ${getIconColor()}`} />
              ) : (
                <AlertCircle className={`w-6 h-6 ${getIconColor()}`} />
              )}
            </div>
            <div className="flex-1">
              <h2 className={`text-xl font-bold ${getScoreColor()}`}>{getTitle()}</h2>
            </div>
            {!(type === 'coding' && isPassed) && !isModuleCompleted && !isCourseCompleted && !isProfessionCompleted && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/80 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Score Display */}
        <div className="px-6 py-8 text-center border-b border-gray-100">
          <div className={`text-6xl font-bold ${getScoreColor()} mb-3 tracking-tight`}>
            {result.score?.toFixed(1) || 0}%
          </div>
          {type === 'coding' && result.testResults && (
            <p className="text-sm text-gray-600 font-medium">
              {result.testResults.filter(r => r.passed).length}/{result.testResults.length} Tests Passed
            </p>
          )}
          {type === 'mcq' && (
            <p className="text-sm text-gray-600 font-medium">
              Attempt #{result.attemptNumber || 1}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="px-6 py-6 border-b border-gray-100">
          <p className="text-gray-700 text-center text-sm leading-relaxed font-medium">
            {getMessage()}
          </p>
        </div>

        {/* Test Results Summary for Coding */}
        {type === 'coding' && result.testResults && result.testResults.length > 0 && !isPassed && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Test Details</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {result.testResults.map((test, idx) => (
                <div key={test.testcaseId || idx} className="flex items-center gap-3 text-xs">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${test.passed ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  <span className="text-gray-700 flex-1">Test Case {idx + 1}</span>
                  <span className={`ml-auto font-bold ${test.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {test.passed ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cooldown Information */}
        {cooldownInfo?.isInCooldown && (
          <div className="px-6 py-4 border-b border-red-100 bg-red-50">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="w-4 h-4 text-red-600" />
              <p className="text-sm font-bold text-red-900">Section Locked</p>
            </div>
            <p className="text-xs text-red-800 mb-3 font-medium">Try again after:</p>
            <div className="bg-white rounded-lg px-4 py-3 text-center border border-red-100">
              <p className="text-3xl font-bold text-red-600 font-mono">
                {cooldownTimeRemaining ? formatTime(cooldownTimeRemaining) : 'Refreshing...'}
              </p>
              <p className="text-xs text-gray-600 mt-2 font-medium">
                Attempt {cooldownInfo.attemptNumber || 1}
              </p>
            </div>
          </div>
        )}

        {/* Completion Messages */}
        {(isCourseCompleted || isProfessionCompleted || isModuleCompleted) && (
          <div className="px-6 py-4 border-b border-purple-100 bg-purple-50">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-500" />
              <p className="text-sm text-gray-800 font-bold">
                {isCourseCompleted && '🎓 Your certificate is ready!'}
                {isProfessionCompleted && '🏆 You are now a certified professional!'}
                {isModuleCompleted && '⭐ Amazing progress! Keep it up!'}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 py-5 bg-gradient-to-b from-white to-gray-50 flex gap-3">
          {!(type === 'coding' && isPassed) && !isModuleCompleted && !isCourseCompleted && !isProfessionCompleted && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 text-sm font-semibold border border-gray-200 hover:border-gray-300 active:scale-95"
            >
              Close
            </button>
          )}
          <button
            onClick={onNext}
            className={`${(type === 'coding' && isPassed) || isModuleCompleted || isCourseCompleted || isProfessionCompleted ? 'w-full' : 'flex-1'} px-4 py-2.5 text-white rounded-lg transition-all duration-200 text-sm font-semibold ${isCourseCompleted || isProfessionCompleted
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/30'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30'
              } active:scale-95`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
