import { useEffect } from 'react';

export default function UserMenu({ user, onClose, onOpenSettings, onLogout }) {
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
      className="absolute bottom-[calc(3.5rem+56px)] left-2 w-[320px] bg-[#2d2d2d]/98 backdrop-blur-xl border border-white/20 shadow-2xl rounded-lg overflow-hidden z-[9999]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with Sign out */}
      <div className="bg-[#1a1a1a] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
            <rect width="11" height="11" fill="#f25022"/>
            <rect x="12" width="11" height="11" fill="#7fba00"/>
            <rect y="12" width="11" height="11" fill="#00a4ef"/>
            <rect x="12" y="12" width="11" height="11" fill="#ffb900"/>
          </svg>
          <span className="text-white text-sm font-medium">Microsoft</span>
        </div>
        <button 
          onClick={onLogout}
          className="text-white/70 hover:text-white text-sm font-medium"
        >
          Sign out
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
            {user.fullName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold truncate">{user.fullName}</div>
            <div className="text-white/60 text-sm truncate">{user.email}</div>
            <div className="text-blue-400 text-xs mt-0.5">My Microsoft account</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={() => {
            onOpenSettings();
            onClose();
          }}
          className="w-full px-4 py-3 hover:bg-white/5 transition-colors text-left flex items-center gap-3"
        >
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">Microsoft 365 Family</div>
            <div className="text-white/50 text-xs">View benefits</div>
          </div>
        </button>

        <button
          onClick={() => {
            onOpenSettings();
            onClose();
          }}
          className="w-full px-4 py-3 hover:bg-white/5 transition-colors text-left flex items-center gap-3"
        >
          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
          </svg>
          <div className="flex-1">
            <div className="text-white text-sm font-medium">Cloud Storage</div>
            <div className="text-white/50 text-xs">Unable to load</div>
          </div>
        </button>
      </div>
    </div>
  );
}
