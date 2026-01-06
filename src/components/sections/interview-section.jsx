'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, Zap, Download, Copy, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [copiedId, setCopiedId] = useState(null);

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

  const handleCopyAnswer = (answer) => {
    navigator.clipboard.writeText(answer);
    setCopiedId(answer);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadPDF = async () => {
    try {
      const element = document.getElementById('interview-pdf-content');
      if (!element) {
        alert('Content not found');
        return;
      }

      // Create canvas from HTML element with simplified rendering
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 190; // A4 width in mm with margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      // Add image to PDF with pagination
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight() - 20;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save('interview-preparation.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      // Fallback to simple text-based PDF if canvas fails
      generateSimpleTextPDF();
    }
  };

  const generateSimpleTextPDF = () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      let yPosition = 20;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = 180;

      // Add title
      pdf.setFontSize(18);
      pdf.setFont(undefined, 'bold');
      pdf.text('Interview Preparation', margin, yPosition);
      yPosition += 15;

      // Add questions and answers
      pdf.setFontSize(11);
      questions.forEach((question, idx) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        // Question number and text
        pdf.setFont(undefined, 'bold');
        pdf.setFontSize(12);
        const questionText = `Q${idx + 1}: ${question.question}`;
        const splitQuestion = pdf.splitTextToSize(questionText, maxWidth);
        pdf.text(splitQuestion, margin, yPosition);
        yPosition += splitQuestion.length * 7 + 5;

        // Answer text
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(10);
        const answerText = pdf.splitTextToSize(`Answer: ${question.answer}`, maxWidth);
        pdf.text(answerText, margin, yPosition);
        yPosition += answerText.length * 5 + 10;
      });

      pdf.save('interview-preparation.pdf');
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Unable to generate PDF. Please try again.');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Section - Responsive */}
      <div className="px-3 md:px-8 py-4 md:py-6 border-b border-gray-200 bg-white">
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="p-2 md:p-3 bg-blue-600 rounded-lg md:rounded-xl shrink-0">
                <Lightbulb className="w-4 md:w-6 h-4 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base md:text-2xl font-bold text-gray-900 truncate md:truncate-none">Interview Prep</h2>
                <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1 hidden sm:block">Master these key concepts for your interview</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
              <button
                onClick={downloadPDF}
                className="flex items-center gap-1 md:gap-2 px-2.5 md:px-5 py-1.5 md:py-2.5 bg-blue-600 text-white font-semibold text-xs md:text-base rounded-lg md:rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
                title="Download as PDF"
              >
                <Download className="w-3.5 md:w-4 h-3.5 md:h-4 shrink-0" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive */}
      <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div id="interview-pdf-content" className="px-3 md:px-8 py-4 md:py-8 space-y-3 md:space-y-5 bg-white">
          {questions.map((item, idx) => (
            <div
              key={item.id}
              className="group bg-white rounded-lg md:rounded-xl border border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all duration-300"
            >
              {/* Question Header - Responsive */}
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full text-left px-3 md:px-6 py-3 md:py-5 flex items-start justify-between hover:bg-gray-50 transition-colors gap-2"
              >
                <div className="flex items-start gap-2 md:gap-4 flex-1 min-w-0">
                  <div className="shrink-0 mt-0.5 md:mt-1">
                    <div className="w-6 md:w-8 h-6 md:h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs md:text-sm shrink-0">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-xs md:text-base leading-relaxed break-words">
                      {item.question}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 md:mt-2">Click to reveal</p>
                  </div>
                </div>
                <div className="shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors duration-200 flex-shrink-0">
                  {expandedId === item.id ? (
                    <ChevronUp className="w-4 md:w-5 h-4 md:h-5" />
                  ) : (
                    <ChevronDown className="w-4 md:w-5 h-4 md:h-5" />
                  )}
                </div>
              </button>

              {/* Answer Section - Expanded and Responsive */}
              {expandedId === item.id && (
                <div className="px-3 md:px-6 py-3 md:py-5 border-t border-gray-200 bg-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-3 md:space-y-4">
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Answer:</p>
                      <p className="text-gray-800 leading-relaxed text-xs md:text-sm whitespace-pre-wrap break-words">
                        {item.answer}
                      </p>
                    </div>

                    {/* Copy Button - Responsive */}
                    <button
                      onClick={() => handleCopyAnswer(item.answer)}
                      className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 text-xs md:text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                    >
                      {copiedId === item.answer ? (
                        <>
                          <Check className="w-3 md:w-3.5 h-3 md:h-3.5 shrink-0" />
                          <span className="hidden sm:inline">Copied!</span>
                          <span className="sm:hidden">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 md:w-3.5 h-3 md:h-3.5 shrink-0" />
                          <span className="hidden sm:inline">Copy Answer</span>
                          <span className="sm:hidden">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer - Study Tips - Responsive and Fixed on Mobile */}
      <div className="fixed md:relative bottom-20 md:bottom-0 left-0 right-0 px-3 md:px-8 py-3 md:py-6 bg-white border-t border-gray-200 shrink-0 z-30 md:z-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-lg md:rounded-xl p-3 md:p-5">
          <div className="flex items-center gap-2 md:gap-3 mb-2.5 md:mb-4">
            <div className="p-1.5 md:p-2.5 bg-amber-500 rounded-lg shrink-0">
              <Zap className="w-3.5 md:w-5 h-3.5 md:h-5 text-white" />
            </div>
            <h3 className="font-bold text-amber-900 text-xs md:text-base">Pro Tips</h3>
          </div>
          <ul className="space-y-2 md:space-y-3">
            {[
              'Review each answer carefully',
              'Practice articulating answers aloud',
              'Understand the "why" behind concepts',
              'Prepare real-world examples'
            ].map((tip, idx) => (
              <li key={idx} className="flex gap-2 text-xs md:text-sm text-amber-900">
                <span className="text-amber-600 font-bold shrink-0">✓</span>
                <span className="font-medium break-words">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
