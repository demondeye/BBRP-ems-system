import { useState } from 'react';

export default function Accordion({ title, defaultOpen = false, children, badge }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-black/[0.18]">
      <button
        className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold">{title}</h2>
          {badge && (
            <span className="px-2 py-1 rounded-full bg-ok/20 text-ok text-xs font-black">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-3.5 pt-0 border-t border-border/50">
          {children}
        </div>
      )}
    </div>
  );
}
