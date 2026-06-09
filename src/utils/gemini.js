import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateLocalRoast } from "./roastEngine";
import { evaluateMileageRating } from "./mileageEngine";

const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY;
const apiURL = import.meta.env.VITE_GEMINI_API_URL; // Optional custom endpoint

// Split by comma to support multiple keys (key rotation / load balancing)
const apiKeys = (rawApiKey || "")
  .split(",")
  .map(k => k.trim())
  .filter(k => k && k !== "undefined" && !k.includes("YOUR_"));

export const isGeminiConfigured = 
  apiKeys.length > 0 ||
  (!!apiURL && apiURL !== "" && apiURL !== "undefined" && !apiURL.includes("YOUR_"));

// Keep track of key index for round-robin rotation
let currentKeyIndex = 0;

// Initialize clients array
const genAIInstances = apiKeys.map(key => {
  try {
    return new GoogleGenerativeAI(key);
  } catch (e) {
    console.error("Failed to initialize Gemini SDK for key:", e);
    return null;
  }
}).filter(inst => inst !== null);

/**
 * Request a roast from Gemini AI (with key rotation, local caching, and robust local fallbacks)
 */
export const getAIRoast = async ({
  vehicle,
  mileage,
  manufacturerMileage,
  communityAverage,
  personalityMode,
  language,
  fuelType
}) => {
  // 1. Calculate vehicle performance rating for caching classification
  const rating = evaluateMileageRating(mileage, manufacturerMileage, fuelType || "Petrol");
  
  // 2. Normalize inputs to build a stable cache key
  const normVehicle = (vehicle || "").trim().toLowerCase().replace(/\s+/g, "_");
  const cacheKey = `roast_cache:${normVehicle}:${personalityMode}:${language}:${rating}`;
  
  // 3. Check LocalStorage cache first (saves 100% API usage for identical query patterns)
  try {
    const cachedRoast = localStorage.getItem(cacheKey);
    if (cachedRoast) {
      console.log(`Cache Hit: Retrieved roast for ${vehicle} from browser storage.`);
      return { roast: cachedRoast, isAI: true, isCached: true };
    }
  } catch (err) {
    console.warn("Failed to access local storage cache:", err);
  }

  // 4. If not configured, immediately use local roast engine
  if (!isGeminiConfigured) {
    console.log("Gemini not configured. Falling back to local roast engine.");
    return {
      roast: generateLocalRoast({ vehicle, mileage, manufacturerMileage, communityAverage, personalityMode, language }),
      isAI: false
    };
  }

  const offsetFromMfg = manufacturerMileage 
    ? (((mileage - manufacturerMileage) / manufacturerMileage) * 100).toFixed(0) 
    : null;

  const comparisonText = offsetFromMfg 
    ? `${offsetFromMfg > 0 ? '+' : ''}${offsetFromMfg}% offset from the manufacturer claim of ${manufacturerMileage} kmpl`
    : `mileage of ${mileage} kmpl`;

  const prompt = `
    Analyze this vehicle mileage submission:
    - Vehicle: ${vehicle}
    - Fuel Type: ${fuelType || 'Petrol'}
    - User's Mileage: ${mileage} kmpl
    - Manufacturer Claim: ${manufacturerMileage ? manufacturerMileage + ' kmpl' : 'Unknown'}
    - Community Average: ${communityAverage ? communityAverage + ' kmpl' : 'Unknown'}
    - Performance relative to manufacturer: ${comparisonText}

    Task: Generate a hilarious, sarcastic, culture-specific roast or praise based on these details.
    
    Guidelines:
    1. Direct the roast around real-life financial struggles and petrol/diesel price hikes in Kerala/India (e.g., fuel crossing 105-110 INR per litre, recent price hikes, middle-class pocket draining, budget failures).
    2. Link the cost of fuel directly to the user's driving behavior (e.g., "driving with a heavy foot as if your father owns a refinery", "accelerating like racing a KSRTC bus", "unnecessary clutch riding", "blasting the AC in traffic blocks of Kochi/Trivandrum", "idling at railway crossings").
    3. Personality: Act as a "${personalityMode}". 
       - "Ammavan Mode": A typical Kerala uncle who complains about everything, compares you to "neighbor's son who gets 25kmpl on a Splendor", tells you to turn off the AC, and reminds you that petrol is 105 Rs.
       - "Driving Instructor Mode": Yells at you about bad clutch riding, half-clutch starts, wrong gear selections, and wasting gold-priced petrol.
       - "Petrol Pump Owner Mode": Treats you like a god/VIP because you spend so much money on petrol. Wants to build a statue of you at the pump or fund his next Dubai trip with your bills.
       - "KSRTC Driver Mode": Rants that even their massive red KSRTC bus gets better mileage than your car, calls you a slow, gear-grinding driver, and complains you're blocking the road.
       - "Thrissur Ammavan Mode": Uses Thrissur dialect ("gedi", "ente ponnu mone"), brags about Ambassador/Chetak, and roasts modern plastic cars and your fuel consumption.
       - "Mechanic Mode": Lists engine parts that are screaming for help and predicts imminent breakdown due to your rash driving and heavy foot.
    4. Language: Speak in "${language}".
       - If "Malayalam", write in clean Malayalam script but with local colloquial slang.
       - If "Manglish", write Malayalam words using English alphabet (e.g. "Enthedo mone, 105 rupayeക്ക് petrol adichittu ingane odikkan aano puthiya vandi eduthathu?").
       - If "English", write in Indian English with heavy Kerala accent words (e.g. "Simple waste of petrol, ya!", "What is this, man? At 105 INR per litre, you are driving like this?").
    5. The tone must be funny, sharp, and highly shareable on Instagram/WhatsApp. Keep it to 2-3 short, punching sentences.
    6. Do not include introductory text like "Here is your roast:" or formatting, just output the roast itself.
  `;

  // 5. Try Option A: Custom Proxy API if URL is provided
  if (apiURL && !apiURL.includes("YOUR_")) {
    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, vehicle, mileage, personalityMode, language })
      });
      if (response.ok) {
        const data = await response.json();
        const roastText = data.roast || data.text || data.response;
        if (roastText) {
          // Cache successful proxy response
          try {
            localStorage.setItem(cacheKey, roastText);
          } catch (e) {}
          return { roast: roastText, isAI: true };
        }
      }
      throw new Error(`Proxy API returned status ${response.status}`);
    } catch (e) {
      console.warn("Custom API endpoint failed, checking SDK fallbacks...", e);
    }
  }

  // 6. Try Option B: Direct Gemini SDK with key rotation load balancing
  if (genAIInstances.length > 0) {
    // Attempt with each available key in rotation loop
    for (let attempt = 0; attempt < genAIInstances.length; attempt++) {
      // Pick key in round-robin fashion
      const keyIdx = (currentKeyIndex + attempt) % genAIInstances.length;
      const genAI = genAIInstances[keyIdx];

      try {
        console.log(`Attempting Gemini API call with key slot #${keyIdx + 1}/${genAIInstances.length}`);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        
        if (text) {
          // Update key index state for next calls
          currentKeyIndex = (keyIdx + 1) % genAIInstances.length;
          // Cache the response
          try {
            localStorage.setItem(cacheKey, text);
          } catch (e) {}
          return { roast: text, isAI: true };
        }
      } catch (err) {
        console.warn(`Gemini API call failed with key slot #${keyIdx + 1}:`, err);
        // Continue loop to try next key
      }
    }
  }

  // 7. Try Option C: Final resilient fallback to local rules (No API crash)
  console.warn("All configured AI methods failed or exhausted. Falling back to local roast engine.");
  return {
    roast: generateLocalRoast({ vehicle, mileage, manufacturerMileage, communityAverage, personalityMode, language }),
    isAI: false
  };
};
