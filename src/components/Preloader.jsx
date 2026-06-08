import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Preloader({ onComplete }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400); // Small exit delay
          return 100;
        }
        return prev + 4; // Progress speed
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ ease: [0.76, 0, 0.24, 1], duration: 1.0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f3f5f8] select-none"
    >
      {/* Grid Desk Background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

      <div className="relative w-full max-w-md px-8 flex flex-col items-center space-y-12 z-10">
        
        {/* Logo Header */}
        <div className="flex items-center space-x-3">
          <img src="/mu.png" alt="MU Logo" className="w-12 h-12 rounded-lg object-contain shadow-md border border-gray-200/50 bg-white" />
          <span className="text-sm font-black tracking-widest uppercase text-neutral-900">MILEAGE UNDO</span>
        </div>

        {/* Lined Roadway with Animating Car */}
        <div className="relative w-full h-28 overflow-hidden border-b-2 border-dashed border-gray-300">
          
          {/* Road guidelines moving left */}
          <motion.div 
            animate={{ x: [0, -40] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 0.45 }}
            className="absolute bottom-0 left-0 right-[-40px] h-1.5 bg-gray-300"
          ></motion.div>

          {/* Car Driving from Left to Right */}
          <motion.div
            animate={{ 
              x: ["-25%", "125%"] 
            }}
            transition={{ 
              repeat: Infinity, 
              ease: "easeInOut", 
              duration: 2.6
            }}
            className="absolute bottom-1 w-32 h-16 flex flex-col items-center justify-end"
          >
            {/* Engine vibration container */}
            <motion.div
              animate={{ y: [0, -1.5, 0] }}
              transition={{ repeat: Infinity, duration: 0.12, ease: "linear" }}
              className="w-full h-full relative flex flex-col items-center justify-end"
            >
              {/* Clean Modern SUV Design */}
              <svg viewBox="0 0 100 40" className="w-28 h-10 text-neutral-955 fill-current">
                {/* Boxy SUV frame */}
                <path d="M 8 28 L 8 14 C 8 12, 10 11, 12 11 L 60 11 C 62 11, 63 11.5, 64.5 13.5 L 72 21 L 90 21 C 92.5 21, 94 22, 94 24 L 94 28 C 94 29.5, 92.5 30, 90 30 L 83 30 A 7 7 0 0 0 69 30 L 33 30 A 7 7 0 0 0 19 30 L 12 30 C 9 30, 8 29.5, 8 28 Z" />
                {/* Windows */}
                <path d="M 14 13.5 L 34 13.5 L 34 19 L 14 19 Z" fill="#f3f5f8" />
                <path d="M 37.5 13.5 L 58 13.5 L 58 19 L 37.5 19 Z" fill="#f3f5f8" />
                <path d="M 61 13.5 L 70 13.5 L 75 19 L 61 19 Z" fill="#f3f5f8" />
                {/* Glowing details */}
                <circle cx="89.5" cy="24.5" r="1.2" fill="#facc15" />
                <rect x="8" y="16" width="1.2" height="4" rx="0.5" fill="#ef4444" />
              </svg>

              {/* Spin-wheel overlays */}
              <div className="absolute bottom-[-2.5px] left-[22px] right-[22px] flex justify-between">
                {/* Rear wheel */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 0.25 }}
                  className="w-5 h-5 rounded-full border-2 border-neutral-900 bg-white flex items-center justify-center shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-neutral-900"></div>
                </motion.div>
                
                {/* Front wheel */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 0.25 }}
                  className="w-5 h-5 rounded-full border-2 border-neutral-900 bg-white flex items-center justify-center shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-neutral-900"></div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

        </div>

        {/* Progress bar and statistics text */}
        <div className="w-full space-y-2 text-center font-mono">
          <div className="flex justify-between items-center text-xs font-bold text-gray-500 tracking-wider">
            <span>Auditing Registry</span>
            <span>{percent}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-250 rounded-full overflow-hidden border border-gray-150">
            <div 
              className="h-full bg-neutral-950 transition-all duration-100 rounded-full" 
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
