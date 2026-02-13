
import { BookOpen } from "lucide-react"

export default function TheorySection({ moduleData }) {
  const title = moduleData?.title || "Theory of Operations"
  const description = moduleData?.description || "A deep dive into fundamental principles"
  const theoryHtml = moduleData?.theoryNotes?.text || "<p>Welcome to this module. Please review the theory notes.</p>"

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-white via-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 md:py-6 sticky top-0 z-10">
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <BookOpen className="w-4 md:w-5 h-4 md:h-5 text-blue-600" />
          <span className="text-xs uppercase tracking-widest font-sans font-bold text-gray-600">
            THEORY
          </span>
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        <p className="text-sm text-gray-600 italic">{description}</p>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="prose prose-neutral max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: theoryHtml }}
          />
        </div>
      </div>

      <style jsx global>{`
        /* Custom scrollbar styling */
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        /* Prose styling for theory content */
        .prose {
          --tw-prose-body: #374151;
          --tw-prose-headings: #111827;
          --tw-prose-lead: #4b5563;
          --tw-prose-links: #2563eb;
          --tw-prose-bold: #111827;
          --tw-prose-counters: #6b7280;
          --tw-prose-bullets: #d1d5db;
          --tw-prose-hr: #e5e7eb;
          --tw-prose-quotes: #4b5563;
          --tw-prose-quote-borders: #e5e7eb;
          --tw-prose-captions: #6b7280;
          --tw-prose-code: #111827;
          --tw-prose-pre-bg: #1f2937;
          --tw-prose-pre-code: #e5e7eb;
          --tw-prose-th-borders: #d1d5db;
          --tw-prose-td-borders: #e5e7eb;
          --tw-prose-kbd: #111827;
          --tw-prose-kbd-bg: #f3f4f6;
        }
        .prose h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        .prose h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.75rem;
          margin-bottom: 0.875rem;
          color: #111827;
        }
        .prose h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }
        .prose p {
          margin-bottom: 1.25rem;
          line-height: 1.75;
        }
        .prose ul, .prose ol {
          margin: 1.25rem 0;
          padding-left: 2rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
        .prose code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.9em;
        }
        .prose pre {
          background-color: #1f2937;
          color: #e5e7eb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.25rem 0;
        }
        .prose a {
          color: #2563eb;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #1d4ed8;
        }
        .prose blockquote {
          border-left: 4px solid #2563eb;
          padding-left: 1rem;
          color: #4b5563;
          font-style: italic;
          margin: 1.25rem 0;
        }
        .prose table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.25rem 0;
        }
        .prose th {
          background-color: #f3f4f6;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #d1d5db;
        }
        .prose td {
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  )
}
