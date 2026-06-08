import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../store/useStore";
import { 
  VEHICLE_DATABASE, 
  KERALA_DISTRICTS, 
  PERSONALITIES, 
  LANGUAGES, 
  calculateMileage, 
  findManufacturerClaim, 
  evaluateMileageRating, 
  getBadgeForCalculation 
} from "../utils/mileageEngine";
import { fetchCommunityStats } from "../utils/firebase";
import { getAIRoast } from "../utils/gemini";
import { Fuel, Sparkles, MessageCircle, ArrowRight } from "lucide-react";

export default function MileageForm() {
  const { 
    language, 
    setLanguage, 
    personalityMode, 
    setPersonalityMode, 
    setCurrentCalculation, 
    setReceiptOpen,
    addHistoryEntry
  } = useStore();

  // Form State
  const [vehicle, setVehicle] = useState("");
  const [fuelType, setFuelType] = useState("Petrol");
  const [distance, setDistance] = useState("");
  const [fuelFilled, setFuelFilled] = useState("");
  const [district, setDistrict] = useState("Ernakulam");
  const [loading, setLoading] = useState(false);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle vehicle input changes
  const handleVehicleChange = (e) => {
    const value = e.target.value;
    setVehicle(value);

    if (value.trim().length > 1) {
      const filtered = VEHICLE_DATABASE.filter(item => 
        item.model.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (item) => {
    setVehicle(item.model);
    setFuelType(item.type);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicle || !distance || !fuelFilled) return;

    setLoading(true);
    try {
      const mileage = calculateMileage(distance, fuelFilled, fuelType);
      const mfgClaimObj = findManufacturerClaim(vehicle);
      const manufacturerClaim = mfgClaimObj ? mfgClaimObj.claim : null;
      const communityStats = await fetchCommunityStats(vehicle);
      const communityAverage = communityStats ? communityStats.averageMileage : null;
      const rating = evaluateMileageRating(mileage, manufacturerClaim, fuelType);
      const badge = getBadgeForCalculation(rating, fuelType, mileage);
      
      const roastResponse = await getAIRoast({
        vehicle,
        mileage,
        manufacturerMileage: manufacturerClaim,
        communityAverage,
        personalityMode,
        language,
        fuelType
      });

      const entry = {
        vehicle,
        fuelType,
        distance: parseFloat(distance),
        fuelFilled: parseFloat(fuelFilled),
        district,
        mileage,
        rating,
        badgeName: badge.name,
        badgeEmoji: badge.emoji,
        badgeDesc: badge.desc,
        roast: roastResponse.roast,
        isAI: roastResponse.isAI
      };

      const savedEntry = await addHistoryEntry(entry);
      setCurrentCalculation(savedEntry);
      setReceiptOpen(true);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Calculation execution failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative pt-14 pb-4">
      
      {/* Skeuomorphic Clipboard Backplate */}
      <div className="absolute inset-0 bg-[#28292e] rounded-3xl shadow-2xl border-4 border-[#1c1d22] pointer-events-none"></div>

      {/* Realistic Clipboard Metal Clip */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-44 h-14 bg-gradient-to-b from-gray-100 to-gray-400 border border-gray-500 rounded-lg shadow-md flex items-center justify-center z-20">
        {/* Metal clamp plate */}
        <div className="w-full h-full relative flex items-center justify-center">
          {/* Bolts */}
          <div className="absolute left-4 w-3 h-3 rounded-full bg-zinc-600 shadow-inner border border-zinc-700"></div>
          <div className="absolute right-4 w-3 h-3 rounded-full bg-zinc-600 shadow-inner border border-zinc-700"></div>
          {/* Clip grip lines */}
          <div className="w-20 h-4 border-t border-b border-gray-600/30 flex justify-between px-2">
            <div className="w-1 h-full bg-gray-500/20"></div>
            <div className="w-1 h-full bg-gray-500/20"></div>
            <div className="w-1 h-full bg-gray-500/20"></div>
          </div>
          {/* Rubber grip under clamp */}
          <div className="absolute bottom-0 w-36 h-1 bg-zinc-900 rounded-b"></div>
        </div>
      </div>

      {/* Main Clipped Lined Sheet of Paper */}
      <form 
        onSubmit={handleSubmit} 
        className="relative z-10 paper-sheet paper-stacked rounded-2xl mx-5 my-5 p-8 md:p-12 space-y-7 bg-[#fbfbf9] text-left text-neutral-800"
      >
        
        {/* Document Header stamp */}
        <div className="border-b-2 border-double border-gray-300 pb-4 mb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight flex items-center space-x-1.5">
              <Fuel size={16} className="text-gray-500" />
              <span>CALCULATION REPORT</span>
            </h2>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">FORM NO: MU-1029/KERALA</p>
          </div>
          <div className="text-right">
            <span className="inline-block border border-red-300 text-red-600 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded rotate-2 tracking-wider bg-red-50/50">
              Official
            </span>
          </div>
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Vehicle Autocomplete */}
          <div className="relative text-left" ref={dropdownRef}>
            <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
              1. Vehicle Brand / Model
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Maruti Swift, Tata Nexon..."
              value={vehicle}
              onChange={handleVehicleChange}
              onFocus={() => vehicle.trim().length > 1 && setShowSuggestions(true)}
              className="w-full typewriter-input text-xs"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden">
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectSuggestion(item)}
                    className="px-4 py-2.5 text-xs text-left text-gray-700 hover:bg-neutral-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-bold">{item.model}</span> 
                    <span className="text-[10px] text-gray-500 ml-2">({item.type})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fuel selection tabs */}
          <div className="text-left">
            <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
              2. Engine Fuel Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["Petrol", "Diesel", "CNG", "EV"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFuelType(type)}
                  className={`py-2 text-[10px] font-bold rounded-lg border transition-all duration-200 ${
                    fuelType === type
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white border-gray-300 text-gray-500 hover:text-black hover:border-gray-500"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Run */}
          <div className="text-left">
            <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
              3. Odometer Trip Distance
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full typewriter-input text-xs"
              />
              <span className="absolute right-3.5 top-3 text-[10px] font-mono font-bold text-gray-400">KM</span>
            </div>
          </div>

          {/* Fuel filled quantity */}
          <div className="text-left">
            <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
              4. {fuelType === "EV" ? "Battery Consumed" : "Fuel Filled Quantity"}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={fuelFilled}
                onChange={(e) => setFuelFilled(e.target.value)}
                className="w-full typewriter-input text-xs"
              />
              <span className="absolute right-3.5 top-3 text-[10px] font-mono font-bold text-gray-400">
                {fuelType === "EV" ? "PERCENT (%)" : "LITRES (L)"}
              </span>
            </div>
          </div>

          {/* District selector */}
          <div className="text-left">
            <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
              5. Regional District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full bg-white border border-gray-300 border-b-2 border-b-gray-400 rounded-md px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-accentBlack"
            >
              {KERALA_DISTRICTS.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Personality selection */}
        <div className="text-left space-y-2 pt-2 border-t border-dashed border-gray-200">
          <label className="block text-[10px] font-extrabold text-neutral-500 mb-1 uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={13} className="text-gray-400" />
            <span>6. Select Auditor Stereotype</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PERSONALITIES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPersonalityMode(p.id)}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all duration-200 ${
                  personalityMode === p.id
                    ? "bg-neutral-50 border-neutral-900 ring-1 ring-neutral-900"
                    : "bg-white border-gray-200 text-gray-500 hover:text-black hover:border-gray-400"
                }`}
              >
                <span className="text-[10px] font-bold tracking-tight text-neutral-900">{p.label}</span>
                <span className="text-[8px] text-gray-400 leading-snug mt-1.5 line-clamp-2">
                  {p.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Output Language */}
        <div className="text-left space-y-2 pt-2 border-t border-dashed border-gray-200">
          <label className="block text-[10px] font-extrabold text-neutral-500 mb-1 uppercase tracking-wider flex items-center space-x-1.5">
            <MessageCircle size={13} className="text-gray-400" />
            <span>7. Document Translation</span>
          </label>
          <div className="flex space-x-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setLanguage(lang.id)}
                className={`px-4 py-2 text-[10px] font-extrabold rounded-lg border transition-all duration-200 ${
                  language === lang.id
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white border-gray-200 text-gray-500 hover:text-black hover:border-gray-400"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit seal stamp button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !vehicle || !distance || !fuelFilled}
            className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                <span>AUDITING MILEAGE RECORDS...</span>
              </>
            ) : (
              <>
                <span>STAMP & CALCULATE MILEAGE</span>
                <ArrowRight size={14} className="ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
