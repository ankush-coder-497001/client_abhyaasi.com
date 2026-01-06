
import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react"

export default function TheorySection({ moduleData }) {
  const [currentPage, setCurrentPage] = useState(0)

  const title = moduleData?.title || "Theory of Operations"
  const description = moduleData?.description || "A deep dive into fundamental principles"
  const theoryHtml = moduleData?.theoryNotes?.text

  // In a real app, this might be more sophisticated, but here we'll split by common HTML tags
  const pages = useMemo(() => {
    if (!theoryHtml) {
      return [
        {
          left: { title: "Introduction", content: "Welcome to this module. Please review the theory notes." },
          right: { title: "Getting Started", content: "Begin your learning journey with the fundamentals." },
        },
      ]
    }

    // Simple heuristic to split HTML content for pagination
    // We'll split by h2 or strong tags to create logical page breaks
    const sections = theoryHtml.split(/<h[12][^>]*>/i).filter(Boolean)
    const chunks = []

    for (let i = 0; i < sections.length; i += 2) {
      chunks.push({
        left: {
          title: `Section ${i + 1}`,
          content: sections[i],
        },
        right: {
          title: sections[i + 1] ? `Section ${i + 2}` : "Conclusion",
          content: sections[i + 1] || "End of theory notes.",
        },
      })
    }
    return chunks
  }, [theoryHtml])

  const totalPages = pages.length

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 font-serif selection:bg-[#D4CFC7] selection:text-black z-10 overflow-hidden">
      {/* Book Container - Responsive */}
      <div className="relative w-full max-w-2xl md:max-w-4xl h-auto md:h-[500px] sm:h-[550px] lg:h-[600px] bg-[#FDFCFB] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3),0_10px_30px_-30px_rgba(0,0,0,0.3),inset_0_-2px_5px_rgba(0,0,0,0.1)] rounded-sm flex flex-col md:flex-row overflow-hidden border border-[#D1CEC7]">
        {/* Central Spine shadow - Hidden on mobile */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-16 -ml-8 bg-gradient-to-r from-transparent via-black/15 to-transparent z-10 pointer-events-none" />
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/5 z-20 pointer-events-none" />

        {/* Left Page - Mobile: Full Width, Desktop: Half */}
        <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-[#E5E2DB] relative bg-[#FDFCFB] min-h-0">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

          <header className="p-3 sm:p-4 md:p-8 pb-2 md:pb-4 shrink-0">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <BookOpen className="w-3.5 md:w-4 h-3.5 md:h-4 text-[#8B8476]" />
              <span className="text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-sans font-bold text-[#8B8476] text-xs md:text-xs">
                THEORY
              </span>
            </div>
            <h1 className="text-base sm:text-lg md:text-2xl font-medium tracking-tight leading-tight text-[#2C2A26] line-clamp-2">
              {title}
            </h1>
            <div className="h-px w-12 md:w-16 bg-[#D1CEC7] mt-2 md:mt-3" />
          </header>

          <main className="flex-1 px-3 sm:px-4 md:px-8 pb-2 md:pb-4 pt-0 overflow-y-auto prose prose-neutral prose-sm max-w-none min-h-0 custom-scrollbar">
            <div
              className="text-[#5C5850] leading-relaxed text-xs sm:text-sm md:text-sm text-justify space-y-1.5 md:space-y-2"
              dangerouslySetInnerHTML={{ __html: pages[currentPage].left.content }}
            />
          </main>

          <footer className="p-2 md:p-4 text-xs font-sans font-bold tracking-widest uppercase text-[#8B8476] flex justify-between items-center border-t border-[#F3F1ED] shrink-0">
            <span className="hidden sm:inline">THEORY</span>
            <span className="italic text-[10px] md:text-[11px]">{currentPage * 2 + 1}</span>
          </footer>
        </div>

        {/* Right Page - Hidden on Mobile, Visible on Desktop */}
        <div className="hidden md:flex flex-1 flex-col relative bg-[#FDFCFB] min-h-0">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

          <header className="p-6 sm:p-8 pb-4 shrink-0">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.3em] font-sans font-bold text-[#8B8476]">
                NOTES
              </span>
              <p className="text-xs font-sans text-[#A39E93] italic line-clamp-2">{description}</p>
            </div>
          </header>

          <main className="flex-1 px-6 sm:px-8 pb-4 pt-0 overflow-hidden prose prose-neutral prose-sm max-w-none min-h-0">
            <div
              className="text-[#5C5850] leading-relaxed text-sm text-justify space-y-2"
              dangerouslySetInnerHTML={{ __html: pages[currentPage].right.content }}
            />
          </main>

          <footer className="p-4 flex items-center justify-between border-t border-[#F3F1ED] shrink-0">
            <div className="flex gap-4">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className={`p-2 rounded-full transition-all group ${currentPage === 0
                  ? 'opacity-30 cursor-not-allowed text-[#D1CEC7]'
                  : 'hover:bg-[#F3F1ED] text-[#8B8476] hover:text-[#2C2A26] cursor-pointer'
                  }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className={`p-2 rounded-full transition-all group ${currentPage === totalPages - 1
                  ? 'opacity-30 cursor-not-allowed text-[#D1CEC7]'
                  : 'hover:bg-[#F3F1ED] text-[#8B8476] hover:text-[#2C2A26] cursor-pointer'
                  }`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs font-sans font-bold tracking-widest uppercase text-[#8B8476]">
              <span className="italic text-[11px]">{currentPage * 2 + 2}</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Navigation - Bottom Buttons */}
      <div className="fixed bottom-20 md:bottom-0 left-0 right-0 md:hidden bg-gradient-to-t from-white via-white to-transparent p-3 flex gap-2 justify-center z-30">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded-lg transition-all font-semibold text-sm ${currentPage === 0
            ? 'opacity-40 cursor-not-allowed bg-gray-200 text-gray-500'
            : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          aria-label="Previous page"
        >
          ← Previous
        </button>
        <div className="flex items-center px-3 py-2 bg-gray-100 rounded-lg text-xs font-semibold text-gray-700">
          Page {currentPage + 1} / {totalPages}
        </div>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className={`px-4 py-2 rounded-lg transition-all font-semibold text-sm ${currentPage === totalPages - 1
            ? 'opacity-40 cursor-not-allowed bg-gray-200 text-gray-500'
            : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          aria-label="Next page"
        >
          Next →
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E2DB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1CEC7;
        }
        /* Custom typography styling for internal HTML */
        .prose h1, .prose h2, .prose h3 {
          color: #2C2A26;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .prose p {
          margin-bottom: 1rem;
          text-align: justify;
        }
      `}</style>
    </div>
  )
}
