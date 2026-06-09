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
    createdAt: isFirebaseConfigured ? serverTimestamp() : new Date().toISOString()
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
export const fetchCommunityStats = async (vehicleModel) => {
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

  // Filter for matching vehicle model (case-insensitive fuzzy match)
  const queryModel = (vehicleModel || "").trim().toLowerCase();
  const matchingEntries = allEntries.filter(
    entry => entry.vehicle && entry.vehicle.trim().toLowerCase().includes(queryModel)
  );

  if (matchingEntries.length === 0) {
    return {
      averageMileage: 0,
      totalSubmissions: 0,
      districtBreakdown: {}
    };
  }

  const totalMileage = matchingEntries.reduce((sum, entry) => sum + parseFloat(entry.mileage || 0), 0);
  const averageMileage = totalMileage / matchingEntries.length;

  const districtBreakdown = {};
  matchingEntries.forEach(entry => {
    if (entry.district) {
      if (!districtBreakdown[entry.district]) {
        districtBreakdown[entry.district] = { sum: 0, count: 0 };
      }
      districtBreakdown[entry.district].sum += parseFloat(entry.mileage || 0);
      districtBreakdown[entry.district].count += 1;
    }
  });

  const formattedDistricts = {};
  Object.keys(districtBreakdown).forEach(district => {
    formattedDistricts[district] = (
      districtBreakdown[district].sum / districtBreakdown[district].count
    ).toFixed(2);
  });

  return {
    averageMileage: parseFloat(averageMileage.toFixed(2)),
    totalSubmissions: matchingEntries.length,
    districtBreakdown: formattedDistricts
  };
};

// Fetch Global leaderboard (real-time aggregation from submissions)
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

  // Aggregate by vehicle model
  const vehicleStats = {};
  allEntries.forEach(entry => {
    if (!entry.vehicle) return;
    const model = entry.vehicle.trim();
    const modelKey = model.toLowerCase();

    if (!vehicleStats[modelKey]) {
      vehicleStats[modelKey] = {
        name: model,
        sumMileage: 0,
        count: 0,
        fuelType: entry.fuelType || "Petrol"
      };
    }
    vehicleStats[modelKey].sumMileage += parseFloat(entry.mileage || 0);
    vehicleStats[modelKey].count += 1;
  });

  const leaderboard = Object.values(vehicleStats).map(stat => ({
    vehicle: stat.name,
    averageMileage: parseFloat((stat.sumMileage / stat.count).toFixed(2)),
    submissions: stat.count,
    fuelType: stat.fuelType
  }));

  // Sort descending by average mileage
  return leaderboard.sort((a, b) => b.averageMileage - a.averageMileage);
};

// Auth Actions
export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured || !auth) {
    // Local storage mock auth if offline
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
