export default function ShutdownScreen({ onPowerOn }) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <button
        onClick={onPowerOn}
        className="group"
        title="Press to power on"
      >
        <svg 
          className="w-24 h-24 text-white/30 group-hover:text-white/60 transition-colors cursor-pointer" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v5a1 1 0 11-2 0V3a1 1 0 011-1zm6.364 1.636a1 1 0 010 1.414l-3.536 3.536a1 1 0 01-1.414-1.414l3.536-3.536a1 1 0 011.414 0zm-11.728 0a1 1 0 011.414 0l3.536 3.536a1 1 0 01-1.414 1.414L4.636 5.05a1 1 0 010-1.414zM10 11a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
