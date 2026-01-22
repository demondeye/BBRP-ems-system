import { useState } from 'react';

export default function Window({ title, icon, onClose, onMinimize, onMaximize, children, defaultWidth = 1200, defaultHeight = 800, startMaximized = false }) {
  const [isMaximized, setIsMaximized] = useState(startMaximized);
  const [position, setPosition] = useState({ x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (onMaximize) onMaximize(!isMaximized);
  };

  const handleMouseDown = (e) => {
    if (isMaximized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging && !isMaximized) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const windowStyle = isMaximized
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: '48px',
        width: '100%',
        height: 'calc(100vh - 48px)'
      }
    : {
        position: 'fixed',
        top: position.y,
        left: position.x,
        width: defaultWidth,
        height: defaultHeight
      };

  return (
    <>
      {isDragging && (
        <div
          className="fixed inset-0 z-40"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      )}
      
      <div
        className="z-50 bg-[#1a1a1a] border border-white/20 shadow-2xl flex flex-col overflow-hidden"
        style={windowStyle}
      >
        {/* Title Bar */}
        <div
          className="h-8 bg-[#2d2d2d] border-b border-white/10 flex items-center justify-between px-2 cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <span className="text-white text-sm font-medium">{title}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Minimize */}
            <button
              className="w-11 h-full hover:bg-white/10 transition-colors flex items-center justify-center"
              onClick={onMinimize}
            >
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                <rect y="5" width="12" height="2"/>
              </svg>
            </button>
            
            {/* Maximize/Restore */}
            <button
              className="w-11 h-full hover:bg-white/10 transition-colors flex items-center justify-center"
              onClick={handleMaximize}
            >
              {isMaximized ? (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M3 3h6v6H3V3zm1 1v4h4V4H4z"/>
                </svg>
              ) : (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M2 2h8v8H2V2zm1 1v6h6V3H3z"/>
                </svg>
              )}
            </button>
            
            {/* Close */}
            <button
              className="w-11 h-full hover:bg-red-600 transition-colors flex items-center justify-center"
              onClick={onClose}
            >
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                <path d="M10.707 1.293a1 1 0 00-1.414 0L6 4.586 2.707 1.293a1 1 0 00-1.414 1.414L4.586 6 1.293 9.293a1 1 0 101.414 1.414L6 7.414l3.293 3.293a1 1 0 001.414-1.414L7.414 6l3.293-3.293a1 1 0 000-1.414z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-auto bg-bg">
          {children}
        </div>
      </div>
    </>
  );
}
