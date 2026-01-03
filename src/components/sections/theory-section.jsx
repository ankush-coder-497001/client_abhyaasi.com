
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
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8 font-serif selection:bg-[#D4CFC7] selection:text-black z-10 overflow-hidden">
      {/* Book Container with 3D Depth */}
      <div className="relative w-full max-w-4xl h-[500px] sm:h-[550px] md:h-[600px] bg-[#FDFCFB] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3),0_30px_60px_-30px_rgba(0,0,0,0.3),inset_0_-2px_5px_rgba(0,0,0,0.1)] rounded-sm flex overflow-hidden border border-[#D1CEC7]">
        {/* Central Spine shadow */}
        <div className="absolute left-1/2 top-0 bottom-0 w-16 -ml-8 bg-gradient-to-r from-transparent via-black/15 to-transparent z-10 pointer-events-none" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-black/5 z-20 pointer-events-none" />

        {/* Left Page */}
        <div className="flex-1 flex flex-col border-r border-[#E5E2DB] relative bg-[#FDFCFB] min-h-0">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

          <header className="p-6 sm:p-8 pb-4 shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-4 h-4 text-[#8B8476]" />
              <span className="text-xs uppercase tracking-[0.3em] font-sans font-bold text-[#8B8476]">
                THEORY
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-medium tracking-tight leading-tight text-[#2C2A26] line-clamp-2">
              {title}
            </h1>
            <div className="h-px w-16 bg-[#D1CEC7] mt-3" />
          </header>

          <main className="flex-1 px-6 sm:px-8 pb-4 pt-0 overflow-hidden prose prose-neutral prose-sm max-w-none min-h-0">
            <div
              className="text-[#5C5850] leading-relaxed text-sm text-justify space-y-2"
              dangerouslySetInnerHTML={{ __html: pages[currentPage].left.content }}
            />
          </main>

          <footer className="p-4 text-xs font-sans font-bold tracking-widest uppercase text-[#8B8476] flex justify-between items-center border-t border-[#F3F1ED] shrink-0">
            <span>THEORY</span>
            <span className="italic text-[11px]">{currentPage * 2 + 1}</span>
          </footer>
        </div>

        {/* Right Page */}
        <div className="flex-1 flex flex-col relative bg-[#FDFCFB] min-h-0">
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
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
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose p {
          margin-bottom: 1.5rem;
          text-align: justify;
        }
      `}</style>
    </div>
  )
}
