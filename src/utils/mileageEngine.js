// Popular Indian vehicles with manufacturer mileage claims (in kmpl)
export const VEHICLE_DATABASE = [
  { model: "Maruti Suzuki Alto 800", claim: 22.05, type: "Petrol" },
  { model: "Maruti Suzuki Swift", claim: 22.38, type: "Petrol" },
  { model: "Maruti Suzuki Baleno", claim: 22.35, type: "Petrol" },
  { model: "Maruti Suzuki Wagon R", claim: 24.35, type: "Petrol" },
  { model: "Maruti Suzuki Dzire", claim: 22.41, type: "Petrol" },
  { model: "Maruti Suzuki Brezza", claim: 17.38, type: "Petrol" },
  { model: "Maruti Suzuki Ertiga", claim: 20.51, type: "Petrol" },
  { model: "Maruti Suzuki Grand Vitara", claim: 27.97, type: "Petrol" }, // Hybrid
  { model: "Hyundai Grand i10 Nios", claim: 20.70, type: "Petrol" },
  { model: "Hyundai i20", claim: 20.35, type: "Petrol" },
  { model: "Hyundai Creta", claim: 18.00, type: "Petrol" },
  { model: "Hyundai Verna", claim: 19.60, type: "Petrol" },
  { model: "Hyundai Venue", claim: 17.50, type: "Petrol" },
  { model: "Tata Punch", claim: 18.82, type: "Petrol" },
  { model: "Tata Nexon", claim: 17.44, type: "Petrol" },
  { model: "Tata Altroz", claim: 18.50, type: "Petrol" },
  { model: "Tata Tiago", claim: 19.01, type: "Petrol" },
  { model: "Tata Harrier", claim: 14.60, type: "Diesel" },
  { model: "Mahindra Thar", claim: 15.20, type: "Diesel" },
  { model: "Mahindra Scorpio-N", claim: 14.00, type: "Diesel" },
  { model: "Mahindra XUV700", claim: 12.00, type: "Petrol" },
  { model: "Mahindra Bolero", claim: 16.00, type: "Diesel" },
  { model: "Toyota Innova Crysta", claim: 11.50, type: "Diesel" },
  { model: "Toyota Innova Hycross", claim: 23.24, type: "Petrol" }, // Hybrid
  { model: "Toyota Fortuner", claim: 10.00, type: "Diesel" },
  { model: "Toyota Glanza", claim: 22.35, type: "Petrol" },
  { model: "Honda City", claim: 17.80, type: "Petrol" },
  { model: "Honda Amaze", claim: 18.60, type: "Petrol" },
  { model: "Volkswagen Polo", claim: 17.21, type: "Petrol" },
  { model: "Volkswagen Virtus", claim: 19.40, type: "Petrol" },
  { model: "Skoda Slavia", claim: 19.47, type: "Petrol" },
  { model: "Skoda Kushaq", claim: 18.09, type: "Petrol" },
  // EV Section (calculated in km per % battery, default claim translated roughly: 1% battery = 3.5km)
  { model: "Tata Nexon EV", claim: 3.50, type: "EV" },
  { model: "MG ZS EV", claim: 4.10, type: "EV" },
  { model: "BYD Atto 3", claim: 4.80, type: "EV" },
  { model: "Tiago EV", claim: 2.80, type: "EV" }
];

export const KERALA_DISTRICTS = [
  "Alappuzha",
  "Ernakulam",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Thiruvananthapuram",
  "Thrissur",
  "Wayanad"
];

export const PERSONALITIES = [
  { id: "Ammavan Mode", label: "Ammavan Mode (Uncle) 🧔", description: "Wants you to turn off AC and drive at 40 kmph like your neighbor's son." },
  { id: "Driving Instructor Mode", label: "Instructor Mode 🛑", description: "Yells at you for clutch riding and gear grinding." },
  { id: "Petrol Pump Owner Mode", label: "Petrol Pump Owner ⛽", description: "Loves your fuel drinking vehicle. Treats you like a VIP." },
  { id: "KSRTC Driver Mode", label: "KSRTC Driver 🚌", description: "Thinks even his 10-ton bus gives better mileage than you." },
  { id: "Thrissur Ammavan Mode", label: "Thrissur Gedi 🐘", description: "Speaks Thrissur slang, brags about old Ambassador." },
  { id: "Mechanic Mode", label: "Mechanic Suku 🔧", description: "Explains how your engine is crying and lists repair costs." }
];

export const LANGUAGES = [
  { id: "Malayalam", label: "Malayalam ✍️" },
  { id: "Manglish", label: "Manglish 🔤" },
  { id: "English", label: "English 🇬🇧" }
];

/**
 * Perform basic mileage calculations.
 * For normal fuel: km / Litres
 * For EV: km / Battery %
 */
export const calculateMileage = (distance, fuelFilled) => {
  const dist = parseFloat(distance);
  const fuel = parseFloat(fuelFilled);

  if (isNaN(dist) || isNaN(fuel) || dist <= 0 || fuel <= 0) {
    return 0;
  }

  // Mileage is simple distance over fuel quantity (or percentage for EV)
  const rawMileage = dist / fuel;
  return parseFloat(rawMileage.toFixed(2));
};

/**
 * Look up manufacturer mileage claim for a vehicle name
 */
export const findManufacturerClaim = (vehicleName) => {
  if (!vehicleName) return null;
  const nameLower = vehicleName.trim().toLowerCase();
  
  const match = VEHICLE_DATABASE.find(item => 
    item.model.toLowerCase().includes(nameLower) ||
    nameLower.includes(item.model.toLowerCase())
  );
  
  return match ? match : null;
};

/**
 * Categorize the mileage based on how close it is to manufacturer claim
 */
export const evaluateMileageRating = (mileage, manufacturerClaim, fuelType) => {
  const mfg = parseFloat(manufacturerClaim);
  
  // If we don't know the manufacturer claim, use default benchmarks
  if (!mfg || isNaN(mfg)) {
    if (fuelType === "EV") {
      if (mileage >= 4.0) return "Excellent";
      if (mileage >= 3.0) return "Good";
      if (mileage >= 2.2) return "Average";
      if (mileage >= 1.5) return "Poor";
      return "Catastrophic";
    } else {
      if (mileage >= 22.0) return "Excellent";
      if (mileage >= 16.0) return "Good";
      if (mileage >= 12.0) return "Average";
      if (mileage >= 8.0) return "Poor";
      return "Catastrophic";
    }
  }

  const ratio = mileage / mfg;

  if (ratio >= 0.95) return "Excellent";
  if (ratio >= 0.80) return "Good";
  if (ratio >= 0.60) return "Average";
  if (ratio >= 0.40) return "Poor";
  return "Catastrophic";
};

/**
 * Assign Gamification badges / ranks
 */
export const getBadgeForCalculation = (rating, fuelType) => {
  if (fuelType === "EV") {
    if (rating === "Excellent") return { name: "Green Wizard ⚡", emoji: "🧙‍♂️", desc: "Squeezing every meter out of those electrons." };
    if (rating === "Good") return { name: "Silent Commuter 🔇", emoji: "🚗", desc: "Efficient, silent, and responsible." };
    if (rating === "Average") return { name: "Grid Consumer 🔌", emoji: "🔋", desc: "Just charging and driving, average life." };
    if (rating === "Poor") return { name: "Coal Powered 💨", emoji: "🏭", desc: "Your carbon footprint is higher than a diesel truck." };
    return { name: "Battery Bleeder 💥", emoji: "💀", desc: "Did you leave the AC on with doors open in Kochi heat?" };
  } else {
    if (rating === "Excellent") return { name: "Mileage King 👑", emoji: "👑", desc: "You deserve a medal from the President of Maruti." };
    if (rating === "Good") return { name: "Responsible Ammavan 🧔", emoji: "🧔", desc: "Perfect gear shifts, AC turned off on downhill slopes." };
    if (rating === "Average") return { name: "Daily Commuter 💼", emoji: "🚗", desc: "Neither saving the planet nor funding the oil companies." };
    if (rating === "Poor") return { name: "Gulf Return Driver 🏎️", emoji: "🏎️", desc: "Driving a Swift like it's a V8 Patrol in Dubai desert." };
    return { name: "Reliance Shareholder 💀", emoji: "💀", desc: "Ambani personally calls to thank you for buying petrol." };
  }
};
