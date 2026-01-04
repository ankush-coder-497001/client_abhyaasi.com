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
      {/* Header Section */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Interview Preparation</h2>
                <p className="text-sm text-gray-600 mt-1">Master these key concepts for your interview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
                title="Download as PDF"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>


        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div id="interview-pdf-content" className="px-8 py-8 space-y-5 bg-white">
          {questions.map((item, idx) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all duration-300"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full text-left px-6 py-5 flex items-start justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-base leading-relaxed">
                      {item.question}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Click to reveal answer</p>
                  </div>
                </div>
                <div className="shrink-0 ml-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200">
                  {expandedId === item.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              {/* Answer Section - Expanded */}
              {expandedId === item.id && (
                <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Answer:</p>
                      <p className="text-gray-800 leading-relaxed text-sm whitespace-pre-wrap">
                        {item.answer}
                      </p>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyAnswer(item.answer)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                    >
                      {copiedId === item.answer ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Answer
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

      {/* Footer - Study Tips */}
      <div className="px-8 py-6 bg-white border-t border-gray-200 shrink-0">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-amber-500 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-amber-900 text-base">Pro Tips for Success</h3>
          </div>
          <ul className="space-y-3">
            {[
              'Review each answer carefully before the interview',
              'Practice articulating your answers out loud',
              'Understand the "why" behind each concept, not just the "what"',
              'Prepare real-world examples to support your answers'
            ].map((tip, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-amber-900">
                <span className="text-amber-600 font-bold shrink-0 mt-0.5">✓</span>
                <span className="font-medium">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
