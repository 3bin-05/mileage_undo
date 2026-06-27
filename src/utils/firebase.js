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
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  writeBatch
} from "firebase/firestore";
import { findManufacturerClaim, VEHICLE_DATABASE } from "./mileageEngine";

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

// --- Dynamic Seeding (Auto-seeder on first boot) ---
export const seedVehiclesDatabase = async () => {
  if (!isFirebaseConfigured || !db) return;
  try {
    const q = query(collection(db, "vehicles"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log("Seeding vehicles collection in Firestore...");
      const batch = writeBatch(db);
      for (const v of VEHICLE_DATABASE) {
        const id = `${v.brand.toLowerCase()}_${v.model.toLowerCase()}`.replace(/\s+/g, "_");
        const docRef = doc(db, "vehicles", id);
        batch.set(docRef, {
          brand: v.brand.toLowerCase(),
          model: v.model.toLowerCase(),
          vehicleId: id,
          fuelType: v.type.toLowerCase(),
          araiMileage: v.claim,
          category: v.segment.toLowerCase(),
          isVerified: true,
          createdAt: new Date().toISOString()
        });
      }
      await batch.commit();
      console.log("Seeding complete. Seeded", VEHICLE_DATABASE.length, "vehicles.");
    }
  } catch (e) {
    console.error("Failed to seed vehicles database:", e);
  }
};

// --- Auto Vehicle Creation helper (Phase 8 & 9) ---
export const ensureVehicleExists = async (brand, model, category, fuelType) => {
  const brandLower = brand.trim().toLowerCase();
  const modelLower = model.trim().toLowerCase();
  const id = `${brandLower}_${modelLower}`.replace(/\s+/g, "_");

  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "vehicles", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          brand: brandLower,
          model: modelLower,
          vehicleId: id,
          fuelType: fuelType.toLowerCase(),
          araiMileage: null,
          category: category.toLowerCase(),
          isVerified: false,
          createdAt: new Date().toISOString()
        });
        console.log(`Auto created new vehicle profile: ${brandLower} ${modelLower}`);
      }
    } catch (e) {
      console.error("Error creating vehicle automatically:", e);
    }
  } else {
    // Local storage mock vehicle database
    const localVehicles = JSON.parse(localStorage.getItem("vehicles") || "[]");
    const exists = localVehicles.some(v => v.vehicleId === id);
    if (!exists) {
      localVehicles.push({
        brand: brandLower,
        model: modelLower,
        vehicleId: id,
        fuelType: fuelType.toLowerCase(),
        araiMileage: null,
        category: category.toLowerCase(),
        isVerified: false,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("vehicles", JSON.stringify(localVehicles));
    }
  }
  return id;
};

// Helper: Local storage stats updater for offline mode
const updateLocalStats = (brand, model, fuelType, category) => {
  const localLogs = JSON.parse(localStorage.getItem("mileage_entries") || "[]");
  const vehicleId = `${brand}_${model}`.replace(/\s+/g, "_");
  
  // Filter logs for this vehicle
  const matching = localLogs.filter(e => e.vehicleId === vehicleId && e.fuelType === fuelType);
  const valid = matching.filter(e => !e.isSuspicious);

  if (valid.length === 0) return;

  let sum = 0;
  let weightSum = 0;
  let citySum = 0, cityWeight = 0;
  let hwySum = 0, hwyWeight = 0;
  let mixedSum = 0, mixedWeight = 0;
  
  const uniqueUsers = new Set();
  const mileages = [];

  valid.forEach(e => {
    const weight = e.confidenceScore || 30;
    const m = parseFloat(e.mileage);
    if (isNaN(m)) return;
    
    mileages.push(m);
    sum += m * weight;
    weightSum += weight;
    uniqueUsers.add(e.userId);

    const rType = e.rideType || "Mixed Ride";
    if (rType === "City Ride") {
      citySum += m * weight;
      cityWeight += weight;
    } else if (rType === "Highway Ride") {
      hwySum += m * weight;
      hwyWeight += weight;
    } else {
      mixedSum += m * weight;
      mixedWeight += weight;
    }
  });

  const overall = weightSum > 0 ? parseFloat((sum / weightSum).toFixed(1)) : 0;
  const city = cityWeight > 0 ? parseFloat((citySum / cityWeight).toFixed(1)) : 0;
  const hwy = hwyWeight > 0 ? parseFloat((hwySum / hwyWeight).toFixed(1)) : 0;
  const mixed = mixedWeight > 0 ? parseFloat((mixedSum / mixedWeight).toFixed(1)) : 0;
  
  const pre = findManufacturerClaim(`${brand} ${model}`);
  const arai = pre ? pre.claim : null;

  const stats = {
    vehicleId,
    brand,
    model,
    araiMileage: arai,
    communityAverageMileage: overall,
    cityAverageMileage: city,
    highwayAverageMileage: hwy,
    mixedAverageMileage: mixed,
    highestMileage: Math.max(...mileages),
    lowestMileage: Math.min(...mileages),
    contributors: uniqueUsers.size,
    entries: matching.length,
    updatedAt: new Date().toISOString()
  };

  const localStats = JSON.parse(localStorage.getItem("vehicle_stats") || "[]");
  const idx = localStats.findIndex(s => s.vehicleId === vehicleId);
  if (idx !== -1) {
    localStats[idx] = stats;
  } else {
    localStats.push(stats);
  }
  localStorage.setItem("vehicle_stats", JSON.stringify(localStats));
};

// --- Unified Database Services ---

// Save a mileage log entry
export const saveMileageEntry = async (userId, entry) => {
  // Normalize brand and model to lowercase (Brand & Model Normalization)
  const brandLower = (entry.vehicleBrand || "").trim().toLowerCase();
  const modelLower = (entry.vehicleModel || "").trim().toLowerCase();
  const vehicleId = `${brandLower}_${modelLower}`.replace(/\s+/g, "_");

  // Automatically ensure vehicle document exists (Automatic Vehicle Creation)
  await ensureVehicleExists(brandLower, modelLower, entry.vehicleCategory, entry.fuelType);

  const logData = {
    ...entry,
    vehicleBrand: brandLower,
    vehicleModel: modelLower,
    vehicle: `${brandLower} ${modelLower}`,
    vehicleId,
    userId: userId || "anonymous",
    timestamp: new Date().toISOString(),
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString(),
    // Future-ready placeholders (Phase 9)
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
    }
  }

  // Local Storage fallback
  const localLogs = JSON.parse(localStorage.getItem("mileage_entries") || "[]");
  const localEntry = { id: `local_${Date.now()}`, ...logData };
  localLogs.unshift(localEntry);
  localStorage.setItem("mileage_entries", JSON.stringify(localLogs));

  // Update mock vehicle statistics locally
  updateLocalStats(brandLower, modelLower, entry.fuelType, entry.vehicleCategory);

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
  const brandLower = (brand || "").trim().toLowerCase();
  const modelLower = (model || "").trim().toLowerCase();
  const vehicleId = `${brandLower}_${modelLower}`.replace(/\s+/g, "_");

  // 1. Try to fetch from vehicleStats collection (Source of Truth)
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "vehicleStats", vehicleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Find ARAI claim
        const pre = findManufacturerClaim(`${brandLower} ${modelLower}`);
        const arai = data.araiMileage !== undefined ? data.araiMileage : (pre ? pre.claim : null);

        // Fetch raw entries for in-memory outlier checks
        const logsQ = query(collection(db, "mileage_entries"), where("vehicleId", "==", vehicleId));
        const logsSnap = await getDocs(logsQ);
        const rawEntries = [];
        logsSnap.forEach(d => rawEntries.push(d.data()));

        return {
          vehicleId: data.vehicleId || vehicleId,
          brand: data.brand || brandLower,
          model: data.model || modelLower,
          araiMileage: arai,
          overallAverage: data.communityAverageMileage || 0,
          averageMileage: data.communityAverageMileage || 0, // backward compatibility
          cityAverageMileage: data.cityAverageMileage || 0,
          highwayAverageMileage: data.highwayAverageMileage || 0,
          mixedAverageMileage: data.mixedAverageMileage || 0,
          highestValid: data.highestMileage || 0,
          lowestValid: data.lowestMileage || 0,
          totalSubmissions: data.entries || 0,
          totalUsers: data.contributors || 0,
          reliabilityLevel: (data.contributors >= 10) ? "High" : (data.contributors >= 3) ? "Medium" : "Low",
          averageConfidence: 70,
          rideTypeStats: {
            "City Ride": data.cityAverageMileage || 0,
            "Highway Ride": data.highwayAverageMileage || 0,
            "Mixed Ride": data.mixedAverageMileage || 0
          },
          rawEntries
        };
      }
    } catch (e) {
      console.warn("Failed to read vehicleStats from Firestore, fallback to calculation...", e);
    }
  }

  // 2. Fallback to client-side calculation from mileage_entries
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

  // Read local storage if Firestore is empty or unavailable
  if (allEntries.length === 0) {
    allEntries = JSON.parse(localStorage.getItem("mileage_entries") || "[]");
  }

  const matchingEntries = allEntries.filter(entry => {
    const entryBrand = (entry.vehicleBrand || "").trim().toLowerCase();
    const entryModel = (entry.vehicleModel || entry.vehicle || "").trim().toLowerCase();
    const entryFuel = (entry.fuelType || "").trim().toLowerCase();
    
    const brandMatch = entryBrand.includes(brandLower) || brandLower.includes(entryBrand);
    const modelMatch = entryModel.includes(modelLower) || modelLower.includes(entryModel);
    const fuelMatch = !fuelType || entryFuel === fuelType.toLowerCase();
    
    return brandMatch && modelMatch && fuelMatch;
  });

  // Filter out suspicious entries (outliers)
  const validEntries = matchingEntries.filter(e => !e.isSuspicious);

  const pre = findManufacturerClaim(`${brandLower} ${modelLower}`);
  const arai = pre ? pre.claim : null;

  if (validEntries.length === 0) {
    return {
      vehicleId,
      brand: brandLower,
      model: modelLower,
      araiMileage: arai,
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
      averageConfidence: 30,
      rawEntries: []
    };
  }

  // Weighted overall average
  let totalWeightedMileage = 0;
  let totalWeight = 0;
  const uniqueUsers = new Set();
  const mileages = [];

  const rideTypeSums = { "City Ride": 0, "Highway Ride": 0, "Mixed Ride": 0 };
  const rideTypeWeights = { "City Ride": 0, "Highway Ride": 0, "Mixed Ride": 0 };

  validEntries.forEach(entry => {
    const score = entry.confidenceScore !== undefined ? entry.confidenceScore : 30;
    const mVal = parseFloat(entry.mileage || 0);
    mileages.push(mVal);
    
    totalWeightedMileage += mVal * score;
    totalWeight += score;
    uniqueUsers.add(entry.userId || "anonymous");

    const rType = entry.rideType || "Mixed Ride";
    if (rideTypeSums[rType] !== undefined) {
      rideTypeSums[rType] += mVal * score;
      rideTypeWeights[rType] += score;
    }
  });

  const overallAverage = totalWeight > 0 ? parseFloat((totalWeightedMileage / totalWeight).toFixed(1)) : 0;
  const highestValid = Math.max(...mileages);
  const lowestValid = Math.min(...mileages);

  const rideTypeStats = {};
  Object.keys(rideTypeSums).forEach(type => {
    rideTypeStats[type] = rideTypeWeights[type] > 0
      ? parseFloat((rideTypeSums[type] / rideTypeWeights[type]).toFixed(1))
      : 0;
  });

  return {
    vehicleId,
    brand: brandLower,
    model: modelLower,
    araiMileage: arai,
    overallAverage,
    averageMileage: overallAverage,
    totalSubmissions: matchingEntries.length,
    validSubmissionsCount: validEntries.length,
    rideTypeStats,
    highestValid: parseFloat(highestValid.toFixed(1)),
    lowestValid: parseFloat(lowestValid.toFixed(1)),
    totalUsers: uniqueUsers.size,
    reliabilityLevel: uniqueUsers.size >= 10 ? "High" : uniqueUsers.size >= 3 ? "Medium" : "Low",
    averageConfidence: 50,
    rawEntries: validEntries
  };
};

// Fetch Global leaderboard (returns all vehicle stats using vehicleStats as Source of Truth)
export const fetchLeaderboard = async () => {
  let statsList = [];

  // 1. Try to fetch from vehicleStats collection (Source of Truth)
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "vehicleStats"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const brandDisp = data.brand ? data.brand.charAt(0).toUpperCase() + data.brand.slice(1) : "";
        const modelDisp = data.model ? data.model.charAt(0).toUpperCase() + data.model.slice(1) : "";
        
        const pre = findManufacturerClaim(`${data.brand} ${data.model}`);
        const category = pre ? pre.segment : (data.category === "bike" ? "Bike" : data.category === "suv" ? "SUV" : "Car");

        statsList.push({
          brand: brandDisp,
          model: modelDisp,
          vehicle: `${brandDisp} ${modelDisp}`.trim(),
          category: category,
          fuelType: data.fuelType ? data.fuelType.toUpperCase() : "PETROL",
          averageMileage: data.communityAverageMileage || 0,
          submissions: data.entries || 0,
          araiMileage: data.araiMileage || (pre ? pre.claim : null)
        });
      });
      
      if (statsList.length > 0) {
        return statsList;
      }
    } catch (e) {
      console.error("Error fetching stats from vehicleStats:", e);
    }
  }

  // 2. Fallback to local storage vehicle stats (if offline/empty)
  const localStats = JSON.parse(localStorage.getItem("vehicle_stats") || "[]");
  if (localStats.length > 0) {
    return localStats.map(stat => {
      const brandDisp = stat.brand ? stat.brand.charAt(0).toUpperCase() + stat.brand.slice(1) : "";
      const modelDisp = stat.model ? stat.model.charAt(0).toUpperCase() + stat.model.slice(1) : "";
      
      const pre = findManufacturerClaim(`${stat.brand} ${stat.model}`);
      const category = pre ? pre.segment : (stat.category === "bike" ? "Bike" : stat.category === "suv" ? "SUV" : "Car");

      return {
        brand: brandDisp,
        model: modelDisp,
        vehicle: `${brandDisp} ${modelDisp}`.trim(),
        category,
        fuelType: stat.fuelType ? stat.fuelType.toUpperCase() : "PETROL",
        averageMileage: stat.communityAverageMileage || 0,
        submissions: stat.entries || 0,
        araiMileage: stat.araiMileage || (pre ? pre.claim : null)
      };
    });
  }

  // 3. Fallback: Aggregate client side from mileage_entries
  console.log("No vehicleStats found. Aggregating leaderboard client-side from logs...");
  let allEntries = [];
  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, "mileage_entries"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        allEntries.push(doc.data());
      });
    } catch (e) {
      console.error("Error fetching entries for aggregation:", e);
    }
  }

  if (allEntries.length === 0) {
    allEntries = JSON.parse(localStorage.getItem("mileage_entries") || "[]");
  }

  const vehicleGroups = {};
  
  allEntries.forEach(entry => {
    if (entry.isSuspicious) return;

    let brand = entry.vehicleBrand || "";
    let model = entry.vehicleModel || "";
    let category = entry.vehicleCategory || "";
    let fuelType = entry.fuelType || "Petrol";

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
        category = "Car";
      }
    }

    if (!model) return;

    const key = `${brand}_${model}_${fuelType}`.toLowerCase().replace(/\s+/g, "_");

    if (!vehicleGroups[key]) {
      vehicleGroups[key] = {
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
    vehicleGroups[key].weightedSum += parseFloat(entry.mileage || 0) * weight;
    vehicleGroups[key].weightSum += weight;
    vehicleGroups[key].submissions += 1;
  });

  return Object.values(vehicleGroups).map(stat => {
    const brandDisp = stat.brand ? stat.brand.charAt(0).toUpperCase() + stat.brand.slice(1) : "";
    const modelDisp = stat.model ? stat.model.charAt(0).toUpperCase() + stat.model.slice(1) : "";
    const pre = findManufacturerClaim(`${stat.brand} ${stat.model}`);
    
    return {
      brand: brandDisp,
      model: modelDisp,
      vehicle: `${brandDisp} ${modelDisp}`.trim(),
      category: stat.category,
      fuelType: stat.fuelType.toUpperCase(),
      averageMileage: stat.weightSum > 0 ? parseFloat((stat.weightedSum / stat.weightSum).toFixed(1)) : 0,
      submissions: stat.submissions,
      araiMileage: pre ? pre.claim : null
    };
  });
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
