import React, { useState, useEffect } from "react";
import { useStore } from "../store/useStore";
import { fetchCommunityStats } from "../utils/firebase";
import { Fuel, RefreshCw, Calendar, Gauge, ChevronRight, Award, Zap, Compass, BarChart } from "lucide-react";

export default function Dashboard() {
  const { history, historyLoading, loadHistory, user, setCurrentCalculation, setReceiptOpen } = useStore();
  const [activeLogId, setActiveLogId] = useState(null);
  const [communityAverages, setCommunityAverages] = useState({});

  // Filter history: get valid mileage numbers
  const validHistory = history.filter(item => item && !isNaN(item.mileage) && item.mileage > 0);

  // Load community averages for each unique vehicle model in user's history
  useEffect(() => {
    const loadCommunityData = async () => {
      const uniqueVehicles = Array.from(new Set(validHistory.map(item => 
        JSON.stringify({ brand: item.vehicleBrand || "", model: item.vehicleModel || item.vehicle || "", fuel: item.fuelType })
      )));

      const avgs = {};
      for (const vStr of uniqueVehicles) {
        const v = JSON.parse(vStr);
        const nameKey = `${v.brand}_${v.model}_${v.fuel}`.toLowerCase();
        try {
          const stats = await fetchCommunityStats(v.brand, v.model, v.fuel);
          avgs[nameKey] = stats ? stats.overallAverage : 0;
        } catch (e) {
          console.error("Failed to load community stat for", v, e);
        }
      }
      setCommunityAverages(avgs);
    };

    if (validHistory.length > 0) {
      loadCommunityData();
    }
  }, [history]);

  // Compute stats
  const averageMileage = validHistory.length > 0
    ? (validHistory.reduce((sum, item) => sum + item.mileage, 0) / validHistory.length).toFixed(1)
    : 0;

  const totalKM = validHistory.reduce((sum, item) => sum + (parseFloat(item.distance) || 0), 0).toFixed(0);
  const totalFuel = validHistory.reduce((sum, item) => sum + (parseFloat(item.fuelFilled) || 0), 0).toFixed(0);

  // Ride Type Trends calculations
  const rideTypeSums = { "City Ride": 0, "Highway Ride": 0, "Mixed Ride": 0 };
  const rideTypeCounts = { "City Ride": 0, "Highway Ride": 0, "Mixed Ride": 0 };

  validHistory.forEach(item => {
    const rType = item.rideType || "Mixed Ride";
    if (rideTypeSums[rType] !== undefined) {
      rideTypeSums[rType] += item.mileage;
      rideTypeCounts[rType] += 1;
    }
  });

  const rideTypeAverages = {};
  Object.keys(rideTypeSums).forEach(key => {
    rideTypeAverages[key] = rideTypeCounts[key] > 0
      ? (rideTypeSums[key] / rideTypeCounts[key]).toFixed(1)
      : "0.0";
  });

  // User Health Index average
  const userAvgHealth = validHistory.length > 0
    ? Math.round(validHistory.reduce((sum, item) => sum + (item.healthScore || 100), 0) / validHistory.length)
    : 0;

  // Red rubber stamp text
  const stampText = 
    validHistory.length === 0 ? "PENDING" :
    userAvgHealth >= 95 ? "ECO CHAMP" :
    userAvgHealth >= 80 ? "RESPONSIBLE" : "FUEL DRINKER";

  const stampSubtext = 
    validHistory.length === 0 ? "OFFICIAL AUDIT" :
    userAvgHealth >= 95 ? "OFFICIAL APPROVED" :
    userAvgHealth >= 80 ? "OFFICIAL AUDITED" : "CRITICAL WARNING";

  const currentDate = new Date().toLocaleDateString("en-IN", { month: "short", year: "2-digit" }).toUpperCase();

  // Unlocked badges
  const unlockedBadges = Array.from(new Set(validHistory.map(item => item.badgeName))).map(name => {
    const match = validHistory.find(item => item.badgeName === name);
    return {
      name,
      emoji: match ? match.badgeEmoji : "🏆",
      desc: match ? match.badgeDesc : "",
      date: match ? new Date(match.timestamp).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : ""
    };
  });
  
  // SVG Chart: compares user's logs to community averages
  const renderSVGChart = () => {
    if (validHistory.length < 2) {
      return (
        <div className="h-48 flex items-center justify-center border border-dashed border-gray-300 rounded-2xl bg-gray-50 text-gray-400 text-xs font-mono">
          [ Need at least 2 entries to plot mileage comparisons ]
        </div>
      );
    }

    const width = 500;
    const height = 180;
    const padding = 30;

    const plotData = [...validHistory].reverse();
    const mileages = plotData.map(d => d.mileage);
    
    // Community averages mapped to user runs
    const commVals = plotData.map(d => {
      const brand = d.vehicleBrand || "";
      const model = d.vehicleModel || d.vehicle || "";
      const fuel = d.fuelType;
      const key = `${brand}_${model}_${fuel}`.toLowerCase();
      return communityAverages[key] || d.mileage * 0.95; // fallback
    });

    const minM = Math.min(...mileages, ...commVals) * 0.85;
    const maxM = Math.max(...mileages, ...commVals) * 1.15;
    const rangeM = maxM - minM || 1;

    const userPoints = plotData.map((d, index) => {
      const x = padding + (index / (plotData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d.mileage - minM) / rangeM) * (height - 2 * padding);
      return { x, y, val: d.mileage, date: new Date(d.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) };
    });

    const commPoints = plotData.map((d, index) => {
      const x = padding + (index / (plotData.length - 1)) * (width - 2 * padding);
      const brand = d.vehicleBrand || "";
      const model = d.vehicleModel || d.vehicle || "";
      const fuel = d.fuelType;
      const key = `${brand}_${model}_${fuel}`.toLowerCase();
      const avg = communityAverages[key] || d.mileage * 0.95;
      const y = height - padding - ((avg - minM) / rangeM) * (height - 2 * padding);
      return { x, y, val: avg };
    });

    let userPath = `M ${userPoints[0].x} ${userPoints[0].y}`;
    let commPath = `M ${commPoints[0].x} ${commPoints[0].y}`;
    for (let i = 1; i < userPoints.length; i++) {
      userPath += ` L ${userPoints[i].x} ${userPoints[i].y}`;
      commPath += ` L ${commPoints[i].x} ${commPoints[i].y}`;
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#18181b" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#18181b" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Lined Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(0,0,0,0.15)" strokeWidth={1} />

        {/* User area under curve */}
        <path d={`${userPath} L ${userPoints[userPoints.length - 1].x} ${height - padding} L ${userPoints[0].x} ${height - padding} Z`} fill="url(#chartGlow)" />

        {/* Community Average curve (dotted gold/grey line) */}
        <path d={commPath} fill="none" stroke="#eab308" strokeWidth={2} strokeDasharray="3, 3" strokeLinecap="round" />

        {/* User trend line */}
        <path d={userPath} fill="none" stroke="#18181b" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {userPoints.map((p, idx) => (
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
              fontSize={9} 
              fontWeight="bold"
              textAnchor="middle" 
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white px-1 py-0.5 rounded shadow-sm border border-gray-100"
            >
              {p.val}
            </text>
            
            {/* X-axis labels */}
            {(idx === 0 || idx === userPoints.length - 1 || userPoints.length <= 5) && (
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
              ? `Operational registry for ${user.displayName || "Driver"}`
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

      {/* Ring-Bound Planner notebook sheet container */}
      <div className="relative w-full overflow-visible">
        
        {/* Spiral metal binder rings */}
        <div className="absolute left-0 top-10 bottom-10 flex flex-col justify-between items-center w-12 z-20 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="relative w-full h-8 flex items-center">
              <div className="absolute left-[-10px] top-[14px] w-8 h-2.5 bg-neutral-950/15 rounded-full blur-[1px] rotate-[8deg] origin-left"></div>
              <div className="absolute left-[-12px] top-[10px] w-9 h-2.5 bg-gradient-to-b from-gray-300 via-white to-gray-500 rounded-full shadow-[1px_2px_3px_rgba(0,0,0,0.15)] border border-gray-400/25 rotate-[8deg] origin-left z-10"></div>
              <div className="absolute left-[16px] top-[10px] w-2.5 h-2.5 rounded-full bg-[#27282d] shadow-[inset_1px_1.5px_2px_rgba(0,0,0,0.8)] border border-white/10 z-0"></div>
            </div>
          ))}
        </div>

        {/* Lined paper notebook sheet */}
        <div className="relative paper-sheet paper-stacked bg-[#fafaf8] rounded-2xl p-6 md:p-10 pl-14 md:pl-16 shadow-xl overflow-hidden border border-gray-200">
          
          {/* Binder vertical red margin line */}
          <div className="absolute left-10 md:left-12 top-0 bottom-0 w-[1px] bg-red-450/20 pointer-events-none"></div>
        
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

          {/* Notebook Content Grid */}
          <div className="space-y-8">
            
            {/* Stats Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4 relative overflow-hidden shadow-sm">
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400">Avg Economy</span>
                <p className="text-xl md:text-2xl font-black text-neutral-900 mt-1 tracking-tight">
                  {averageMileage} <span className="text-[10px] font-bold text-gray-500">km/L</span>
                </p>
                <Gauge size={28} className="absolute right-3 bottom-3 text-neutral-900 opacity-5" />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 relative overflow-hidden shadow-sm">
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400">Health Index</span>
                <p className="text-xl md:text-2xl font-black text-neutral-900 mt-1 tracking-tight">
                  {userAvgHealth}%
                </p>
                <Zap size={28} className="absolute right-3 bottom-3 text-neutral-900 opacity-5" />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 relative overflow-hidden shadow-sm">
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400">Distance run</span>
                <p className="text-xl md:text-2xl font-black text-neutral-900 mt-1 tracking-tight">
                  {totalKM} <span className="text-[10px] font-bold text-gray-500">km</span>
                </p>
                <Compass size={28} className="absolute right-3 bottom-3 text-neutral-900 opacity-5" />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 relative overflow-hidden shadow-sm">
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-gray-400">Total Fuel</span>
                <p className="text-xl md:text-2xl font-black text-neutral-900 mt-1 tracking-tight">
                  {totalFuel} <span className="text-[10px] font-bold text-gray-500">L</span>
                </p>
                <Fuel size={28} className="absolute right-3 bottom-3 text-neutral-900 opacity-5" />
              </div>
            </div>

            {/* Ride Type Trends Panel (Phase 10) */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center space-x-1.5 border-b border-gray-100 pb-3">
                <BarChart size={14} className="text-gray-500" />
                <span>Driving Condition Trends</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.keys(rideTypeAverages).map(type => (
                  <div key={type} className="bg-neutral-50 p-3.5 rounded-xl border border-gray-200 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase">{type}</span>
                      <p className="text-xl font-black text-neutral-900 mt-1">{rideTypeAverages[type]} <span className="text-[10px] text-gray-500">km/L</span></p>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          type === "City Ride" ? "bg-red-500" :
                          type === "Highway Ride" ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${Math.min(100, (parseFloat(rideTypeAverages[type]) / 25) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
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
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800">Efficiency Trends Comparison</h3>
                  <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide font-mono">
                    <span className="inline-block w-2.5 h-1 bg-[#18181b] mr-1"></span> Your Mileage
                    <span className="inline-block w-2.5 h-1 bg-[#eab308] border-t border-dashed ml-3 mr-1"></span> Community Average
                  </p>
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
                      const modelText = log.vehicleModel || log.vehicle;
                      return (
                        <div 
                          key={log.id}
                          className={`border rounded-lg transition-all duration-200 overflow-hidden ${
                            isActive 
                              ? "bg-neutral-50 border-neutral-900" 
                              : "bg-gray-50 border-gray-200 hover:border-gray-400"
                          } ${log.isSuspicious ? "border-amber-400 bg-amber-50/20" : ""}`}
                        >
                          {/* Collapsible header */}
                          <div 
                            onClick={() => setActiveLogId(isActive ? null : log.id)}
                            className="px-3 py-2.5 flex items-center justify-between cursor-pointer"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{log.badgeEmoji || "🚗"}</span>
                              <div>
                                <p className="text-[10px] font-bold text-neutral-900 uppercase max-w-[110px] truncate">{log.vehicleBrand} {modelText}</p>
                                <p className="text-[8px] text-gray-400 flex items-center space-x-0.5 font-mono">
                                  <Calendar size={8} />
                                  <span>{new Date(log.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-black text-neutral-850">{log.mileage} {log.fuelType === "EV" ? "km/%" : "km/L"}</span>
                              <ChevronRight 
                                size={12} 
                                className={`text-gray-400 transform transition-transform duration-200 ${isActive ? "rotate-90 text-neutral-900" : ""}`} 
                              />
                            </div>
                          </div>

                          {/* Collapsible details */}
                          {isActive && (
                            <div className="px-3 pb-3 pt-1.5 border-t border-gray-200 bg-white text-[9px] space-y-2.5 animate-fade-in">
                              {log.isSuspicious && (
                                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[8px] font-bold uppercase tracking-wider">
                                  ⚠️ Suspicious Outlier Entry - Excluded from Public Statistics
                                </div>
                              )}
                              
                              <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
                                <div>
                                  <span className="text-gray-400 font-extrabold block">FUEL VOLUME:</span>
                                  <span className="text-neutral-900 font-bold">{log.fuelFilled} {log.fuelType === "EV" ? "%" : "L"} ({log.fuelType})</span>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-extrabold block">DISTANCE RUN:</span>
                                  <span className="text-neutral-900 font-bold">{log.distance} KM</span>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-extrabold block">RIDE TYPE:</span>
                                  <span className="text-neutral-900 font-bold uppercase">{log.rideType || "Mixed Ride"}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-extrabold block">HEALTH INDEX:</span>
                                  <span className={`font-black ${
                                    log.healthRating === "Excellent" ? "text-green-700" : 
                                    log.healthRating === "Good" ? "text-green-600" :
                                    log.healthRating === "Average" ? "text-amber-700" :
                                    "text-red-700"
                                  }`}>{log.healthScore}% ({log.healthRating || "Average"})</span>
                                </div>
                                <div>
                                  <span className="text-gray-400 font-extrabold block">CONFIDENCE SCORE:</span>
                                  <span className="text-neutral-900 font-bold">{log.confidenceScore}/100</span>
                                </div>
                              </div>
                              
                              {log.healthVerdict && (
                                <div className="border-t border-gray-100 pt-2 text-left font-mono">
                                  <span className="text-[8px] font-black text-neutral-800 tracking-wider block uppercase mb-0.5">
                                    [ AMMAVAN VERDICT ]
                                  </span>
                                  <p className="text-[9px] text-gray-700 italic leading-relaxed">
                                    "{log.healthVerdict}"
                                  </p>
                                </div>
                              )}

                              <div className="border-t border-gray-100 pt-2 text-left font-mono">
                                <span className="text-[8px] font-black text-neutral-800 tracking-wider block uppercase mb-0.5">
                                  [ AUDITOR ROAST ]
                                  </span>
                                <p className="text-[9px] text-gray-705 italic leading-relaxed">
                                  "{log.roast}"
                                </p>
                              </div>

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
    </div>
  );
}
