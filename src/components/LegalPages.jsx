import React from "react";
import { useStore } from "../store/useStore";
import { Scale, ShieldAlert, FileText, Code2, ArrowLeft } from "lucide-react";

export default function LegalPages() {
  const { activeTab, setActiveTab } = useStore();

  const handleBack = () => {
    setActiveTab("calculate");
  };

  const navItems = [
    { id: "terms", label: "Terms", icon: FileText },
    { id: "privacy", label: "Privacy", icon: Scale },
    { id: "disclaimer", label: "Disclaimer", icon: ShieldAlert },
    { id: "licence", label: "Licence", icon: Code2 }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in text-left">
      
      {/* Back to Calculator Button */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-5">
        <button
          onClick={handleBack}
          className="flex items-center space-x-1.5 px-4 py-2 border border-gray-300 hover:border-accentBlack rounded-xl text-xs font-bold text-gray-600 hover:text-neutral-900 transition-all duration-300 bg-white shadow-sm cursor-pointer"
        >
          <ArrowLeft size={13} />
          <span>Back to Calculator</span>
        </button>

        {/* Tab Switcher inside the Legal page view */}
        <div className="flex bg-gray-100 border border-gray-200 p-1 rounded-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-neutral-950 text-white shadow-sm"
                    : "text-gray-500 hover:text-neutral-900"
                }`}
              >
                <Icon size={11} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ruled Legal Notebook Sheet */}
      <div className="relative paper-sheet paper-stacked bg-[#fafaf8] rounded-2xl p-8 md:p-12 pl-14 md:pl-16 shadow-xl overflow-hidden border border-gray-200">
        
        {/* Binder vertical red margin line */}
        <div className="absolute left-10 md:left-12 top-0 bottom-0 w-[1px] bg-red-400/20 pointer-events-none"></div>

        {/* Metal spiral rings on the left margin */}
        <div className="absolute left-0 top-10 bottom-10 flex flex-col justify-between items-center w-12 z-20 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="relative w-full h-8 flex items-center">
              {/* Loop Shadow on paper */}
              <div className="absolute left-[-10px] top-[14px] w-8 h-2.5 bg-neutral-950/15 rounded-full blur-[1px] rotate-[8deg] origin-left"></div>
              {/* Metallic Spiral Loop */}
              <div className="absolute left-[-12px] top-[10px] w-9 h-2.5 bg-gradient-to-b from-gray-300 via-white to-gray-500 rounded-full shadow-[1px_2px_3px_rgba(0,0,0,0.15)] border border-gray-400/25 rotate-[8deg] origin-left z-10"></div>
              {/* Punch Hole */}
              <div className="absolute left-[16px] top-[10px] w-2.5 h-2.5 rounded-full bg-[#27282d] shadow-[inset_1px_1.5px_2px_rgba(0,0,0,0.8)] border border-white/10 z-0"></div>
            </div>
          ))}
        </div>

        {/* Document header seal stamp */}
        <div className="border-b-2 border-double border-gray-300 pb-4 mb-8 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
              OFFICIAL REGISTRY DOCUMENT
            </span>
            <h2 className="text-md font-black text-neutral-900 uppercase tracking-tight mt-0.5">
              {activeTab === "terms" && "TERMS OF SERVICE"}
              {activeTab === "privacy" && "PRIVACY POLICY"}
              {activeTab === "disclaimer" && "OFFICIAL DISCLAIMER"}
              {activeTab === "licence" && "LICENCING & OPEN SOURCE"}
            </h2>
            <p className="text-[8px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">
              DOC NO: MU-LEGAL/{activeTab?.toUpperCase()}/2026
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block border-2 border-dashed border-red-500/80 text-red-500/80 text-[8px] font-extrabold uppercase px-2 py-1 rounded rotate-3 tracking-wider font-mono">
              APPROVED BY AMMAVAN
            </span>
          </div>
        </div>

        {/* Content Body with ruled paper background text feel */}
        <div className="space-y-6 text-xs md:text-sm text-neutral-800 leading-relaxed font-mono">
          
          {/* TERMS OF SERVICE */}
          {activeTab === "terms" && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="font-extrabold text-neutral-900 border-b border-black/10 pb-1">1. ACCEPTANCE OF TERMS</h3>
                <p>
                  BY ENTERING THE REGISTRY OFFICE OF MILEAGE UNDO, YOU AGREE TO BE BOUND BY THESE CONDITIONS. 
                  IF YOU CANNOT TOLERATE ABSOLUTE SARCASM OR CONSTRUCTIVE ROASTING REGARDING YOUR VEHICLE'S economy, 
                  YOU ARE REQUESTED TO PARK ELSEWHERE AND EXIT THE SERVICE IMMEDIATELY.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-neutral-900 border-b border-black/10 pb-1">2. SUBMISSION OF DATA</h3>
                <p>
                  ALL RECORDED ODOMETER READINGS, DISTANCES RUN, AND FUEL VOLUME VALUES ENTERED MUST BE COLLECTED 
                  IN GOOD FAITH FROM ACTUAL VEHICLE OPERATIONS. SUBMITTING FICTIONAL 45 KMPL ENTRIES ON A TOYOTA FORTUNER 
                  IS A GRAVE CRIME AGAINST THE COMMUNE AND WILL TRIGGER IMMEDIATE HARSH STAMP CLASSIFICATIONS.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-neutral-900 border-b border-black/10 pb-1">3. ROASTING MECHANISMS</h3>
                <p>
                  THE AUDIT SYSTEM UTILIZES A PROPRIETARY DUAL-TIER GENERATION ENGINE (GEMINI-AI POWERED OR STATE-RULED LOCAL FALLBACK). 
                  REMARKS REGARDING YOUR DRIVING ABILITIES, COCHIN TRAFFIC ACCELERATION, CLUTCH RIDING, AND COMPARISONS 
                  WITH NEIGHBOR'S SONS ARE DESIGNED PURELY FOR COMEDIC PURPOSES. NO OFFENSE IS DIRECTED AT PHYSICAL PERSONS.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-neutral-900 border-b border-black/10 pb-1">4. LIMITATION OF LIABILITY</h3>
                <p>
                  MILEAGE UNDO SHALL NOT BE HELD LIABLE FOR ACTUAL FUEL LEAKAGES, REPAIR COSTS RESULTING FROM BAD ENGINES, 
                  OR DECREASED SELF-ESTEEM INDUCED BY AMMAVAN'S COMMENTARY. DRIVE RESPONSIBLY.
                </p>
              </section>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {activeTab === "privacy" && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="font-extrabold text-neutral-900 border-b border-black/10 pb-1">1. DATA MINIMIZATION</h3>
                <p>
                  WE DO NOT SELL, RENT, OR EXPOSE YOUR PERSONAL VEHICLE LOGS TO GOVERNMENT AGENCIES, TAX DEPARTMENTS, OR CAR DEALERS. 
                  WE VALUE DRIVER CONFIDENTIALITY ABOVE ALL ELSE.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-neutral-900 border-b border-black/10 pb-1">2. STORAGE MECHANISMS</h3>
                <p>
                  - <strong>LOCAL STORAGE:</strong> YOUR TRIP CALCULATIONS AND DETAILED HISTORY SHEETS ARE STORED LOCALLY WITHIN YOUR BROWSER COCKPIT. CLEANSING BROWSER CACHE WILL SECURELY PURGE THESE RECORDS.
                  <br />
                  - <strong>FIREBASE DATABASE:</strong> IF FIREBASE INTEGRATION IS ACTIVE, ANONYMIZED AVERAGES AND VEHICLE BRANDS ARE SYNCED TO COMPILE CROWDSOURCED AVERAGE CALCULATIONS. IP ADDRESSES OR PERSONAL INFOS ARE NEVER TIED TO THESE LEDGERS.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-neutral-900 border-b border-black/10 pb-1">3. SECURITY SEALS</h3>
                <p>
                  TRANSACTIONS ARE SIGNED WITH CRYPTOGRAPHIC STABLE TRANSACTION IDs DERIVED SOLELY FROM SUBMISSION TIMESTAMP HASHES. 
                  YOUR SECRET RECIPES AND BADGE ACQUISITION DATA ARE ENCRYPTED UNDER STANDARD LOCAL SANDBOX POLICIES.
                </p>
              </section>
            </div>
          )}

          {/* DISCLAIMER */}
          {activeTab === "disclaimer" && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="font-extrabold text-neutral-900 border-b border-black/10 pb-1">HUMOROUS DISCLAIMER</h3>
                <p>
                  THE RATING STAMPS ("ACHAN HAPPY", "UNCLE ACCEPTABLE", "PUMP OWNER HAPPY") AND BADGES ASSIGNED 
                  TO YOUR CALCULATION ENTRIES ARE DERIVED FROM AN IN-HOUSE RATING FORMULA MEASURING FUEL CONSUMPTION. 
                  IF YOUR VERDICT LABELS YOU A "PUMP OWNER'S VIP SPONSOR", IT IN NO WAY DENOTES AN ACTUAL FINANCIAL 
                  DUBAI SPONSORSHIP SPARKED BY YOUR PETROL EXPENSES.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-neutral-900 border-b border-black/10 pb-1">TECHNICAL DISCLAIMER</h3>
                <p>
                  MANUFACTURER economy CLAIMS SHOWN ARE DERIVED FROM ARAI LAB TESTING VALUES WHICH ARE FAMOUSLY IMPOSSIBLE 
                  TO ACHIEVE IN ACTUAL INDIAN HIGHWAY TRAFFIC OR LOCAL ROADWAYS. USER CALCULATIONS AND REAL-WORLD DATA 
                  MAY DEVIATE SIGNIFICANTLY DUE TO TYRE PRESSURE, BAD ROADS, CLOGGED AIR FILTERS, AND FUEL ADULTERATION.
                </p>
              </section>
            </div>
          )}

          {/* LICENCING & OPEN SOURCE */}
          {activeTab === "licence" && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h3 className="font-extrabold text-neutral-900 border-b border-black/10 pb-1">MIT LICENSE</h3>
                <pre className="p-3 bg-neutral-900/5 rounded font-mono text-[9px] whitespace-pre-wrap border border-black/5 leading-snug">
                  {`Copyright (c) 2026 Mileage Undo Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
                </pre>
              </section>

              <section className="space-y-2">
                <h3 className="font-extrabold text-neutral-900 border-b border-black/10 pb-1">OPEN SOURCE PROJECT CREDITS</h3>
                <p>
                  THIS REGISTRY APPLICATION IS BUILT WITH LOVE FOR THE MALAYALI DEVELOPER & DRIVER COMMUNITY. 
                  IT STANDS ON THE SHOULDERS OF OUTSTANDING OPEN-SOURCE DEPENDENCIES:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-mono text-[10px]">
                  <div className="p-2 bg-white border border-gray-200 rounded-lg flex justify-between items-center">
                    <span className="font-black text-neutral-900">React</span>
                    <span className="text-gray-400">UI library</span>
                  </div>
                  <div className="p-2 bg-white border border-gray-200 rounded-lg flex justify-between items-center">
                    <span className="font-black text-neutral-900">Tailwind CSS v4</span>
                    <span className="text-gray-400">Styling system</span>
                  </div>
                  <div className="p-2 bg-white border border-gray-200 rounded-lg flex justify-between items-center">
                    <span className="font-black text-neutral-900">Zustand</span>
                    <span className="text-gray-400">State management</span>
                  </div>
                  <div className="p-2 bg-white border border-gray-200 rounded-lg flex justify-between items-center">
                    <span className="font-black text-neutral-900">Framer Motion</span>
                    <span className="text-gray-400">Page animations</span>
                  </div>
                  <div className="p-2 bg-white border border-gray-200 rounded-lg flex justify-between items-center">
                    <span className="font-black text-neutral-900">Firebase SDK</span>
                    <span className="text-gray-400">Database & auth</span>
                  </div>
                  <div className="p-2 bg-white border border-gray-200 rounded-lg flex justify-between items-center">
                    <span className="font-black text-neutral-900">Lucide React</span>
                    <span className="text-gray-400">Tactile vector icons</span>
                  </div>
                  <div className="p-2 bg-white border border-gray-200 rounded-lg flex justify-between items-center font-mono">
                    <span className="font-black text-neutral-900">canvas-confetti</span>
                    <span className="text-gray-400">Celebration trigger</span>
                  </div>
                  <div className="p-2 bg-white border border-gray-200 rounded-lg flex justify-between items-center">
                    <span className="font-black text-neutral-900">html-to-image</span>
                    <span className="text-gray-400">Receipt exporter</span>
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
