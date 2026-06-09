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
              {/* Sleek Sports Car Design (matching user silhouette image) */}
              <svg viewBox="0 0 100 40" className="w-28 h-10 text-neutral-950 fill-current">
                <path d="M 8 29 L 8 22.5 L 6 22.5 L 3 17 L 1 17 L 1 15.5 L 11 15.5 L 10 17 L 8 17 L 8 22.5 C 14 22, 20 20.5, 26 19.5 C 36 15, 46 13, 56 13 C 64 13, 72 17, 78 21.5 C 84 23.5, 90 24.5, 96 24.5 C 98.5 24.5, 99.5 25.5, 99.5 27.5 L 99 29 L 83 29 A 7 7 0 0 0 69 29 L 33 29 A 7 7 0 0 0 19 29 L 8 29 Z" />
                {/* Windows */}
                <path d="M 33 21 C 41 16.5, 48 15.5, 54 15.5 C 59 15.5, 65 17, 69 21 Z" fill="#f3f5f8" />
                <path d="M 51 15.5 L 53 15.5 L 53 21 L 51 21 Z" fill="currentColor" />
              </svg>

              {/* Spin-wheel overlays positioned precisely under SVG wheel wells */}
              <div className="absolute inset-x-0 bottom-[-2.5px] h-5 pointer-events-none">
                {/* Rear wheel */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 0.25 }}
                  className="absolute left-[27px] w-5 h-5 rounded-full bg-neutral-950 flex items-center justify-center shadow-sm"
                >
                  {/* Thin white rim line */}
                  <div className="w-3.5 h-3.5 rounded-full border-1.5 border-white bg-neutral-950 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white/40"></div>
                  </div>
                </motion.div>
                
                {/* Front wheel */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 0.25 }}
                  className="absolute right-[25px] w-5 h-5 rounded-full bg-neutral-950 flex items-center justify-center shadow-sm"
                >
                  {/* Thin white rim line */}
                  <div className="w-3.5 h-3.5 rounded-full border-1.5 border-white bg-neutral-950 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white/40"></div>
                  </div>
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
