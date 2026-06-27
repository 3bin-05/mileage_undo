// Predefined Indian vehicles list for seeding and fuzzy matches
export const VEHICLE_DATABASE = [
  // Toyota
  { brand: "toyota", model: "glanza", claim: 22.35, type: "Petrol", segment: "Car" },
  { brand: "toyota", model: "urban cruiser hyryder petrol", claim: 21.12, type: "Petrol", segment: "SUV" },
  { brand: "toyota", model: "urban cruiser hyryder hybrid", claim: 27.97, type: "Petrol", segment: "SUV" },
  { brand: "toyota", model: "innova hycross hybrid", claim: 23.24, type: "Petrol", segment: "SUV" },
  { brand: "toyota", model: "fortuner diesel", claim: 14.4, type: "Diesel", segment: "SUV" },
  { brand: "toyota", model: "rumion", claim: 20.51, type: "Petrol", segment: "SUV" },
  { brand: "toyota", model: "camry hybrid", claim: 25.49, type: "Petrol", segment: "Car" },

  // Maruti Suzuki
  { brand: "maruti suzuki", model: "swift", claim: 24.8, type: "Petrol", segment: "Car" },
  { brand: "maruti suzuki", model: "dzire", claim: 25.71, type: "Petrol", segment: "Car" },
  { brand: "maruti suzuki", model: "baleno", claim: 22.94, type: "Petrol", segment: "Car" },
  { brand: "maruti suzuki", model: "fronx", claim: 21.79, type: "Petrol", segment: "SUV" },
  { brand: "maruti suzuki", model: "brezza", claim: 19.89, type: "Petrol", segment: "SUV" },
  { brand: "maruti suzuki", model: "wagonr", claim: 24.35, type: "Petrol", segment: "Car" },
  { brand: "maruti suzuki", model: "celerio", claim: 26.68, type: "Petrol", segment: "Car" },
  { brand: "maruti suzuki", model: "ertiga", claim: 20.51, type: "Petrol", segment: "SUV" },
  { brand: "maruti suzuki", model: "grand vitara hybrid", claim: 27.97, type: "Petrol", segment: "SUV" },

  // Kia
  { brand: "kia", model: "sonet petrol", claim: 18.4, type: "Petrol", segment: "SUV" },
  { brand: "kia", model: "sonet diesel", claim: 24.1, type: "Diesel", segment: "SUV" },
  { brand: "kia", model: "seltos petrol", claim: 17.9, type: "Petrol", segment: "SUV" },
  { brand: "kia", model: "seltos diesel", claim: 20.7, type: "Diesel", segment: "SUV" },
  { brand: "kia", model: "carens petrol", claim: 16.8, type: "Petrol", segment: "SUV" },
  { brand: "kia", model: "carens diesel", claim: 21.3, type: "Diesel", segment: "SUV" },
  { brand: "kia", model: "syros petrol", claim: 18.2, type: "Petrol", segment: "SUV" },

  // Nissan
  { brand: "nissan", model: "magnite petrol", claim: 19.9, type: "Petrol", segment: "SUV" },
  { brand: "nissan", model: "magnite turbo", claim: 20.0, type: "Petrol", segment: "SUV" },
  { brand: "nissan", model: "x-trail", claim: 13.7, type: "Petrol", segment: "SUV" },

  // MG
  { brand: "mg", model: "comet ev", claim: 7.5, type: "EV", segment: "Car" },
  { brand: "mg", model: "astor petrol", claim: 15.4, type: "Petrol", segment: "SUV" },
  { brand: "mg", model: "hector petrol", claim: 13.8, type: "Petrol", segment: "SUV" },
  { brand: "mg", model: "hector diesel", claim: 17.4, type: "Diesel", segment: "SUV" },
  { brand: "mg", model: "gloster diesel", claim: 13.9, type: "Diesel", segment: "SUV" },
  { brand: "mg", model: "windsor ev", claim: 6.5, type: "EV", segment: "SUV" },
  { brand: "mg", model: "zs ev", claim: 4.1, type: "EV", segment: "SUV" },

  // Renault
  { brand: "renault", model: "kwid", claim: 22.3, type: "Petrol", segment: "Car" },
  { brand: "renault", model: "triber", claim: 19.0, type: "Petrol", segment: "Car" },
  { brand: "renault", model: "kiger petrol", claim: 20.5, type: "Petrol", segment: "SUV" },
  { brand: "renault", model: "kiger turbo", claim: 19.03, type: "Petrol", segment: "SUV" },

  // Bikes
  { brand: "honda", model: "activa 6g", claim: 48.0, type: "Petrol", segment: "Bike" },
  { brand: "hero", model: "splendor plus", claim: 70.0, type: "Petrol", segment: "Bike" },
  { brand: "royal enfield", model: "classic 350", claim: 35.0, type: "Petrol", segment: "Bike" },
  { brand: "yamaha", model: "r15", claim: 45.0, type: "Petrol", segment: "Bike" },
  { brand: "tvs", model: "apache rtr 160", claim: 45.0, type: "Petrol", segment: "Bike" },
  { brand: "bajaj", model: "pulsar 150", claim: 50.0, type: "Petrol", segment: "Bike" },
  { brand: "suzuki", model: "access 125", claim: 48.0, type: "Petrol", segment: "Bike" }
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

// Phase 4: Validation Limits
export const MILEAGE_LIMITS = {
  Bike: { min: 20, max: 120 },
  Car: { min: 5, max: 40 },
  SUV: { min: 4, max: 30 }
};

/**
 * Check if the calculated mileage is within realistic segment bounds.
 * EV exception: we check alternative bounds for EV consumption (e.g. 0.5 to 15 km/%)
 */
export const isMileageRealistic = (mileage, segment, fuelType) => {
  const normSeg = (segment || "").toLowerCase();
  const limits = normSeg === "bike" ? MILEAGE_LIMITS.Bike 
               : normSeg === "suv" ? MILEAGE_LIMITS.SUV 
               : MILEAGE_LIMITS.Car;

  if (fuelType && fuelType.toLowerCase() === "ev") {
    return mileage >= 0.5 && mileage <= 15.0;
  }
  return mileage >= limits.min && mileage <= limits.max;
};

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

  const rawMileage = dist / fuel;
  return parseFloat(rawMileage.toFixed(2));
};

/**
 * Look up manufacturer mileage claim for a vehicle name (fuzzy matching brand + model)
 */
export const findManufacturerClaim = (vehicleName) => {
  if (!vehicleName) return null;
  const nameLower = vehicleName.trim().toLowerCase();
  
  const match = VEHICLE_DATABASE.find(item => {
    const fullName = `${item.brand} ${item.model}`.toLowerCase();
    return fullName.includes(nameLower) || nameLower.includes(fullName) || nameLower.includes(item.model.toLowerCase());
  });
  
  return match ? match : null;
};

/**
 * Categorize the mileage based on how close it is to manufacturer claim
 */
export const evaluateMileageRating = (mileage, manufacturerClaim, fuelType) => {
  const mfg = parseFloat(manufacturerClaim);
  
  // If we don't know the manufacturer claim, use default benchmarks
  if (!mfg || isNaN(mfg)) {
    if (fuelType && fuelType.toLowerCase() === "ev") {
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
  const isEv = fuelType && fuelType.toLowerCase() === "ev";
  if (isEv) {
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

// Phase 4: Outlier Detection
export const detectOutlier = (mileage, existingEntries) => {
  if (!existingEntries || existingEntries.length < 3) {
    return false; // Not enough submissions to determine standard deviation
  }

  const mileages = existingEntries
    .map(e => parseFloat(e.mileage))
    .filter(m => !isNaN(m) && m > 0);

  if (mileages.length < 3) return false;

  const mean = mileages.reduce((sum, val) => sum + val, 0) / mileages.length;
  const variance = mileages.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / mileages.length;
  const stdDev = Math.sqrt(variance);

  // If standard deviation is extremely low, fallback to percentage-based check
  if (stdDev < 0.5) {
    return Math.abs(mileage - mean) > (mean * 0.3); // Suspicious if it deviates by > 30%
  }

  // Suspicious if it lies outside 2.5 standard deviations
  return Math.abs(mileage - mean) > 2.5 * stdDev;
};

// Phase 5: Confidence Score System
export const calculateConfidenceScore = (validEntriesCount, isVerified = false) => {
  if (isVerified) return 100;
  if (validEntriesCount >= 20) return 90;
  if (validEntriesCount >= 10) return 70;
  if (validEntriesCount >= 5) return 50;
  return 30; // Default new user score
};

// Phase 5: Weighted Community Average
export const calculateWeightedAverage = (entries) => {
  const validEntries = entries.filter(e => e && !e.isSuspicious && !isNaN(e.mileage) && e.mileage > 0);
  if (validEntries.length === 0) return 0;

  let totalWeightedMileage = 0;
  let totalWeight = 0;

  validEntries.forEach(e => {
    const weight = e.confidenceScore !== undefined ? e.confidenceScore : 30;
    totalWeightedMileage += parseFloat(e.mileage) * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? parseFloat((totalWeightedMileage / totalWeight).toFixed(2)) : 0;
};

// Phase 7: Mileage Health Score
export const calculateHealthScore = (userMileage, communityAverage, segment) => {
  let baseline = communityAverage;
  if (!baseline || isNaN(baseline) || baseline <= 0) {
    // Fallbacks
    const normSeg = (segment || "").toLowerCase();
    if (normSeg === "bike") baseline = 45;
    else if (normSeg === "suv") baseline = 12;
    else baseline = 15; // Car
  }
  
  const score = (userMileage / baseline) * 100;
  return Math.min(150, parseFloat(score.toFixed(0)));
};

export const getHealthRating = (healthScore) => {
  if (healthScore >= 95) return "Excellent";
  if (healthScore >= 80) return "Good";
  if (healthScore >= 60) return "Average";
  return "Needs Attention";
};

// Phase 7: Fun Verdict System
export const getFunVerdict = (healthScore, rating) => {
  const verdicts = {
    Excellent: [
      "You're beating the community average. Splendor range driver! Pennu tharan ninte achan happy aakum.",
      "Beating the average! Ambani wants to know ninte location, pullikku nashtamaanu mone.",
      "Kidu driving, beating community average! Aathira kuttiye njan ninte kalyanathinayi aalochikkam."
    ],
    Good: [
      "Good driving, but Ammavan thinks you could save 2 kmpl more by turning off the AC on downhills.",
      "Ammavan approves! But says gear shifts could be 0.5 seconds faster.",
      "Good score. Pakshe side mirror madakki vechal wind resistance kuranju 1 kmpl kooduthal kittum."
    ],
    Average: [
      "Ammavan says check tyre pressure. Standard driver, neither saving nor wasting.",
      "Average driving. Next signal-il oru KSRTC bus kareri pokum mone, shradhikk.",
      "Not bad. Pakshe block-il engine off aakkiyal achanu 10 rupa extra savings kittiyeene."
    ],
    "Needs Attention": [
      "Ammavan thinks this vehicle deserves a service immediately. Engine crying, please check!",
      "Ammavan says check tyre pressure or clean air filter. Are you sponsoring the pump owner?",
      "Needs attention! Gear shifts are grittier than local parotta, change driving style!"
    ]
  };
  
  const list = verdicts[rating] || verdicts["Average"];
  const randIndex = Math.floor(Math.random() * list.length);
  return list[randIndex];
};
