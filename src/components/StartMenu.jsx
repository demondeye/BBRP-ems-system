import { useEffect } from 'react';

export default function StartMenu({ user, onClose, onLogout, onShutdown, onOpenApp, onOpenUserMenu, onOpenPowerMenu }) {
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

  const pinnedApps = [
    { name: 'VicPol Paperwork', icon: '📋', color: 'bg-blue-500', action: () => onOpenApp('vicpol') },
    { name: 'Edge', icon: '🌐', color: 'bg-blue-600' },
    { name: 'Word', icon: '📄', color: 'bg-blue-700' },
    { name: 'Excel', icon: '📊', color: 'bg-green-600' },
    { name: 'PowerPoint', icon: '📽️', color: 'bg-red-600' },
    { name: 'Microsoft Store', icon: '🪟', color: 'bg-blue-500' },
    { name: 'Photos', icon: '🖼️', color: 'bg-blue-400' },
    { name: 'Settings', icon: '⚙️', color: 'bg-gray-600' },
    { name: 'Adobe Express', icon: '🎨', color: 'bg-purple-600' },
    { name: 'Xbox', icon: '🎮', color: 'bg-green-500' },
    { name: 'Prime Video', icon: '📺', color: 'bg-blue-800' },
    { name: 'TikTok', icon: '🎵', color: 'bg-black' },
    { name: 'Instagram', icon: '📷', color: 'bg-pink-500' },
    { name: 'Facebook', icon: '👥', color: 'bg-blue-600' },
    { name: 'OneNote', icon: '📓', color: 'bg-purple-700' },
    { name: 'Calculator', icon: '🔢', color: 'bg-gray-700' },
    { name: 'Clock', icon: '🕐', color: 'bg-gray-600' },
    { name: 'Notepad', icon: '📝', color: 'bg-blue-300' }
  ];

  const recentDocs = [
    { name: 'Snipping Tool', subtitle: 'Frequently used app', icon: '✂️' },
    { name: 'vicpol-react (5).zip', subtitle: '4h ago', icon: '📦' },
    { name: 'vicpol-react (3).zip', subtitle: '5h ago', icon: '📦' },
    { name: 'vicpol-react (1).zip', subtitle: '6h ago', icon: '📦' }
  ];

  return (
    <div 
      className="absolute bottom-14 left-2 w-[600px] bg-[#232323]/98 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden z-[999]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with Microsoft and Sign out */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 23 23" fill="none">
            <rect width="11" height="11" fill="#f25022"/>
            <rect x="12" width="11" height="11" fill="#7fba00"/>
            <rect y="12" width="11" height="11" fill="#00a4ef"/>
            <rect x="12" y="12" width="11" height="11" fill="#ffb900"/>
          </svg>
          <span className="text-white font-semibold text-sm">Microsoft</span>
        </div>
        <button 
          onClick={onLogout}
          className="text-white hover:text-white/70 text-sm font-medium transition-colors"
        >
          Sign out
        </button>
      </div>
      {/* Search Box */}
      <div className="p-6 pb-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for apps, settings, and documents"
            className="w-full bg-[#3a3a3a] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-white/40 outline-none focus:border-white/20"
            autoFocus
          />
        </div>
      </div>

      {/* Pinned Section */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-white text-sm font-semibold">Pinned</div>
          <button className="text-white/60 hover:text-white text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5">
            All
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-6 gap-3">
          {pinnedApps.map((app, idx) => (
            <button
              key={idx}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/5 transition-all group"
              onClick={() => {
                if (app.action) {
                  app.action();
                  onClose();
                }
              }}
            >
              <div className={`w-10 h-10 ${app.color} rounded-lg flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-lg`}>
                {app.icon}
              </div>
              <div className="text-white text-[10px] text-center leading-tight line-clamp-2 w-full">
                {app.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Section */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white text-sm font-semibold">Recommended</div>
          <button className="text-white/60 hover:text-white text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5">
            More
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {recentDocs.map((doc, idx) => (
            <button
              key={idx}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
            >
              <div className="text-2xl">{doc.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-medium truncate">{doc.name}</div>
                <div className="text-white/40 text-[10px] truncate">{doc.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer with User and Power */}
      <div className="bg-[#2d2d2d] border-t border-white/10 p-3 flex items-center justify-between">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenUserMenu) onOpenUserMenu();
            // Toggle functionality handled in Desktop
          }}
          className="flex items-center gap-3 flex-1 hover:bg-white/5 rounded-lg p-2 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
            {user.fullName.charAt(0)}
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{user.fullName}</div>
          </div>
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onOpenPowerMenu();
          }}
          className="w-9 h-9 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
          title="Power options"
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v5a1 1 0 11-2 0V3a1 1 0 011-1zm6.364 1.636a1 1 0 010 1.414l-3.536 3.536a1 1 0 01-1.414-1.414l3.536-3.536a1 1 0 011.414 0zm-11.728 0a1 1 0 011.414 0l3.536 3.536a1 1 0 01-1.414 1.414L4.636 5.05a1 1 0 010-1.414zM10 11a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
