import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, X, MessageSquare, Image as ImageIcon } from "lucide-react";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";

export default function Receipt() {
  const { currentCalculation, receiptOpen, setReceiptOpen, personalityMode } = useStore();
  const receiptRef = useRef(null);
  const receiptPaperRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const downloadReceiptImage = async () => {
    if (!receiptPaperRef.current) return;
    setDownloading(true);
    
    try {
      // Small delay to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const dataUrl = await toPng(receiptPaperRef.current, {
        backgroundColor: '#fbfbf7',
        pixelRatio: 2, // Retain high quality
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: receiptPaperRef.current.offsetWidth + 'px',
          height: receiptPaperRef.current.offsetHeight + 'px'
        }
      });
      
      const link = document.createElement('a');
      link.download = `mileage-undo-${vehicle ? vehicle.replace(/\s+/g, '-').toLowerCase() : 'receipt'}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate receipt image:", error);
      alert("Could not generate receipt image. Please try taking a screenshot instead!");
    } finally {
      setDownloading(false);
    }
  };

  // Trigger confetti for Excellent mileage rating
  useEffect(() => {
    if (receiptOpen && currentCalculation && currentCalculation.rating === "Excellent") {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [receiptOpen, currentCalculation]);

  if (!receiptOpen || !currentCalculation) return null;

  const {
    vehicle,
    fuelType,
    distance,
    fuelFilled,
    district,
    mileage,
    rating,
    badgeName,
    badgeEmoji,
    badgeDesc,
    roast,
    isAI,
    timestamp
  } = currentCalculation;

  // Format timestamp
  const dateFormatted = timestamp 
    ? new Date(timestamp).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
      });

  // Calculate percentage alignment for gauge slider (0% to 100%)
  // Standard mileage ranges: 5 kmpl to 30 kmpl.
  const getGaugePercentage = () => {
    const minM = 5;
    const maxM = 30;
    const clamped = Math.max(minM, Math.min(maxM, mileage));
    return ((clamped - minM) / (maxM - minM)) * 100;
  };

  // WhatsApp share link generator
  const getWhatsAppShareUrl = () => {
    const text = `*Mileage Undo Report* 🧾
    
🚗 *Vehicle:* ${vehicle} (${fuelType})
🛣️ *Distance:* ${distance} km
⛽ *Consumed:* ${fuelType === "EV" ? fuelFilled + "% battery" : fuelFilled + " L"}
🔥 *Real Mileage:* ${mileage} ${fuelType === "EV" ? "km/%" : "kmpl"}

🏆 *Awarded Rank:* ${badgeEmoji} ${badgeName}
💬 *${personalityMode} says:*
"${roast}"

Calculate yours at *Mileage Undo*! 🚀`;

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  // Clipboard copy handler
  const copyToClipboard = () => {
    const text = `Mileage Undo Report 🧾
Vehicle: ${vehicle} (${fuelType})
Real Mileage: ${mileage} ${fuelType === "EV" ? "km/%" : "kmpl"}
Rank: ${badgeEmoji} ${badgeName}
Roast: "${roast}"`;
    
    navigator.clipboard.writeText(text);
    alert("Receipt summary copied to clipboard! 📋");
  };

  // Rating color map for thermal printer style (black/white/greyscale)
  const getRatingBadgeText = () => {
    switch(rating) {
      case "Excellent": return "★★★★★ ECO CHAMP";
      case "Good": return "★★★★☆ GOOD WORK";
      case "Average": return "★★★☆☆ SO-SO";
      case "Poor": return "★★☆☆☆ POOR STAT";
      default: return "★☆☆☆☆ CRITICAL FUEL HOG";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start bg-neutral-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="max-w-md w-full my-8 relative" ref={receiptRef}>
        
        {/* Top Control Buttons */}
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-accentGreen rounded-full animate-ping"></span>
            <span>Receipt Issued</span>
          </span>
          <button 
            onClick={() => setReceiptOpen(false)}
            className="p-1.5 bg-darkCard border border-darkBorder hover:border-red-500 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Paper Container Roll-out */}
        <motion.div 
          ref={receiptPaperRef}
          initial={{ scaleY: 0, opacity: 0, originY: 0 }}
          animate={{ scaleY: 1, opacity: 1, originY: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 80 }}
          className="receipt-paper rounded-lg p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Paper Jagged Borders */}
          <div className="receipt-serrated-top"></div>
          <div className="receipt-serrated-bottom"></div>

          {/* Dotted Grid Overlay Background (Subtle) */}
          <div className="absolute inset-0 bg-[radial-gradient(#d3d3c9_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>

          <div className="relative space-y-5 text-center mt-2">
            
            {/* Store Header */}
            <div>
              <h1 className="text-xl font-extrabold tracking-widest uppercase m-0 leading-none">MILEAGE UNDO</h1>
              <p className="text-[9px] font-bold tracking-wider opacity-85 mt-1 border-b border-dashed border-gray-400 pb-2">
                COMMUNITY MILEAGE INTELLIGENCE
              </p>
            </div>

            {/* Receipt details metadata */}
            <div className="flex justify-between text-[10px] font-bold opacity-80 border-b border-dashed border-gray-400 pb-2 text-left">
              <div>
                <p>TX: #MU-{Math.floor(100000 + Math.random() * 900000)}</p>
                <p>LOC: {district.toUpperCase()}, KERALA</p>
              </div>
              <div className="text-right">
                <p>DATE: {dateFormatted}</p>
                <p>API: {isAI ? "GEMINI-AI" : "LOCAL-RULE"}</p>
              </div>
            </div>

            {/* Core Itemization */}
            <div className="space-y-1.5 text-xs text-left">
              <div className="flex justify-between font-bold">
                <span>VEHICLE MODEL</span>
                <span className="text-right uppercase max-w-[180px] truncate">{vehicle}</span>
              </div>
              <div className="flex justify-between opacity-85">
                <span>FUEL CLASSIFICATION</span>
                <span className="text-right">{fuelType}</span>
              </div>
              <div className="flex justify-between opacity-85">
                <span>DISTANCE TRAVELLED</span>
                <span className="text-right">{distance} KM</span>
              </div>
              <div className="flex justify-between opacity-85 border-b border-dashed border-gray-400 pb-2.5">
                <span>{fuelType === "EV" ? "BATTERY CONSUMED" : "FUEL FILLED"}</span>
                <span className="text-right">{fuelFilled} {fuelType === "EV" ? "%" : "L"}</span>
              </div>
              
              <div className="flex justify-between font-extrabold text-base pt-2.5">
                <span>REAL MILEAGE:</span>
                <span className="text-right underline decoration-wavy decoration-1 underline-offset-4">
                  {mileage} {fuelType === "EV" ? "KM/%" : "KMPL"}
                </span>
              </div>
            </div>

            {/* Gauge slider section */}
            <div className="space-y-2 border-t border-b border-dashed border-gray-400 py-3.5 text-left">
              <span className="text-[9px] font-bold tracking-wider uppercase opacity-85">Efficiency Scale</span>
              <div className="relative w-full h-3 bg-gray-200 border border-gray-400 rounded-sm overflow-visible">
                {/* Visual marker points */}
                <div className="absolute left-[30%] top-0 bottom-0 border-l border-dashed border-gray-400"></div>
                <div className="absolute left-[70%] top-0 bottom-0 border-l border-dashed border-gray-400"></div>
                
                {/* Needle slider indicator */}
                <div 
                  className="absolute -top-1 w-3 h-5 bg-black rounded shadow-md transform -translate-x-1/2 flex items-center justify-center transition-all duration-500"
                  style={{ left: `${getGaugePercentage()}%` }}
                >
                  <div className="w-0.5 h-3 bg-white"></div>
                </div>
              </div>
              <div className="flex justify-between text-[8px] font-bold opacity-75">
                <span>DRINKER (5)</span>
                <span>AVERAGE (15)</span>
                <span>LEGEND (30)</span>
              </div>
            </div>

            {/* Gamification Badge Box */}
            <div className="p-3 bg-gray-200/80 border border-gray-300 rounded-lg text-center space-y-1">
              <span className="text-2xl">{badgeEmoji}</span>
              <h3 className="text-sm font-extrabold tracking-tight uppercase leading-none">{badgeName}</h3>
              <p className="text-[9px] italic opacity-85 leading-snug">{badgeDesc}</p>
            </div>

            {/* Dynamic Roast Box */}
            <div className="p-4 bg-gray-900 text-white rounded-lg text-left space-y-1.5 relative border border-black shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-bold tracking-widest text-accentGreen uppercase">
                  {personalityMode.toUpperCase()} FEEDBACK
                </span>
                <span className="text-[7px] bg-white/10 text-gray-300 px-1 py-0.5 rounded font-mono">
                  {isAI ? "GEMINI AI" : "RULE-SET"}
                </span>
              </div>
              <p className="text-xs leading-relaxed font-bold tracking-wide select-all">
                "{roast}"
              </p>
            </div>

            {/* Star band label */}
            <div className="text-[10px] font-extrabold tracking-wider border-t border-dashed border-gray-400 pt-2 text-center opacity-85">
              {getRatingBadgeText()}
            </div>

            {/* Bottom Barcode styling */}
            <div className="pt-2 flex flex-col items-center space-y-1">
              <div className="h-8 w-44 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_6px,#000_6px,#000_9px,transparent_9px,transparent_11px)] opacity-85"></div>
              <span className="text-[8px] font-mono tracking-widest font-bold">THANK YOU FOR BURNING FUEL</span>
            </div>

          </div>
        </motion.div>

        {/* Share and Action Drawer */}
        <div className="mt-4 space-y-3">
          <div className="flex space-x-2">
            <button 
              onClick={copyToClipboard}
              className="flex-1 py-3.5 bg-darkCard hover:bg-darkSurface border border-darkBorder hover:border-accentGreen text-white text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Copy size={14} />
              <span>Copy Text</span>
            </button>
            
            <button 
              onClick={downloadReceiptImage}
              disabled={downloading}
              className="flex-1 py-3.5 bg-accentGreen hover:bg-accentGreen-dark text-black text-xs font-black rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
            >
              {downloading ? (
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
              ) : (
                <ImageIcon size={14} />
              )}
              <span>{downloading ? "Saving..." : "Save Photo"}</span>
            </button>
          </div>
          
          <a 
            href={getWhatsAppShareUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-green-900/10"
          >
            <MessageSquare size={14} />
            <span>Share text summary on WhatsApp</span>
          </a>

          <p className="text-[10px] text-center text-gray-500 leading-snug">
            💡 <strong>WhatsApp Photo Sharing:</strong> Click <strong>Save Photo</strong> to download the receipt card image, then send the photo directly to your WhatsApp chats!
          </p>
        </div>

      </div>
    </div>
  );
}
