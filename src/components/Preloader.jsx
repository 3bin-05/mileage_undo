import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Gear({ pitchRadius, teeth, rotateValue, duration, colorClass, initialRotate = 0 }) {
  const wb = 8.5; // base width
  const wt = 5.2; // tip width
  const h = 7.5;  // tooth height
  const points = `-${wb/2},-${pitchRadius} -${wt/2},-${pitchRadius + h} ${wt/2},-${pitchRadius + h} ${wb/2},-${pitchRadius}`;

  // Rings
  const outerRingRadius = pitchRadius - 4;
  const outerRingStrokeWidth = 8;
  const hubRadius = pitchRadius * 0.28;
  const hubStrokeWidth = hubRadius * 0.5;

  // Spokes - calculate position to fit nicely between hub and outer ring
  const spokeStart = hubRadius + hubStrokeWidth / 2;
  const spokeEnd = outerRingRadius - 4;

  return (
    <motion.g
      initial={{ rotate: initialRotate }}
      animate={{ rotate: rotateValue }}
      transition={{ repeat: Infinity, ease: "linear", duration }}
      style={{ transformOrigin: "0px 0px" }}
      className={colorClass}
    >
      {/* Outer Ring */}
      <circle
        cx="0"
        cy="0"
        r={outerRingRadius}
        stroke="currentColor"
        strokeWidth={outerRingStrokeWidth}
        fill="none"
      />

      {/* Inner Hub */}
      <circle
        cx="0"
        cy="0"
        r={hubRadius}
        stroke="currentColor"
        strokeWidth={hubStrokeWidth}
        fill="none"
      />

      {/* Spokes - 4 cross spokes */}
      <line
        x1="0"
        y1={-spokeStart}
        x2="0"
        y2={-spokeEnd}
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1="0"
        y1={spokeStart}
        x2="0"
        y2={spokeEnd}
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1={-spokeStart}
        y1="0"
        x2={-spokeEnd}
        y2="0"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <line
        x1={spokeStart}
        y1="0"
        x2={spokeEnd}
        y2="0"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Center axis dot */}
      <circle cx="0" cy="0" r="2.5" fill="currentColor" />

      {/* Teeth */}
      {Array.from({ length: teeth }).map((_, i) => (
        <polygon
          key={i}
          points={points}
          fill="currentColor"
          transform={`rotate(${(i * 360) / teeth} 0 0)`}
        />
      ))}
    </motion.g>
  );
}

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

      <div className="relative w-full max-w-md px-8 flex flex-col items-center space-y-8 z-10">

        {/* Moving Gears Animation Container */}
        <div className="relative w-full h-48 flex items-center justify-center">
          <svg viewBox="0 0 200 120" className="w-64 h-36 drop-shadow-sm">
            {/* Mechanical Mounting Bracket behind gears */}
            <line 
              x1="65" 
              y1="60" 
              x2="135" 
              y2="60" 
              stroke="#e2e8f0" 
              strokeWidth="10" 
              strokeLinecap="round" 
            />
            <circle cx="65" cy="60" r="14" fill="#cbd5e1" />
            <circle cx="135" cy="60" r="14" fill="#cbd5e1" />
            <circle cx="65" cy="60" r="6" fill="#94a3b8" />
            <circle cx="135" cy="60" r="6" fill="#94a3b8" />

            {/* Gear 1: Large Clockwise Gear (12 teeth, pitchRadius 42, starting at 0 degrees) */}
            <g transform="translate(65, 60)">
              <Gear
                pitchRadius={42}
                teeth={12}
                initialRotate={0}
                rotateValue={360}
                duration={8}
                colorClass="text-neutral-900"
              />
            </g>

            {/* Gear 2: Small Counter-Clockwise Gear (8 teeth, pitchRadius 28, starting at 22.5 degrees for perfect mesh) */}
            <g transform="translate(135, 60)">
              <Gear
                pitchRadius={28}
                teeth={8}
                initialRotate={22.5}
                rotateValue={22.5 - 540} // -540 degrees (1.5 full rotations) to mesh perfectly with the 12-tooth gear
                duration={8}
                colorClass="text-neutral-400"
              />
            </g>
          </svg>
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
