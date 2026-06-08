import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateLocalRoast } from "./roastEngine";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const apiURL = import.meta.env.VITE_GEMINI_API_URL; // Optional custom endpoint

export const isGeminiConfigured = 
  (!!apiKey && apiKey !== "" && apiKey !== "undefined" && !apiKey.includes("YOUR_")) ||
  (!!apiURL && apiURL !== "" && apiURL !== "undefined" && !apiURL.includes("YOUR_"));

let genAI = null;
if (apiKey && !apiKey.includes("YOUR_")) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (e) {
    console.error("Failed to initialize Gemini SDK:", e);
  }
}

/**
 * Request a roast from Gemini AI
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
  // If not configured, immediately use local roast engine
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

  // Option 1: Call custom proxy API if URL is provided
  if (apiURL && !apiURL.includes("YOUR_")) {
    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, vehicle, mileage, personalityMode, language })
      });
      if (response.ok) {
        const data = await response.json();
        return { roast: data.roast || data.text || data.response, isAI: true };
      }
      throw new Error(`Proxy API returned status ${response.status}`);
    } catch (e) {
      console.warn("Custom API endpoint failed, trying direct SDK if available...", e);
    }
  }

  // Option 2: Call direct Gemini SDK if API Key is configured
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use the latest flash model
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      return { roast: text, isAI: true };
    } catch (e) {
      console.error("Gemini SDK execution error:", e);
    }
  }

  // Final fallback if SDK calls fail
  return {
    roast: generateLocalRoast({ vehicle, mileage, manufacturerMileage, communityAverage, personalityMode, language }),
    isAI: false
  };
};
