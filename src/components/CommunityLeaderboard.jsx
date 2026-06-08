import React, { useState, useEffect } from "react";
import { fetchLeaderboard, isFirebaseConfigured } from "../utils/firebase";
import { Trophy, RefreshCw, Compass } from "lucide-react";

export default function CommunityLeaderboard() {
  const [boardData, setBoardData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fuelFilter, setFuelFilter] = useState("All");

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaderboard();
      setBoardData(data);

      const localLogs = JSON.parse(localStorage.getItem("mileage_entries") || "[]");
      const districtsAgg = {};
      localLogs.forEach(entry => {
        if (!entry.district || !entry.mileage) return;
        if (!districtsAgg[entry.district]) {
          districtsAgg[entry.district] = { sum: 0, count: 0 };
        }
        districtsAgg[entry.district].sum += parseFloat(entry.mileage);
        districtsAgg[entry.district].count += 1;
      });

      const formatted = Object.keys(districtsAgg).map(d => ({
        name: d,
        average: parseFloat((districtsAgg[d].sum / districtsAgg[d].count).toFixed(2)),
        submissions: districtsAgg[d].count
      })).sort((a, b) => b.average - a.average);

      setDistrictData(formatted);
    } catch (e) {
      console.error("Failed to load leaderboard stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const filteredBoardData = fuelFilter === "All"
    ? boardData
    : boardData.filter(item => item.fuelType === fuelFilter);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in text-left">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase">Real-World Registry Database</h2>
          <p className="text-xs text-gray-500 mt-1">
            Real crowdsourced driver data aggregates. Free from manufacturer claim propaganda.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Fuel type filters */}
          <div className="flex bg-gray-100 border border-gray-200 p-1 rounded-xl">
            {["All", "Petrol", "Diesel", "EV"].map(filter => (
              <button
                key={filter}
                onClick={() => setFuelFilter(filter)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  fuelFilter === filter
                    ? "bg-neutral-950 text-white"
                    : "text-gray-500 hover:text-neutral-900"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button 
            onClick={loadStats}
            disabled={loading}
            className="p-2 border border-gray-200 hover:border-neutral-950 rounded-xl text-gray-400 hover:text-neutral-900 transition-all duration-300 bg-white shadow-sm"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Clipped Printed Document */}
      <div className="paper-sheet paper-stacked rounded-2xl p-6 md:p-10 space-y-8 bg-white border border-gray-200 shadow-xl">
        
        {/* Document Header stamp */}
        <div className="border-b-2 border-double border-gray-200 pb-4 mb-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">RECORD CLASSIFICATION: PUBLIC</span>
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 mt-0.5 flex items-center space-x-1.5">
              <Trophy size={14} className="text-gray-500" />
              <span>COMMUNITY AVERAGE INDEX</span>
            </h3>
          </div>
          <span className="text-[9px] font-mono border border-gray-200 px-2 py-0.5 rounded text-gray-400 bg-gray-50">
            STAMP: AUTHENTIC
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Main Vehicle Leaderboard Grid */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800">1. Top Performing Models</h4>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3 font-mono text-xs text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-neutral-800 animate-spin rounded-full"></div>
                <span>COMPILING LEDGER ROWS...</span>
              </div>
            ) : filteredBoardData.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-mono">
                [ No registry entries found ]
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="border-b border-gray-200 text-[9px] uppercase font-black text-gray-400 tracking-wider bg-gray-50">
                      <th className="py-2.5 pl-3">Rank</th>
                      <th className="py-2.5">Vehicle Model</th>
                      <th className="py-2.5">Engine</th>
                      <th className="py-2.5 text-right pr-3">Real Economy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-xs">
                    {filteredBoardData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 pl-3 font-black text-gray-400">
                          {idx + 1 === 1 ? "🥇" : idx + 1 === 2 ? "🥈" : idx + 1 === 3 ? "🥉" : `#${idx + 1}`}
                        </td>
                        <td className="py-3.5 font-bold text-neutral-900 uppercase">{item.vehicle}</td>
                        <td className="py-3.5">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono border border-gray-200 text-gray-500 bg-gray-50">
                            {item.fuelType}
                          </span>
                        </td>
                        <td className="py-3.5 text-right pr-3 font-black text-neutral-800">
                          {item.averageMileage} <span className="text-[10px] text-gray-400 font-bold">{item.fuelType === "EV" ? "km/%" : "kmpl"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* District Performance Grid */}
          <div className="md:col-span-2 space-y-4 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center space-x-1">
              <Compass size={14} className="text-gray-400" />
              <span>2. Regional Efficiency</span>
            </h4>
            <p className="text-[10px] text-gray-400 leading-relaxed font-mono uppercase tracking-wide">
              Territorial ranking calculated by regional driver submissions.
            </p>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-2 font-mono text-xs text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-neutral-800 animate-spin rounded-full"></div>
                <span>SORTING TERRITORIES...</span>
              </div>
            ) : districtData.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-mono">
                [ No district records registered ]
              </div>
            ) : (
              <div className="space-y-3">
                {districtData.map((d, idx) => (
                  <div key={d.name} className="flex items-center justify-between border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold text-gray-400 w-5">#{idx + 1}</span>
                      <div>
                        <h5 className="text-xs font-bold text-neutral-900 uppercase leading-none">{d.name}</h5>
                        <span className="text-[8px] text-gray-400 uppercase font-mono">{d.submissions} sheets</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-neutral-800">{d.average}</span>
                      <span className="text-[8px] text-gray-400 font-mono ml-0.5">AVG</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      
    </div>
  );
}
