import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signOut as fbSignOut 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { findManufacturerClaim } from "./mileageEngine";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase is fully configured via environment variables
export const isFirebaseConfigured = 
  !!firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "" && 
  firebaseConfig.apiKey !== "undefined" && 
  !firebaseConfig.apiKey.includes("YOUR_");

let app;
let auth;
let db;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

// --- Unified Database Services (transparent Firestore vs LocalStorage Fallback) ---

// Save a mileage log entry
export const saveMileageEntry = async (userId, entry) => {
  const logData = {
    ...entry,
    userId: userId || "anonymous",
    timestamp: new Date().toISOString(),
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
    // Phase 9: Future-ready architecture placeholders
    fuelBillOcr: entry.fuelBillOcr || null,
    odometerPhotoUrl: entry.odometerPhotoUrl || null,
    isVerified: entry.isVerified || false,
    acTracking: entry.acTracking || null,
    passengerCount: entry.passengerCount || null,
    vehicleAge: entry.vehicleAge || null,
    fuelPriceHistory: entry.fuelPriceHistory || null,
    regionalAnalysis: entry.regionalAnalysis || null
  };

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, "mileage_entries"), logData);
      return { id: docRef.id, ...logData };
    } catch (error) {
      console.error("Error saving entry to Firestore:", error);
      // fallback to local storage on Firestore write error
    }
  }

  // Local Storage fallback
  const localLogs = JSON.parse(localStorage.getItem("mileage_entries") || "[]");
  const localEntry = { id: `local_${Date.now()}`, ...logData };
  localLogs.unshift(localEntry);
  localStorage.setItem("mileage_entries", JSON.stringify(localLogs));
  return localEntry;
};

// Fetch mileage logs for a specific user
export const fetchMileageEntries = async (userId) => {
  const targetId = userId || "anonymous";

  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, "mileage_entries"),
        where("userId", "==", targetId),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });
      return entries;
    } catch (error) {
      console.error("Error fetching entries from Firestore:", error);
    }
  }

  // Local Storage fallback
  const localLogs = JSON.parse(localStorage.getItem("mileage_entries") || "[]");
  return localLogs.filter(log => log.userId === targetId);
};

// Fetch community averages / analytics for a specific vehicle model
export const fetchCommunityStats = async (brand, model, fuelType) => {
  let allEntries = [];

  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "mileage_entries"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        allEntries.push(doc.data());
      });
    } catch (error) {
      console.error("Error fetching community logs from Firestore:", error);
    }
  }

  // If Firebase fails, is not configured, or returned 0 entries, read local storage
  if (allEntries.length === 0) {
    allEntries = JSON.parse(localStorage.getItem("mileage_entries") || "[]");
  }

  // Filter for matching vehicle brand and model and fuel type (case-insensitive fuzzy match)
  const normBrand = (brand || "").trim().toLowerCase();
  const normModel = (model || "").trim().toLowerCase();
  const normFuel = (fuelType || "").trim().toLowerCase();

  const matchingEntries = allEntries.filter(entry => {
    const entryBrand = (entry.vehicleBrand || "").trim().toLowerCase();
    const entryModel = (entry.vehicleModel || entry.vehicle || "").trim().toLowerCase();
    const entryFuel = (entry.fuelType || "").trim().toLowerCase();
    
    // Fuzzy matching for brand & model, or if the older 'vehicle' field matches
    const brandMatch = entryBrand.includes(normBrand) || normBrand.includes(entryBrand) || (entry.vehicle && entry.vehicle.toLowerCase().includes(normBrand));
    const modelMatch = entryModel.includes(normModel) || normModel.includes(entryModel) || (entry.vehicle && entry.vehicle.toLowerCase().includes(normModel));
    const fuelMatch = entryFuel === normFuel || !fuelType; // optional fuel check
    
    return brandMatch && modelMatch && fuelMatch;
  });

  // Filter out suspicious entries (Phase 4)
  const validEntries = matchingEntries.filter(e => !e.isSuspicious);

  if (validEntries.length === 0) {
    return {
      averageMileage: 0,
      overallAverage: 0,
      totalSubmissions: matchingEntries.length,
      validSubmissionsCount: 0,
      rideTypeStats: {
        "City Ride": 0,
        "Highway Ride": 0,
        "Mixed Ride": 0
      },
      highestValid: 0,
      lowestValid: 0,
      totalUsers: 0,
      reliabilityLevel: "Low",
      averageConfidence: 30
    };
  }

  // Weighted overall average (Phase 5)
  let totalWeightedMileage = 0;
  let totalWeight = 0;
  const uniqueUsers = new Set();

  validEntries.forEach(entry => {
    const score = entry.confidenceScore !== undefined ? entry.confidenceScore : 30;
    totalWeightedMileage += parseFloat(entry.mileage || 0) * score;
    totalWeight += score;
    uniqueUsers.add(entry.userId || "anonymous");
  });

  const overallAverage = totalWeight > 0 ? parseFloat((totalWeightedMileage / totalWeight).toFixed(1)) : 0;

  // Ride type breakdowns (weighted)
  const rideTypes = ["City Ride", "Highway Ride", "Mixed Ride"];
  const rideTypeStats = {};

  rideTypes.forEach(type => {
    const typeEntries = validEntries.filter(e => {
      const eType = e.rideType || "Mixed Ride"; // Default if missing
      return eType.toLowerCase() === type.toLowerCase();
    });

    if (typeEntries.length === 0) {
      rideTypeStats[type] = 0;
    } else {
      let rWeightedMileage = 0;
      let rWeight = 0;
      typeEntries.forEach(e => {
        const score = e.confidenceScore !== undefined ? e.confidenceScore : 30;
        rWeightedMileage += parseFloat(e.mileage || 0) * score;
        rWeight += score;
      });
      rideTypeStats[type] = rWeight > 0 ? parseFloat((rWeightedMileage / rWeight).toFixed(1)) : 0;
    }
  });

  const mileages = validEntries.map(e => parseFloat(e.mileage || 0));
  const highestValid = Math.max(...mileages);
  const lowestValid = Math.min(...mileages);

  const averageConfidence = validEntries.reduce((sum, e) => sum + (e.confidenceScore || 30), 0) / validEntries.length;
  let reliabilityLevel = "Low";
  if (averageConfidence >= 75) reliabilityLevel = "High";
  else if (averageConfidence >= 50) reliabilityLevel = "Medium";

  return {
    averageMileage: overallAverage, // backward compatibility
    overallAverage,
    totalSubmissions: matchingEntries.length,
    validSubmissionsCount: validEntries.length,
    rideTypeStats,
    highestValid: parseFloat(highestValid.toFixed(1)),
    lowestValid: parseFloat(lowestValid.toFixed(1)),
    totalUsers: uniqueUsers.size,
    reliabilityLevel,
    averageConfidence: Math.round(averageConfidence),
    rawEntries: validEntries
  };
};

// Fetch Global leaderboard (returns all vehicle stats for vehicle-based rankings)
export const fetchLeaderboard = async () => {
  let allEntries = [];

  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "mileage_entries"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        allEntries.push(doc.data());
      });
    } catch (error) {
      console.error("Error fetching leaderboard logs from Firestore:", error);
    }
  }

  if (allEntries.length === 0) {
    allEntries = JSON.parse(localStorage.getItem("mileage_entries") || "[]");
  }

  // Aggregate by vehicle model + category + fuel type
  const vehicleStats = {};
  
  allEntries.forEach(entry => {
    // Exclude suspicious entries from leaderboard public stats
    if (entry.isSuspicious) return;

    let brand = entry.vehicleBrand || "";
    let model = entry.vehicleModel || "";
    let category = entry.vehicleCategory || "";
    let fuelType = entry.fuelType || "Petrol";

    // Backward compatibility for entries that have a combined "vehicle" field
    if (!brand && !model && entry.vehicle) {
      const cleanVehicle = entry.vehicle.trim();
      const dbMatch = findManufacturerClaim(cleanVehicle);
      if (dbMatch) {
        brand = dbMatch.brand;
        model = dbMatch.model;
        category = dbMatch.segment;
        fuelType = dbMatch.type;
      } else {
        brand = cleanVehicle.split(" ")[0] || "Unknown";
        model = cleanVehicle.split(" ").slice(1).join(" ") || cleanVehicle;
        category = "Car"; // default
      }
    }

    if (!model) return;

    const key = `${brand}_${model}_${fuelType}`.toLowerCase().replace(/\s+/g, "_");

    if (!vehicleStats[key]) {
      vehicleStats[key] = {
        brand,
        model,
        name: `${brand} ${model}`.trim(),
        category: category || "Car",
        fuelType,
        weightedSum: 0,
        weightSum: 0,
        submissions: 0
      };
    }

    const weight = entry.confidenceScore !== undefined ? entry.confidenceScore : 30;
    vehicleStats[key].weightedSum += parseFloat(entry.mileage || 0) * weight;
    vehicleStats[key].weightSum += weight;
    vehicleStats[key].submissions += 1;
  });

  const vehicles = Object.values(vehicleStats).map(stat => ({
    brand: stat.brand,
    model: stat.model,
    vehicle: stat.name,
    category: stat.category,
    fuelType: stat.fuelType,
    averageMileage: stat.weightSum > 0 ? parseFloat((stat.weightedSum / stat.weightSum).toFixed(1)) : 0,
    submissions: stat.submissions
  }));

  return vehicles;
};

// Auth Actions
export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured || !auth) {
    const dummyUser = {
      uid: "local_user_123",
      displayName: "Mallu Driver",
      email: "mallu.driver@kerala.com",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=mallu"
    };
    return dummyUser;
  }
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const loginAnonymously = async () => {
  if (!isFirebaseConfigured || !auth) {
    const dummyUser = {
      uid: `anonymous_${Date.now()}`,
      displayName: "Anonymous Driver 🚗",
      isAnonymous: true
    };
    return dummyUser;
  }
  const result = await signInAnonymously(auth);
  return result.user;
};

export const signOutUser = async () => {
  if (isFirebaseConfigured && auth) {
    await fbSignOut(auth);
  }
};

export { auth, db };
