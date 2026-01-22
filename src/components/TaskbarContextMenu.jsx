import { useEffect } from 'react';

export default function TaskbarContextMenu({ x, y, onClose }) {
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
    <>
      <div 
        className="fixed inset-0 z-[200]" 
        onClick={onClose}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div 
        className="fixed z-[201] bg-[#2d2d2d]/98 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl py-2 min-w-[200px]"
        style={{ left: x, top: y }}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <button className="w-full px-4 py-2 hover:bg-white/10 transition-colors text-left flex items-center gap-3 text-white text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
          </svg>
          Task Manager
        </button>

        <div className="h-px bg-white/10 my-2"></div>

        <button className="w-full px-4 py-2 hover:bg-white/10 transition-colors text-left flex items-center gap-3 text-white text-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Taskbar settings
        </button>
      </div>
    </>
  );
}
