import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../store/useStore";
import { 
  VEHICLE_DATABASE, 
  PERSONALITIES, 
  LANGUAGES, 
  calculateMileage, 
  findManufacturerClaim, 
  evaluateMileageRating, 
  getBadgeForCalculation,
  isMileageRealistic,
  detectOutlier,
  calculateConfidenceScore,
  calculateHealthScore,
  getHealthRating,
  getFunVerdict
} from "../utils/mileageEngine";
import { fetchCommunityStats } from "../utils/firebase";
import { getAIRoast } from "../utils/gemini";
import { Fuel, Sparkles, MessageCircle, ArrowRight, AlertTriangle, Info } from "lucide-react";

export default function MileageForm() {
  const { 
    language, 
    setLanguage, 
    personalityMode, 
    setPersonalityMode, 
    setCurrentCalculation, 
    setReceiptOpen,
    addHistoryEntry,
    history
  } = useStore();

  // Form State
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("Car"); // "Bike" | "Car" | "SUV"
  const [fuelType, setFuelType] = useState("Petrol");
  const [distance, setDistance] = useState("");
  const [fuelFilled, setFuelFilled] = useState("");
  const [rideType, setRideType] = useState("Mixed Ride"); // "City Ride" | "Highway Ride" | "Mixed Ride"
  const [loading, setLoading] = useState(false);

  // Unrealistic warning modal state
  const [warningMessage, setWarningMessage] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);

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

  // Handle autocomplete matching when user types model or brand
  const handleModelChange = (e) => {
    const value = e.target.value;
    setModel(value);

    if (value.trim().length > 1) {
      const filtered = VEHICLE_DATABASE.filter(item => 
        item.model.toLowerCase().includes(value.toLowerCase()) ||
        item.brand.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (item) => {
    setBrand(item.brand);
    setModel(item.model);
    setCategory(item.segment);
    setFuelType(item.type);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalDistance = parseFloat(distance);
    const finalFuelFilled = parseFloat(fuelFilled);
    const vehicleName = `${brand.trim()} ${model.trim()}`.trim();

    if (!brand.trim() || !model.trim() || isNaN(finalDistance) || isNaN(finalFuelFilled) || finalDistance <= 0 || finalFuelFilled <= 0) {
      alert("Please verify all input values. Trip distance and fuel quantity must be positive numbers.");
      return;
    }

    const mileage = calculateMileage(finalDistance, finalFuelFilled);

    // Phase 4: Range Validation
    if (!isMileageRealistic(mileage, category, fuelType)) {
      setWarningMessage(`This mileage (${mileage} ${fuelType === "EV" ? "km/%" : "km/L"}) appears unrealistic for a ${category}. Please verify your inputs.`);
      setShowWarningModal(true);
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch community statistics for outlier detection and health score
      const communityStats = await fetchCommunityStats(brand, model, fuelType);
      const communityAverage = communityStats ? communityStats.overallAverage : 0;
      const rawCommunityEntries = communityStats ? communityStats.rawEntries : [];

      // 2. Outlier Detection (Phase 4)
      const isSuspicious = detectOutlier(mileage, rawCommunityEntries);

      // 3. User History valid count for Confidence Score (Phase 5)
      const validHistoryCount = history.filter(item => item && !item.isSuspicious).length;
      const confidenceScore = calculateConfidenceScore(validHistoryCount);

      // 4. Mileage Health Score (Phase 7)
      const healthScore = calculateHealthScore(mileage, communityAverage, category);
      const healthRating = getHealthRating(healthScore);
      const healthVerdict = getFunVerdict(healthScore, healthRating);

      // 5. Baselines for Roasting
      const mfgClaimObj = findManufacturerClaim(vehicleName);
      const manufacturerClaim = mfgClaimObj ? mfgClaimObj.claim : null;
      const rating = evaluateMileageRating(mileage, manufacturerClaim, fuelType);
      const badge = getBadgeForCalculation(rating, fuelType);
      
      const roastResponse = await getAIRoast({
        vehicle: vehicleName,
        mileage,
        manufacturerMileage: manufacturerClaim,
        communityAverage: communityAverage || manufacturerClaim,
        personalityMode,
        language,
        fuelType
      });

      const entry = {
        vehicle: vehicleName,
        vehicleBrand: brand.trim(),
        vehicleModel: model.trim(),
        vehicleCategory: category,
        fuelType,
        distance: finalDistance,
        fuelFilled: finalFuelFilled,
        rideType,
        mileage,
        rating,
        badgeName: badge.name,
        badgeEmoji: badge.emoji,
        badgeDesc: badge.desc,
        roast: roastResponse.roast,
        isAI: roastResponse.isAI,
        confidenceScore,
        isSuspicious,
        healthScore,
        healthRating,
        healthVerdict
      };

      const savedEntry = await addHistoryEntry(entry);
      setCurrentCalculation(savedEntry);
      setReceiptOpen(true);

      // Reset distance and fuel
      setDistance("");
      setFuelFilled("");
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
        <div className="w-full h-full relative flex items-center justify-center">
          <div className="absolute left-4 w-3 h-3 rounded-full bg-zinc-600 shadow-inner border border-zinc-700"></div>
          <div className="absolute right-4 w-3 h-3 rounded-full bg-zinc-600 shadow-inner border border-zinc-700"></div>
          <div className="w-20 h-4 border-t border-b border-gray-600/30 flex justify-between px-2">
            <div className="w-1 h-full bg-gray-500/20"></div>
            <div className="w-1 h-full bg-gray-500/20"></div>
            <div className="w-1 h-full bg-gray-500/20"></div>
          </div>
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
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mt-0.5">FORM NO: MU-2.0/VEHICLE-INTELLIGENCE</p>
          </div>
          <div className="text-right">
            <span className="inline-block border border-red-300 text-red-600 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded rotate-2 tracking-wider bg-red-50/50">
              Community V2
            </span>
          </div>
        </div>

        {/* Vehicle Identity Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand */}
          <div className="text-left">
            <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
              1. Vehicle Brand
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Honda, Maruti Suzuki, Hero..."
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full typewriter-input text-xs"
            />
          </div>

          {/* Model Autocomplete */}
          <div className="relative text-left" ref={dropdownRef}>
            <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
              2. Vehicle Model
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Swift, Activa 6G, Splendor..."
              value={model}
              onChange={handleModelChange}
              onFocus={() => model.trim().length > 1 && setShowSuggestions(true)}
              className="w-full typewriter-input text-xs"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-xl overflow-hidden">
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectSuggestion(item)}
                    className="px-4 py-2.5 text-xs text-left text-gray-700 hover:bg-neutral-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-bold">{item.brand} {item.model}</span> 
                    <span className="text-[10px] text-gray-500 ml-2">({item.segment})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Segment selection */}
          <div className="text-left">
            <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
              3. Vehicle Segment
            </label>
            <div className="grid grid-cols-3 gap-1 bg-neutral-200/50 p-1 rounded-xl border border-gray-200">
              {["Bike", "Car", "SUV"].map((seg) => (
                <button
                  key={seg}
                  type="button"
                  onClick={() => setCategory(seg)}
                  className={`py-1.5 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                    category === seg
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "text-gray-500 hover:text-neutral-900"
                  }`}
                >
                  {seg === "Bike" ? "🏍️ Bike" : seg === "Car" ? "🚗 Car" : "🚙 SUV"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Engine and Ride Type Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-dashed border-gray-250">
          {/* Fuel selection tabs */}
          <div className="text-left">
            <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
              4. Fuel Classification
            </label>
            <div className="grid grid-cols-4 gap-2">
              {["Petrol", "Diesel", "CNG", "EV"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFuelType(type)}
                  className={`py-2 text-[10px] font-bold rounded-lg border transition-all duration-200 cursor-pointer ${
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

          {/* Ride Type selection */}
          <div className="text-left">
            <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
              5. Driving Conditions (Ride Type)
            </label>
            <div className="grid grid-cols-3 gap-1 bg-neutral-200/50 p-1 rounded-xl border border-gray-200">
              {["City Ride", "Highway Ride", "Mixed Ride"].map((ride) => (
                <button
                  key={ride}
                  type="button"
                  onClick={() => setRideType(ride)}
                  className={`py-1.5 text-[9px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                    rideType === ride
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "text-gray-500 hover:text-neutral-900"
                  }`}
                >
                  {ride.split(" ")[0]}
                </button>
              ))}
            </div>
            <p className="text-[8px] font-mono text-gray-400 mt-1 uppercase">
              {rideType === "City Ride" && "🌆 Heavy traffic & frequent starts/stops"}
              {rideType === "Highway Ride" && "🛣️ Long continuous high gear cruising"}
              {rideType === "Mixed Ride" && "🔄 Combined highway and street traffic"}
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-dashed border-gray-250">
          {/* Distance Run */}
          <div className="text-left">
            <label className="block text-[10px] font-extrabold text-neutral-500 mb-1.5 uppercase tracking-wider">
              6. Distance Travelled
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
              7. {fuelType === "EV" ? "Battery Consumed" : "Fuel Filled Quantity"}
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
        </div>

        {/* Personality selection */}
        <div className="text-left space-y-2 pt-2 border-t border-dashed border-gray-200">
          <label className="block text-[10px] font-extrabold text-neutral-500 mb-1 uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles size={13} className="text-gray-400" />
            <span>8. Select Auditor Stereotype</span>
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
            <span>9. Document Translation</span>
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
            disabled={loading || !brand || !model || !distance || !fuelFilled}
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

      {/* Unrealistic Mileage Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-amber-500 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-500">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-sm font-black uppercase text-neutral-900 tracking-tight">Unrealistic Entry Detected</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {warningMessage}
            </p>
            <div className="p-3 bg-neutral-100 border border-gray-200 rounded-xl text-left text-[9px] font-mono text-gray-500 space-y-1">
              <p className="font-bold text-neutral-700 flex items-center gap-1">
                <Info size={10} /> Allowed Ranges:
              </p>
              <p>🏍️ Bikes: 20 – 120 km/L</p>
              <p>🚗 Cars: 5 – 40 km/L</p>
              <p>🚙 SUVs: 4 – 30 km/L</p>
              <p>⚡ EVs: 0.5 – 15 km/%</p>
            </div>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
            >
              Verify inputs & edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
