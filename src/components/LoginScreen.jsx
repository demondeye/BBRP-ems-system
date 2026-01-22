import { useEffect, useState } from 'react';

export default function LoginScreen({ userName }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex flex-col items-center justify-center z-[9999]">
      {/* Windows 10 Style Login Screen */}
      <div className="text-center">
        {/* User Icon Circle - Frosted glass effect */}
        <div className="mb-6 flex justify-center">
          <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl">
            {/* User icon SVG */}
            <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>

        {/* Username */}
        <div className="text-white text-4xl font-light mb-4 tracking-wide">
          {userName || 'User'}
        </div>

        {/* Welcome Text with Loading Dots */}
        <div className="text-white/90 text-xl font-light tracking-wide">
          Welcome{dots}
        </div>

        {/* Spinning Loader */}
        <div className="mt-12 flex justify-center">
          <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
