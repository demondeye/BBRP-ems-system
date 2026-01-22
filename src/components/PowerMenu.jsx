import { useEffect } from 'react';

export default function PowerMenu({ onClose, onShutdown, onRestart }) {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="absolute bottom-[133px] left-[384px] w-56 bg-[#2d2d2d]/98 backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden py-2 z-[9999]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        disabled
        className="w-full px-4 py-3 hover:bg-white/5 transition-colors text-left flex items-center gap-3 opacity-50 cursor-not-allowed"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span className="text-white text-sm">Lock</span>
      </button>

      <button
        disabled
        className="w-full px-4 py-3 hover:bg-white/5 transition-colors text-left flex items-center gap-3 opacity-50 cursor-not-allowed"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
        <span className="text-white text-sm">Sleep</span>
      </button>

      <button
        onClick={() => {
          onShutdown();
          onClose();
        }}
        className="w-full px-4 py-3 hover:bg-white/5 transition-colors text-left flex items-center gap-3"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v5a1 1 0 11-2 0V3a1 1 0 011-1zm6.364 1.636a1 1 0 010 1.414l-3.536 3.536a1 1 0 01-1.414-1.414l3.536-3.536a1 1 0 011.414 0zm-11.728 0a1 1 0 011.414 0l3.536 3.536a1 1 0 01-1.414 1.414L4.636 5.05a1 1 0 010-1.414zM10 11a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
        </svg>
        <span className="text-white text-sm">Shut down</span>
      </button>

      <button
        onClick={() => {
          onRestart();
          onClose();
        }}
        className="w-full px-4 py-3 hover:bg-white/5 transition-colors text-left flex items-center gap-3"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        <span className="text-white text-sm">Restart</span>
      </button>
    </div>
  );
}
