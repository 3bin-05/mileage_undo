import React, { useState } from "react";
import { useStore } from "./store/useStore";
import Navbar from "./components/Navbar";
import MileageForm from "./components/MileageForm";
import Receipt from "./components/Receipt";
import Dashboard from "./components/Dashboard";
import CommunityLeaderboard from "./components/CommunityLeaderboard";
import Preloader from "./components/Preloader";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function App() {
  const { activeTab } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Skeuomorphic Car Preloader Screen */}
      <AnimatePresence>
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8 md:py-12">
        {activeTab === "calculate" && (
          <div className="space-y-12">
            {/* Visual Hero Block */}
            <div className="text-center space-y-4 max-w-3xl mx-auto py-4 animate-fade-in">
              <div className="inline-flex items-center space-x-1.5 bg-white border border-gray-250 px-3 py-1 rounded-full text-neutral-800 text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                <Sparkles size={11} className="text-neutral-900 animate-pulse" />
                <span>Mileage Intelligence Ledger</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight uppercase">
                Mileage Ethra Mone? <br />
                <span className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 bg-clip-text text-transparent font-black tracking-normal">
                  MILEAGE UNDO
                </span>
              </h1>
              
              <p className="text-xs md:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
                Log and audit real-world vehicle economy. Squeeze every meter out of your fuel, unlock stereotypes stamps, and file report logs.
              </p>
            </div>

            {/* Main Input Form (Clipboard Paper Pad) */}
            <MileageForm />

            {/* Tactile Skeuomorphic Sticky Notes Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto pt-10 text-left overflow-visible">
              
              {/* Sticky Note 1: Pastel Yellow */}
              <div className="relative sticky-note p-6 bg-[#fef9c3] border border-yellow-200/60 -rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 overflow-visible text-neutral-800 shadow-md">
                {/* Masking Tape Overlay */}
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-white/35 border border-white/20 shadow-xs -rotate-2 z-10 backdrop-blur-[1px]"></div>
                
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight flex items-center space-x-1.5 border-b border-black/10 pb-2">
                  <span className="text-sm">🧔</span>
                  <span>Stereotyped Roasters</span>
                </h3>
                <p className="text-[9px] font-mono uppercase tracking-wide leading-relaxed text-neutral-700 mt-2.5">
                  PERSONALIZED FEEDBACK COMPILED IN 3 TRANSLATIONS ACROSS 6 TRADITIONAL AUDITING STEREOTYPES.
                </p>
              </div>

              {/* Sticky Note 2: Pastel Green */}
              <div className="relative sticky-note p-6 bg-[#ecfccb] border border-lime-200/65 rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 overflow-visible text-neutral-800 shadow-md">
                {/* Masking Tape Overlay */}
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-white/35 border border-white/20 shadow-xs rotate-3 z-10 backdrop-blur-[1px]"></div>
                
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight flex items-center space-x-1.5 border-b border-black/10 pb-2">
                  <span className="text-sm">📊</span>
                  <span>Crowdsourced Ledger</span>
                </h3>
                <p className="text-[9px] font-mono uppercase tracking-wide leading-relaxed text-neutral-700 mt-2.5">
                  EVERY RECORD LOG CONTRIBUTES TO COMPUTING DYNAMIC GEOGRAPHICAL AVERAGES OVER HIGHWAY TRAFFIC.
                </p>
              </div>

              {/* Sticky Note 3: Pastel Blue */}
              <div className="relative sticky-note p-6 bg-[#e0f2fe] border border-sky-200/60 -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 overflow-visible text-neutral-800 shadow-md">
                {/* Masking Tape Overlay */}
                <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-white/35 border border-white/20 shadow-xs -rotate-1 z-10 backdrop-blur-[1px]"></div>
                
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight flex items-center space-x-1.5 border-b border-black/10 pb-2">
                  <span className="text-sm">🧾</span>
                  <span>Thermal Receipts</span>
                </h3>
                <p className="text-[9px] font-mono uppercase tracking-wide leading-relaxed text-neutral-700 mt-2.5">
                  CALCULATIONS ROLL OUT ON SECURED THERMAL SLIPS COMPLETED WITH STAMPS, SCALES, AND PNG DOWNLOADS.
                </p>
              </div>

            </div>
          </div>
        )}

        {activeTab === "history" && <Dashboard />}

        {activeTab === "leaderboard" && <CommunityLeaderboard />}
      </main>

      {/* Thermal Receipt Modal Drawer overlay */}
      <Receipt />

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white py-6 text-center text-[10px] text-gray-400 font-mono uppercase tracking-wider mt-16">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MILEAGE UNDO REGISTRY. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-4">
            <span className="hover:text-neutral-950 cursor-pointer">TERMS</span>
            <span className="hover:text-neutral-950 cursor-pointer">PRIVACY</span>
            <span className="hover:text-neutral-950 cursor-pointer">DISCLAIMER</span>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
