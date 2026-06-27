import React, { useState, useEffect } from "react";
import { fetchLeaderboard, fetchCommunityStats } from "../utils/firebase";
import { Search, Trophy, RefreshCw, Compass, ArrowLeft, BarChart2, Star, Shield, Users, Fuel, TrendingUp } from "lucide-react";

export default function CommunityLeaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVehicleStats, setSelectedVehicleStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState("Bike"); // "Bike" | "Car" | "SUV"

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaderboard();
      setLeaderboardData(data);
    } catch (e) {
      console.error("Failed to load leaderboard stats:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  // Filter leaderboard by segment
  const getRankedList = (segment) => {
    return leaderboardData
      .filter(item => item.category === segment && item.submissions >= 1)
      .sort((a, b) => b.averageMileage - a.averageMileage);
  };

  // Find ranks for segment vehicles
  const getSegmentRank = (vehicleName, segment) => {
    const list = getRankedList(segment);
    const index = list.findIndex(item => item.vehicle.toLowerCase() === vehicleName.toLowerCase());
    return index !== -1 ? `#${index + 1}` : "N/A";
  };

  // Handle vehicle search
  const filteredSearchList = searchQuery.trim().length > 1
    ? leaderboardData.filter(item => 
        item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Fetch stats for specific vehicle
  const handleSelectVehicle = async (vehicle) => {
    setSelectedVehicle(vehicle);
    setLoadingStats(true);
    try {
      const stats = await fetchCommunityStats(vehicle.brand, vehicle.model, vehicle.fuelType);
      setSelectedVehicleStats(stats);
    } catch (e) {
      console.error("Failed to fetch vehicle stats:", e);
    } finally {
      setLoadingStats(false);
    }
  };

  // Community Verdict Logic (Phase 6)
  const generateCommunityVerdict = (stats, segment) => {
    if (!stats) return "Insufficient community data.";
    const city = stats.rideTypeStats["City Ride"] || 0;
    const hwy = stats.rideTypeStats["Highway Ride"] || 0;
    
    if (city > 0 && hwy > 0) {
      if (hwy > city * 1.22) {
        return "Performs best on highways. Highway cruise efficiency is outstanding.";
      }
      if (city >= hwy * 0.95) {
        return "Excellent city mileage. Handles stop-and-go city blocks efficiently.";
      }
    }
    
    // Segment comparison
    let segmentAvg = 15;
    if (segment === "Bike") segmentAvg = 45;
    else if (segment === "SUV") segmentAvg = 11;
    
    if (stats.overallAverage > segmentAvg * 1.15) {
      return "Outstanding efficiency for its segment. Extremely fuel-friendly!";
    }
    if (stats.overallAverage < segmentAvg * 0.85) {
      return "Below average for its segment. Squeezes pocket budgets.";
    }
    
    return "Balanced mileage performance across city traffic and highways.";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in text-left">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-250 pb-5">
        <div>
          <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase">Community Mileage Intelligence</h2>
          <p className="text-xs text-gray-500 mt-1">
            Real crowdsourced driver data aggregates. Free from manufacturer claim propaganda.
          </p>
        </div>
        
        <button 
          onClick={loadLeaderboard}
          disabled={loading}
          className="self-start md:self-auto p-2.5 border border-gray-300 hover:border-neutral-950 rounded-xl text-gray-500 hover:text-neutral-950 transition-all bg-white shadow-sm"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* SEARCH / DISCOVERY BAR */}
      <div className="relative max-w-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Search vehicle profiles (e.g. Activa 6G, Swift Diesel)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 typewriter-input text-xs"
          />
          <Search size={15} className="absolute left-3.5 top-3.5 text-gray-400" />
        </div>
        {searchQuery.trim().length > 1 && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden text-xs">
            <div className="bg-neutral-50 px-3 py-1.5 font-bold text-[9px] uppercase tracking-wider text-gray-400 border-b border-gray-150">
              Matched Vehicle Profiles
            </div>
            {filteredSearchList.length === 0 ? (
              <div className="p-4 text-center text-gray-400 italic">No matching vehicle profiles found</div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                {filteredSearchList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      handleSelectVehicle(item);
                      setSearchQuery("");
                    }}
                    className="px-4 py-3 flex justify-between items-center hover:bg-neutral-50 cursor-pointer"
                  >
                    <div>
                      <p className="font-extrabold text-neutral-900 uppercase">{item.vehicle}</p>
                      <span className="px-1.5 py-0.5 text-[8px] font-mono border rounded text-gray-500 bg-gray-50 uppercase">{item.category} • {item.fuelType}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-neutral-850">{item.averageMileage} {item.fuelType === "EV" ? "km/%" : "km/L"}</p>
                      <span className="text-[8px] text-gray-400 font-mono">{item.submissions} sheets</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedVehicle ? (
        /* VEHICLE INSIGHT PAGE (PHASE 6 & 8) */
        <div className="paper-sheet paper-stacked rounded-2xl p-6 md:p-10 space-y-8 bg-white border border-gray-200 shadow-xl">
          {/* Back button */}
          <button
            onClick={() => {
              setSelectedVehicle(null);
              setSelectedVehicleStats(null);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-gray-200 hover:border-neutral-950 rounded-lg text-xs font-bold text-gray-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to Rankings</span>
          </button>

          {loadingStats ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3 font-mono text-xs text-gray-400">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-neutral-800 animate-spin rounded-full"></div>
              <span>COMPILING VEHICLE INSIGHTS...</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="border-b border-gray-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] font-mono text-gray-450 uppercase tracking-widest">VEHICLE INTEL REPORT</span>
                  <h3 className="text-2xl font-black uppercase text-neutral-900 mt-1">{selectedVehicle.vehicle}</h3>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono border border-gray-200 text-gray-500 bg-gray-50 uppercase">{selectedVehicle.category}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono border border-gray-200 text-gray-500 bg-gray-50 uppercase">{selectedVehicle.fuelType}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono border border-amber-200 text-amber-800 bg-amber-50 uppercase font-black">
                      Segment Rank: {getSegmentRank(selectedVehicle.vehicle, selectedVehicle.category)}
                    </span>
                  </div>
                </div>

                <div className="bg-neutral-900 text-white p-4 rounded-xl text-center md:min-w-40 border border-black shadow-lg">
                  <span className="text-[9px] font-mono text-gray-400 block uppercase tracking-wide">Community Avg</span>
                  <p className="text-3xl font-black text-white mt-1">
                    {selectedVehicleStats?.overallAverage || selectedVehicle.averageMileage} 
                    <span className="text-xs font-bold block mt-1 text-accentGreen">
                      {selectedVehicle.fuelType === "EV" ? "km/% Battery" : "km/L (KMPL)"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Total Submissions</span>
                  <p className="text-xl font-black text-neutral-950 mt-1 flex items-center gap-1.5">
                    <BarChart2 size={16} className="text-gray-550" />
                    {selectedVehicleStats?.totalSubmissions || 0}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Total Contributors</span>
                  <p className="text-xl font-black text-neutral-950 mt-1 flex items-center gap-1.5">
                    <Users size={16} className="text-gray-550" />
                    {selectedVehicleStats?.totalUsers || 0}
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Reliability Level</span>
                  <p className="text-xl font-black text-neutral-950 mt-1 flex items-center gap-1.5">
                    <Shield size={16} className="text-gray-550" />
                    {selectedVehicleStats?.reliabilityLevel || "Low"} ({selectedVehicleStats?.averageConfidence || 30}/100)
                  </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Verified Spread</span>
                  <div className="mt-1.5 space-y-0.5 text-[10px] font-mono font-bold text-gray-700">
                    <p className="text-green-700">MAX: {selectedVehicleStats?.highestValid || 0}</p>
                    <p className="text-red-750">MIN: {selectedVehicleStats?.lowestValid || 0}</p>
                  </div>
                </div>
              </div>

              {/* Ride Type Breakdown */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center space-x-1.5 border-b border-gray-100 pb-3">
                  <Compass size={14} className="text-gray-400" />
                  <span>Ride Condition Breakdown</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["City Ride", "Highway Ride", "Mixed Ride"].map(type => {
                    const val = selectedVehicleStats?.rideTypeStats[type] || 0;
                    return (
                      <div key={type} className="bg-gray-50 border border-gray-200 p-3.5 rounded-lg text-center">
                        <span className="text-[9px] font-mono text-gray-400 uppercase block">{type}</span>
                        <p className="text-lg font-black text-neutral-900 mt-1">
                          {val > 0 ? `${val} ${selectedVehicle.fuelType === "EV" ? "km/%" : "km/L"}` : "N/A"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Community Verdict (Phase 6) */}
              <div className="bg-neutral-950 text-white rounded-xl p-6 border border-black shadow-inner space-y-2 relative overflow-hidden">
                <div className="absolute right-[-10px] bottom-[-15px] opacity-5 text-white pointer-events-none select-none">
                  <Star size={110} strokeWidth={4} />
                </div>
                <span className="text-[8px] font-mono tracking-widest text-accentGreen uppercase block">
                  🛡️ System Community Verdict
                </span>
                <p className="text-base font-extrabold italic leading-relaxed">
                  "{generateCommunityVerdict(selectedVehicleStats, selectedVehicle.category)}"
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* HOMEPAGE COMMUNITY LEADERBOARDS (PHASE 1 & 10) */
        <div className="paper-sheet paper-stacked rounded-2xl p-6 md:p-10 space-y-8 bg-white border border-gray-200 shadow-xl">
          {/* Document Header stamp */}
          <div className="border-b-2 border-double border-gray-200 pb-4 mb-2 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">RECORD CLASSIFICATION: PUBLIC</span>
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 mt-0.5 flex items-center space-x-1.5">
                <Trophy size={14} className="text-gray-500" />
                <span>VEHICLE SEGMENT INDEX</span>
              </h3>
            </div>
            <span className="text-[9px] font-mono border border-gray-200 px-2 py-0.5 rounded text-gray-450 bg-gray-50">
              COMMUNITY v2.0
            </span>
          </div>

          <div className="space-y-6">
            {/* Segment Selector Tabs */}
            <div className="flex bg-neutral-100 border border-gray-200 p-1 rounded-xl max-w-xs">
              {["Bike", "Car", "SUV"].map(segment => (
                <button
                  key={segment}
                  onClick={() => setActiveLeaderboardTab(segment)}
                  className={`flex-1 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                    activeLeaderboardTab === segment
                      ? "bg-neutral-950 text-white shadow-sm"
                      : "text-gray-500 hover:text-neutral-900"
                  }`}
                >
                  {segment === "Bike" ? "🏍️ Bikes" : segment === "Car" ? "🚗 Cars" : "🚙 SUVs"}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3 font-mono text-xs text-gray-400">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-neutral-800 animate-spin rounded-full"></div>
                <span>COMPILING SEGMENT RANKS...</span>
              </div>
            ) : getRankedList(activeLeaderboardTab).length === 0 ? (
              <div className="py-20 text-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs font-mono">
                [ No registry entries recorded for {activeLeaderboardTab}s ]
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="border-b border-gray-200 text-[9px] uppercase font-black text-gray-400 tracking-wider bg-gray-50">
                      <th className="py-3 pl-4">Rank</th>
                      <th className="py-3">Vehicle Model</th>
                      <th className="py-3">Engine Type</th>
                      <th className="py-3 text-center">Submissions</th>
                      <th className="py-3 text-right pr-4">Weighted Average</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-xs">
                    {getRankedList(activeLeaderboardTab).map((item, idx) => (
                      <tr 
                        key={idx} 
                        onClick={() => handleSelectVehicle(item)}
                        className="hover:bg-neutral-50 cursor-pointer transition-colors"
                      >
                        <td className="py-4 pl-4 font-black text-gray-400">
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                        </td>
                        <td className="py-4 font-bold text-neutral-900 uppercase">
                          {item.vehicle}
                        </td>
                        <td className="py-4">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono border border-gray-200 text-gray-500 bg-gray-50 uppercase">
                            {item.fuelType}
                          </span>
                        </td>
                        <td className="py-4 text-center font-mono font-bold text-gray-550">
                          {item.submissions} sheets
                        </td>
                        <td className="py-4 text-right pr-4 font-black text-neutral-900">
                          {item.averageMileage} <span className="text-[9px] text-gray-400 font-bold">{item.fuelType === "EV" ? "km/%" : "km/L"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
