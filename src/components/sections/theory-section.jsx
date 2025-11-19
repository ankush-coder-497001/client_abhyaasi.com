import { BookOpen, FileText, ArrowRight } from 'lucide-react';

export default function TheorySection() {
  return (
    <div className="p-2.5 space-y-1 h-full flex flex-col">
      <div className="space-y-0.5 flex-shrink-0">
        <div className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <h2 className="text-xs font-bold text-black">Understanding React</h2>
        </div>
        <p className="text-gray-600 text-xs font-medium">Core concepts and principles</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-0.5">
        {[
          {
            title: 'What is React?',
            content: 'React is a JavaScript library for building user interfaces with reusable components. It uses a declarative approach to describe what the UI should look like.'
          },
          {
            title: 'Components & Props',
            content: 'Components are the building blocks of React applications. Props allow you to pass data from parent to child components in a unidirectional manner.',
            code: '<Component prop="value" />'
          },
          {
            title: 'State & Lifecycle',
            content: 'State is data that can change over time. React provides hooks like useState and useEffect to manage state and side effects in functional components.'
          },
          {
            title: 'Virtual DOM',
            content: 'React uses a virtual representation of the DOM to optimize re-renders. Changes are batched and applied efficiently to the actual DOM.'
          }
        ].map((section, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded p-1.5 hover:border-blue-300 hover:shadow-sm transition-all">
            <div className="flex items-start gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                {idx + 1}
              </div>
              <div className="flex-1 space-y-0.5">
                <h3 className="text-xs font-bold text-black">{section.title}</h3>
                <p className="text-gray-700 text-xs leading-relaxed">{section.content}</p>
                {section.code && (
                  <div className="bg-gray-900 rounded p-1 text-xs text-gray-100 font-mono overflow-x-auto">
                    {section.code}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded p-1.5 flex-shrink-0">
        <div className="flex items-center gap-1 mb-1">
          <FileText className="w-3 h-3 text-blue-600" />
          <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider">Key Takeaways</h4>
        </div>
        <ul className="space-y-0.5">
          {[
            'React simplifies UI development through component reusability',
            'Props and State are fundamental to data management',
            'Virtual DOM ensures efficient rendering'
          ].map((point, idx) => (
            <li key={idx} className="flex gap-1 text-xs text-blue-900">
              <ArrowRight className="w-2.5 h-2.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span className="font-medium text-xs">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
