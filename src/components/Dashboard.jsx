import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { Fuel, RefreshCw, Calendar, MapPin, Gauge, ChevronRight, Award } from "lucide-react";

export default function Dashboard() {
  const { history, historyLoading, loadHistory, user, setCurrentCalculation, setReceiptOpen } = useStore();
  const [activeLogId, setActiveLogId] = useState(null);

  // Filter history: get valid mileage numbers
  const validHistory = history.filter(item => item && !isNaN(item.mileage) && item.mileage > 0);

  // Compute stats
  const averageMileage = validHistory.length > 0
    ? (validHistory.reduce((sum, item) => sum + item.mileage, 0) / validHistory.length).toFixed(1)
    : 0;

  const totalKM = validHistory.reduce((sum, item) => sum + (parseFloat(item.distance) || 0), 0).toFixed(0);
  const totalFuel = validHistory.reduce((sum, item) => sum + (parseFloat(item.fuelFilled) || 0), 0).toFixed(0);

  // Red rubber stamp calculations
  const avgMileageNum = parseFloat(averageMileage);
  const stampText = 
    validHistory.length === 0 ? "PENDING" :
    avgMileageNum >= 20.0 ? "ECO CHAMP" :
    avgMileageNum >= 14.0 ? "COMMUTER" : "FUEL GUZZLER";

  const stampSubtext = 
    validHistory.length === 0 ? "OFFICIAL AUDIT" :
    avgMileageNum >= 20.0 ? "OFFICIAL APPROVED" :
    avgMileageNum >= 14.0 ? "OFFICIAL AUDITED" : "CRITICAL WARNING";

  const currentDate = new Date().toLocaleDateString("en-IN", { month: "short", year: "2-digit" }).toUpperCase();

  // Unlocked badges (get unique badges from history)
  const unlockedBadges = Array.from(new Set(validHistory.map(item => item.badgeName))).map(name => {
    const match = validHistory.find(item => item.badgeName === name);
    return {
      name,
      emoji: match ? match.badgeEmoji : "🏆",
      desc: match ? match.badgeDesc : "",
      date: match ? new Date(match.timestamp).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""
    };
  });
  
  // SVG Chart Calculation Helper (styled like hand-drawn drafting ledger chart)
  const renderSVGChart = () => {
    if (validHistory.length < 2) {
      return (
        <div className="h-48 flex items-center justify-center border border-dashed border-gray-300 rounded-2xl bg-gray-50 text-gray-400 text-xs font-medium">
          Need at least 2 entries to plot fuel efficiency trends.
        </div>
      );
    }

    const width = 500;
    const height = 180;
    const padding = 25;

    const plotData = [...validHistory].reverse();
    const mileages = plotData.map(d => d.mileage);

    const minM = Math.min(...mileages) * 0.9;
    const maxM = Math.max(...mileages) * 1.1;
    const rangeM = maxM - minM || 1;

    const points = plotData.map((d, index) => {
      const x = padding + (index / (plotData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d.mileage - minM) / rangeM) * (height - 2 * padding);
      return { x, y, val: d.mileage, date: new Date(d.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#71717a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#71717a" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Lined Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(0,0,0,0.15)" strokeWidth={1} />

        {/* Area under curve */}
        <path d={areaD} fill="url(#chartGlow)" />

        {/* Charcoal trend line */}
        <path d={pathD} fill="none" stroke="#18181b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle 
              cx={p.x} 
              cy={p.y} 
              r={4} 
              fill="#18181b" 
              stroke="#ffffff" 
              strokeWidth={1.5} 
              className="hover:scale-150 transition-transform duration-200" 
            />
            {/* Tooltip value */}
            <text 
              x={p.x} 
              y={p.y - 10} 
              fill="#18181b" 
              fontSize={10} 
              fontWeight="bold"
              textAnchor="middle" 
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white"
            >
              {p.val}
            </text>
            {/* X-axis labels */}
            {(idx === 0 || idx === points.length - 1 || points.length <= 5) && (
              <text 
                x={p.x} 
                y={height - 8} 
                fill="rgba(0,0,0,0.45)" 
                fontSize={8} 
                textAnchor="middle"
              >
                {p.date}
              </text>
            )}
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in text-left">
      
      {/* Welcome & Dashboard header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase">My Garage Logbook</h2>
          <p className="text-xs text-gray-500 mt-1">
            {user 
              ? `Audited operations for ${user.displayName || "Driver"}`
              : "Locally recorded mileage logs cabinet."}
          </p>
        </div>
        <button 
          onClick={loadHistory}
          disabled={historyLoading}
          className="self-start md:self-auto flex items-center space-x-1.5 px-4 py-2 border border-gray-300 hover:border-accentBlack rounded-xl text-xs font-bold text-gray-600 hover:text-neutral-900 transition-all duration-300 bg-white shadow-sm"
        >
          <RefreshCw size={13} className={historyLoading ? "animate-spin" : ""} />
          <span>Sync logbook</span>
        </button>
      </div>

      {/* Ring-Bound Planner notebook sheet */}
      <div className="relative paper-sheet paper-stacked bg-[#fafaf8] rounded-2xl p-6 md:p-10 pl-14 md:pl-16 shadow-xl overflow-hidden border border-gray-200">
        
        {/* SVG Distress Filter for Rubber Stamp */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <filter id="stamp-distress">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        {/* Skeuomorphic Red Rubber Stamp in top right corner */}
        <div 
          className="absolute top-3 right-3 md:top-4 md:right-5 pointer-events-none select-none z-20 flex flex-col items-center justify-center border-red-600 text-red-650 font-mono px-3.5 py-1 text-center max-w-[130px] md:max-w-[155px]"
          style={{
            transform: "rotate(-8deg)",
            mixBlendMode: "multiply",
            filter: "url(#stamp-distress)",
            borderStyle: "double",
            borderWidth: "5px",
            borderColor: "rgba(220, 38, 38, 0.85)",
            color: "rgba(220, 38, 38, 0.85)",
            boxShadow: "0 0 1px rgba(220,38,38,0.05), inset 0 0 2px rgba(220,38,38,0.1)"
          }}
        >
          <span className="text-[7px] font-black tracking-widest leading-none block border-b border-red-600/80 pb-0.5 mb-1 w-full text-center">
            {stampSubtext}
          </span>
          <span className="text-sm md:text-base font-black leading-none tracking-tight block py-0.5 text-center my-0.5 border-y border-dashed border-red-600/80 w-full">
            {stampText}
          </span>
          <span className="text-[7px] font-bold tracking-widest leading-none block mt-0.5 w-full text-center">
            DEPT: MU • {currentDate}
          </span>
        </div>

        {/* Spiral metal binder rings on the left margin */}
        <div className="absolute left-4 top-10 bottom-10 flex flex-col justify-between items-center w-5 py-4 z-10 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-1">
              {/* Ring hole in sheet */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1] border border-gray-300 shadow-inner"></div>
              {/* Ring metal shape */}
              <div className="w-8 h-4.5 spiral-ring rounded-full transform -translate-x-3"></div>
            </div>
          ))}
        </div>

        {/* Notebook Content Grid */}
        <div className="space-y-8">
          
          {/* Stats Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 relative overflow-hidden shadow-sm">
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400">Avg Economy</span>
              <p className="text-2xl font-black text-neutral-900 mt-1 tracking-tight">
                {averageMileage} <span className="text-xs font-bold text-gray-500">kmpl</span>
              </p>
              <Gauge size={28} className="absolute right-3 bottom-3 text-neutral-900 opacity-5" />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 relative overflow-hidden shadow-sm">
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400">Total logs</span>
              <p className="text-2xl font-black text-neutral-900 mt-1 tracking-tight">{validHistory.length}</p>
              <Fuel size={28} className="absolute right-3 bottom-3 text-neutral-900 opacity-5" />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 relative overflow-hidden shadow-sm">
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400">Distance run</span>
              <p className="text-2xl font-black text-neutral-900 mt-1 tracking-tight">
                {totalKM} <span className="text-xs font-bold text-gray-500">km</span>
              </p>
              <MapPin size={28} className="absolute right-3 bottom-3 text-neutral-900 opacity-5" />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 relative overflow-hidden shadow-sm">
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400">Total Fuel</span>
              <p className="text-2xl font-black text-neutral-900 mt-1 tracking-tight">
                {totalFuel} <span className="text-xs font-bold text-gray-500">L</span>
              </p>
              <Fuel size={28} className="absolute right-3 bottom-3 text-neutral-900 opacity-5" />
            </div>
          </div>

          {/* Badge Cabinet */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center space-x-1.5 border-b border-gray-100 pb-3">
              <Award size={14} className="text-gray-500" />
              <span>Stamps & Unlocked Ranks</span>
            </h3>
            {unlockedBadges.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg font-mono">
                [ No records calculated yet ]
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {unlockedBadges.map((badge, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex items-start space-x-2.5 hover:border-neutral-900 transition-colors">
                    <span className="text-2xl p-1 bg-white border border-gray-200 rounded-lg">{badge.emoji}</span>
                    <div className="text-xs">
                      <h4 className="font-extrabold text-neutral-900 uppercase tracking-tight">{badge.name}</h4>
                      <p className="text-[9px] text-gray-500 leading-snug mt-1">{badge.desc}</p>
                      <span className="inline-block text-[8px] text-gray-400 mt-2 font-mono">
                        STAMPED: {badge.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Two Columns Grid for Charts & History logs */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* SVG Fuel economy trends chart */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800">Operational ledger Chart</h3>
                <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide font-mono">Efficiency indices over runs (Kmpl)</p>
              </div>
              <div className="py-2 bg-gray-50/50 rounded-lg p-2 border border-gray-100">
                {renderSVGChart()}
              </div>
            </div>

            {/* Log History */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm max-h-[380px] overflow-y-auto">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800">Registered Sheets</h3>
              
              {historyLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-2 font-mono text-xs text-gray-400">
                  <div className="w-5 h-5 border-2 border-gray-200 border-t-neutral-800 animate-spin rounded-full"></div>
                  <span>RETRIEVING LOGS...</span>
                </div>
              ) : history.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-12 font-mono">[ Empty logbook ]</p>
              ) : (
                <div className="space-y-2.5">
                  {history.map((log) => {
                    const isActive = activeLogId === log.id;
                    return (
                      <div 
                        key={log.id}
                        className={`border rounded-lg transition-all duration-200 overflow-hidden ${
                          isActive 
                            ? "bg-neutral-50 border-neutral-900" 
                            : "bg-gray-50 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        {/* Collapsible header */}
                        <div 
                          onClick={() => setActiveLogId(isActive ? null : log.id)}
                          className="px-3 py-2.5 flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{log.badgeEmoji || "🚗"}</span>
                            <div>
                              <p className="text-[10px] font-bold text-neutral-900 uppercase max-w-[110px] truncate">{log.vehicle}</p>
                              <p className="text-[8px] text-gray-400 flex items-center space-x-0.5 font-mono">
                                <Calendar size={8} />
                                <span>{new Date(log.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black text-neutral-850">{log.mileage} kmpl</span>
                            <ChevronRight 
                              size={12} 
                              className={`text-gray-400 transform transition-transform duration-200 ${isActive ? "rotate-90 text-neutral-900" : ""}`} 
                            />
                          </div>
                        </div>

                        {/* Collapsible details */}
                        {isActive && (
                          <div className="px-3 pb-3 pt-1.5 border-t border-gray-200 bg-white text-[9px] space-y-2.5 animate-fade-in">
                            <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
                              <div>
                                <span className="text-gray-400 font-extrabold block">QUANTITY:</span>
                                <span className="text-neutral-900 font-bold">{log.fuelFilled} {log.fuelType === "EV" ? "%" : "L"}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 font-extrabold block">DISTANCE:</span>
                                <span className="text-neutral-900 font-bold">{log.distance} KM</span>
                              </div>
                              <div>
                                <span className="text-gray-400 font-extrabold block">DISTRICT:</span>
                                <span className="text-neutral-900 font-bold uppercase">{log.district || "Kochi"}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 font-extrabold block">RATING:</span>
                                <span className={`font-black ${
                                  log.rating === "Excellent" ? "text-green-700" : 
                                  log.rating === "Good" ? "text-green-600" :
                                  log.rating === "Average" ? "text-amber-700" :
                                  "text-red-700"
                                }`}>{log.rating || "Average"}</span>
                              </div>
                            </div>
                            
                            <div className="border-t border-gray-100 pt-2 text-left font-mono">
                              <span className="text-[8px] font-black text-neutral-800 tracking-wider block uppercase mb-0.5">
                                [ AUDITOR REMARK ]
                              </span>
                              <p className="text-[10px] text-gray-650 italic leading-relaxed mb-2.5">
                                "{log.roast}"
                              </p>
                            </div>

                            {/* View & Share Receipt Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentCalculation(log);
                                setReceiptOpen(true);
                              }}
                              className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[9px] font-extrabold uppercase tracking-wide rounded transition-colors"
                            >
                              View & Share Receipt 🧾
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
