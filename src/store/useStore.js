import { create } from "zustand";
import { 
  isFirebaseConfigured, 
  auth, 
  fetchMileageEntries, 
  saveMileageEntry, 
  loginWithGoogle, 
  loginAnonymously, 
  signOutUser,
  seedVehiclesDatabase
} from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const useStore = create((set, get) => {
  // Initialize Firebase Auth listener if active
  if (isFirebaseConfigured && auth) {
    seedVehiclesDatabase();
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        set({ user: firebaseUser, authLoading: false });
        // Fetch logs for this user
        get().loadHistory();
      } else {
        set({ user: null, history: [], authLoading: false });
      }
    });
  } else {
    // If offline/no Firebase, set loading false immediately
    setTimeout(() => {
      set({ authLoading: false });
      get().loadHistory();
    }, 100);
  }

  return {
    // Authentication States
    user: null,
    authLoading: true,

    // App Preferences / Settings
    language: localStorage.getItem("mu_lang") || "Manglish",
    personalityMode: localStorage.getItem("mu_personality") || "Ammavan Mode",

    // UI States
    activeTab: "calculate", // "calculate" | "history" | "leaderboard"
    receiptOpen: false,
    // Calculation Result State
    currentCalculation: null, // { vehicle, distance, fuelFilled, fuelType, mileage, rating, badge, roast, isAI, timestamp }

    // History Log Entries
    history: [],
    historyLoading: false,

    // Setters / Actions
    setLanguage: (lang) => {
      localStorage.setItem("mu_lang", lang);
      set({ language: lang });
    },

    setPersonalityMode: (mode) => {
      localStorage.setItem("mu_personality", mode);
      set({ personalityMode: mode });
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setReceiptOpen: (isOpen) => set({ receiptOpen: isOpen }),
    setCurrentCalculation: (calc) => set({ currentCalculation: calc }),

    // Authentication Actions
    loginGoogle: async () => {
      set({ authLoading: true });
      try {
        const u = await loginWithGoogle();
        set({ user: u, authLoading: false });
        get().loadHistory();
      } catch (error) {
        console.error("Store Login Error:", error);
        set({ authLoading: false });
      }
    },

    loginAnon: async () => {
      set({ authLoading: true });
      try {
        const u = await loginAnonymously();
        set({ user: u, authLoading: false });
        get().loadHistory();
      } catch (error) {
        console.error("Store Anon Login Error:", error);
        set({ authLoading: false });
      }
    },

    logout: async () => {
      set({ authLoading: true });
      try {
        await signOutUser();
        // If not Firebase, manually clean state
        if (!isFirebaseConfigured) {
          set({ user: null, history: [] });
        }
      } catch (error) {
        console.error("Store Sign Out Error:", error);
      } finally {
        set({ authLoading: false, activeTab: "calculate" });
      }
    },

    // History Actions
    loadHistory: async () => {
      const currentUser = get().user;
      set({ historyLoading: true });
      try {
        const entries = await fetchMileageEntries(currentUser ? currentUser.uid : null);
        set({ history: entries, historyLoading: false });
      } catch (error) {
        console.error("Failed to load history:", error);
        set({ historyLoading: false });
      }
    },

    addHistoryEntry: async (entry) => {
      const currentUser = get().user;
      try {
        const newEntry = await saveMileageEntry(currentUser ? currentUser.uid : null, entry);
        set((state) => ({
          history: [newEntry, ...state.history]
        }));
        return newEntry;
      } catch (error) {
        console.error("Failed to save entry:", error);
        throw error;
      }
    }
  };
});
