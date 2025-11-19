'use client';

import { useState } from 'react';
import { Brain } from 'lucide-react';

const MOCK_MCQS = [
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
  {
    id: 3,
    question: 'What does the Virtual DOM do?',
    options: [
      'Replaces the actual DOM',
      'Optimizes rendering by batching updates',
      'Stores user data',
      'Handles routing'
    ],
    correctOptionIndex: 1,
    explanation: 'The Virtual DOM is an in-memory representation of the actual DOM. React uses it to optimize updates and minimize direct DOM manipulation.'
  },
  {
    id: 4,
    question: 'Which of the following is NOT a built-in React Hook?',
    options: [
      'useState',
      'useCustom',
      'useContext',
      'useReducer'
    ],
    correctOptionIndex: 1,
    explanation: 'useCustom is not a built-in React hook. While you can create custom hooks, useCustom is not a standard hook provided by React.'
  },
  {
    id: 5,
    question: 'What is the purpose of keys in lists?',
    options: [
      'To encrypt data',
      'To help React identify which items have changed',
      'To improve styling',
      'To manage state'
    ],
    correctOptionIndex: 1,
    explanation: 'Keys help React identify which items have changed, been added, or been removed. This helps optimize re-renders in lists.'
  }
];

export default function MCQSection() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (mcqId, index) => {
    if (!submitted) {
      setSelectedAnswers({
        ...selectedAnswers,
        [mcqId]: index
      });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const progress = Object.keys(selectedAnswers).length;
  const correctAnswers = Object.entries(selectedAnswers).filter(
    ([mcqId, answerIndex]) => {
      const mcq = MOCK_MCQS.find(m => m.id === parseInt(mcqId));
      return mcq && mcq.correctOptionIndex === answerIndex;
    }
  ).length;

  return (
    <div className="p-2.5 space-y-1.5 h-full flex flex-col">
      <div className="space-y-0.5">
        <div className="flex items-center gap-1">
          <Brain className="w-3.5 h-3.5 text-blue-600" />
          <h2 className="text-xs font-bold text-black">Multiple Choice Questions</h2>
        </div>
        <div className="flex items-center justify-between text-xs">
          <p className="text-gray-600">
            Answer all <span className="font-semibold">{MOCK_MCQS.length}</span> questions
          </p>
          {submitted && (
            <p className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
              Score: {correctAnswers}/{MOCK_MCQS.length}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-0.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600 font-medium">Progress</span>
          <span className="text-gray-500 text-xs">{progress}/{MOCK_MCQS.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-0.5">
          <div
            className="bg-blue-600 h-0.5 rounded-full transition-all duration-300"
            style={{ width: `${(progress / MOCK_MCQS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1.5 space-y-1">
        {MOCK_MCQS.map((mcq, idx) => {
          const selected = selectedAnswers[mcq.id];
          const isCorrect = selected === mcq.correctOptionIndex;
          const isAnswered = selected !== undefined;

          return (
            <div key={mcq.id} className="bg-white border border-gray-200 rounded p-1.5 space-y-1 hover:border-blue-300 transition-all">
              {/* Question */}
              <div className="flex items-start gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
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
                    disabled={submitted}
                    className={`w-full text-left p-1 border rounded transition-all text-xs ${selected === index
                        ? 'border-blue-400 bg-blue-50 text-gray-900'
                        : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
                      } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2.5 h-2.5 rounded-full border-2 flex-shrink-0 transition-all ${selected === index
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

      <div className="flex gap-1.5 pt-1.5 border-t border-gray-200 flex-shrink-0">
        {submitted && (
          <button
            onClick={handleReset}
            className="px-2.5 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-xs font-semibold transition-colors"
          >
            Reset
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={progress === 0 || submitted}
          className="flex-1 px-2.5 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold transition-colors"
        >
          {submitted ? '✓ Submitted' : 'Submit'}
        </button>
      </div>
    </div>
  );
}
