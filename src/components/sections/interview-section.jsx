'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, Zap } from 'lucide-react';

const DEFAULT_QUESTIONS = [
  {
    id: 1,
    question: 'Explain the concept of "lifting state up" in React',
    answer: 'Lifting state up is a pattern where you move state from a child component to its parent. This is necessary when multiple sibling components need to share the same state. By moving state to the parent, both siblings can receive the same data as props and trigger updates through callbacks.'
  },
  {
    id: 2,
    question: 'What are React Fragments and when would you use them?',
    answer: 'React Fragments allow you to group multiple elements without adding an extra DOM node. They are useful when a component returns a list of elements and you don\'t want to wrap them in a div. You can use <> </> as shorthand or <React.Fragment> </React.Fragment>.'
  },
];

export default function InterviewSection({ moduleData }) {
  const [expandedId, setExpandedId] = useState(null);

  // Use module interview questions if available, otherwise use defaults
  // Map server interview structure (interviewQuestions array) to expected format
  const questions = moduleData?.interviewQuestions?.map((item, idx) => ({
    id: item._id || idx,
    question: item.question,
    answer: item.suggestedAnswer
  })) || DEFAULT_QUESTIONS;

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-2.5 space-y-1 h-full flex flex-col">
      <div className="space-y-0.5 shrink-0">
        <div className="flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
          <h2 className="text-xs font-bold text-black">Interview Preparation</h2>
        </div>
        <p className="text-gray-600 text-xs font-medium">
          Common questions with answers
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-0.5">
        {questions.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded overflow-hidden hover:border-blue-300 hover:shadow-sm transition-all"
          >
            {/* Question Header */}
            <button
              onClick={() => toggleExpanded(item.id)}
              className="w-full text-left px-1.5 py-1 flex items-center justify-between hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-start gap-1 flex-1 min-w-0">
                <div className="shrink-0 mt-0.5">
                  <div className="w-3 h-3 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold group-hover:bg-blue-200 transition-colors">
                    {idx + 1}
                  </div>
                </div>
                <p className="text-gray-800 font-semibold text-xs leading-snug line-clamp-2">
                  {item.question}
                </p>
              </div>
              <div className="shrink-0 ml-1 text-gray-400 group-hover:text-gray-600">
                {expandedId === item.id ? (
                  <ChevronUp className="w-2.5 h-2.5" />
                ) : (
                  <ChevronDown className="w-2.5 h-2.5" />
                )}
              </div>
            </button>

            {expandedId === item.id && (
              <div className="px-1.5 py-1 border-t border-gray-200 bg-gray-50">
                <p className="text-gray-700 text-xs leading-relaxed">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-1.5 shrink-0">
        <div className="flex items-center gap-1 mb-1">
          <Zap className="w-3 h-3 text-blue-600" />
          <h3 className="font-bold text-blue-900 text-xs uppercase tracking-wider">Study Tips</h3>
        </div>
        <ul className="space-y-0.5">
          {[
            'Answer without looking at answers first',
            'Practice explaining answers out loud',
            'Focus on understanding, not memorizing'
          ].map((tip, idx) => (
            <li key={idx} className="flex gap-1 text-xs text-blue-900">
              <span className="text-blue-600 font-bold shrink-0">•</span>
              <span className="font-medium text-xs">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
