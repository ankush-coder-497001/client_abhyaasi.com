'use client';

import { useState, useRef, useEffect } from 'react';
import { Code2, Play, Copy, Check } from 'lucide-react';

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

export default function CodingSection({ moduleData }) {
  // Get template code from server's templateFiles array
  const templateFile = moduleData?.codingTask?.templateFiles?.find(file => file.path.includes("main"));
  const templateCode = templateFile ? templateFile.content : DEFAULT_PROBLEM.templateCode;
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
  const containerRef = useRef(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div ref={containerRef} className="h-full w-full flex overflow-hidden bg-white">

      <div className="overflow-y-auto border-r border-gray-200" style={{ width: `${dividerPos}%` }}>
        <div className="p-2.5 space-y-2">
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
        {/* Editor Header with Run Button */}
        <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-2.5 py-1.5">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Solution.jsx</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleRun}
              className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Play className="w-2.5 h-2.5" />
              Run
            </button>
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
          </div>
        </div>

        {/* Code Editor - Full height */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-gray-900 text-gray-100 p-2.5 font-mono text-xs focus:outline-none resize-none"
          spellCheck="false"
        />

        {/* Output Section */}
        {testResults && (
          <div className="bg-gray-50 border-t border-gray-200 p-2 max-h-16 overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Output</p>
              <p className="text-xs font-bold text-blue-600">
                {testResults.passed}/{testResults.total} Passed
              </p>
            </div>
            <div className="space-y-0.5">
              {testResults.details.map((detail) => (
                <div key={detail.id} className="text-xs flex items-center gap-1.5 text-gray-700">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-blue-600"></div>
                  <span>{detail.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
