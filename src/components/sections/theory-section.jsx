import { BookOpen, FileText, ArrowRight } from 'lucide-react';

export default function TheorySection({ moduleData }) {
  // Use module data if available, otherwise use defaults
  const title = moduleData?.title || 'Understanding React';
  const description = moduleData?.description || 'Core concepts and principles';

  // Theory notes is HTML from server
  const theoryHtml = moduleData?.theoryNotes?.text;

  // Fallback content if no theory notes
  const fallbackContent = [
    {
      title: 'Getting Started',
      content: 'Begin your learning journey with the fundamentals.'
    },
    {
      title: 'Core Concepts',
      content: 'Understand the key principles and ideas behind this module.'
    }
  ];

  return (
    <div className="p-2.5 space-y-1 h-full flex flex-col">
      <div className="space-y-0.5 shrink-0">
        <div className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <h2 className="text-xs font-bold text-black">{title}</h2>
        </div>
        <p className="text-gray-600 text-xs font-medium">{description}</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {theoryHtml ? (
          <div className="bg-white border border-gray-200 rounded p-2 text-xs prose prose-sm prose-h1:text-sm prose-h1:font-bold prose-h2:text-xs prose-h2:font-bold prose-p:text-xs prose-p:text-gray-700 prose-li:text-xs prose-li:text-gray-700 prose-ul:my-1 prose-ol:my-1 prose-pre:text-xs prose-code:text-xs prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded max-w-none">
            <div dangerouslySetInnerHTML={{ __html: theoryHtml }} className="space-y-2" />
          </div>
        ) : (
          <div className="space-y-0.5">
            {fallbackContent.map((section, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded p-1.5 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-start gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h3 className="text-xs font-bold text-black">{section.title}</h3>
                    <p className="text-gray-700 text-xs leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-1.5 shrink-0">
        <div className="flex items-center gap-1 mb-1">
          <FileText className="w-3 h-3 text-blue-600" />
          <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider">Key Takeaways</h4>
        </div>
        <ul className="space-y-0.5">
          {[
            'Master the fundamental concepts of this module',
            'Practice with real-world examples',
            'Review and reinforce your understanding'
          ].map((point, idx) => (
            <li key={idx} className="flex gap-1 text-xs text-blue-900">
              <ArrowRight className="w-2.5 h-2.5 text-blue-600 shrink-0 mt-0.5" />
              <span className="font-medium text-xs">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
