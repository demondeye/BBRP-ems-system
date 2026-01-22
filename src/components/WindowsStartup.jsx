import { useState, useEffect } from 'react';

export default function WindowsStartup({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Realistic startup time: 60-120 seconds
    const totalDuration = 90000; // 90 seconds (1.5 minutes)
    const updateInterval = 200; // Update every 200ms
    const incrementPerUpdate = (100 / (totalDuration / updateInterval));

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        // Slow down progress towards the end (realistic)
        const slowdownFactor = prev > 80 ? 0.5 : prev > 95 ? 0.3 : 1;
        return Math.min(prev + (incrementPerUpdate * slowdownFactor), 100);
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
      {/* Bluebird Logo */}
      <div className="mb-16">
        <svg width="120" height="120" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bird Silhouette (white outline) */}
          <path d="M100 40 C80 40, 60 50, 50 70 C40 90, 45 110, 50 120 C55 130, 65 135, 75 138 C70 145, 68 155, 70 165 C72 175, 78 183, 85 188 C90 145, 95 145, 100 145 C105 145, 110 145, 115 188 C122 183, 128 175, 130 165 C132 155, 130 145, 125 138 C135 135, 145 130, 150 120 C155 110, 160 90, 150 70 C140 50, 120 40, 100 40 Z" 
                stroke="white" 
                strokeWidth="3" 
                fill="none"/>
          
          {/* Shirt/Collar (light blue) */}
          <path d="M85 160 L90 180 L80 195 L70 200 L60 195 L55 185 L60 175 L70 170 Z" 
                fill="#87CEEB" 
                stroke="white" 
                strokeWidth="2"/>
          <path d="M115 160 L110 180 L120 195 L130 200 L140 195 L145 185 L140 175 L130 170 Z" 
                fill="#87CEEB" 
                stroke="white" 
                strokeWidth="2"/>
          <path d="M85 160 L100 165 L115 160 L115 175 L100 180 L85 175 Z" 
                fill="#87CEEB" 
                stroke="white" 
                strokeWidth="2"/>
        </svg>
      </div>

      {/* Loading Animation */}
      <div className="w-64">
        <div className="flex justify-center space-x-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
