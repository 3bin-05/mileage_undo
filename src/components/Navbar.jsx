import React, { useState } from "react";
import { useStore } from "../store/useStore";
import { LogIn, LogOut, LayoutDashboard, Trophy, Calculator } from "lucide-react";

export default function Navbar() {
  const { 
    user, 
    authLoading, 
    activeTab, 
    setActiveTab, 
    loginGoogle, 
    loginAnon, 
    logout 
  } = useStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md px-6 py-4 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Logo / Brand */}
        <div 
          onClick={() => setActiveTab("calculate")}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <img 
            src="/mu.png" 
            alt="MU Logo" 
            className="w-10 h-10 rounded-lg shadow-sm border border-gray-200/40 object-contain bg-white/50 group-hover:scale-105 transition-transform duration-300"
          />
          <div>
            <span className="text-md font-black text-neutral-900 tracking-tight uppercase">MILEAGE</span>
            <span className="text-md font-bold text-gray-500 ml-0.5 tracking-tight uppercase">UNDO</span>
          </div>
        </div>

        {/* Central Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-gray-100 border border-gray-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("calculate")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "calculate"
                ? "bg-neutral-950 text-white shadow-sm"
                : "text-gray-500 hover:text-neutral-900 hover:bg-gray-200/50"
            }`}
          >
            <Calculator size={13} />
            <span>Calculate</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "history"
                ? "bg-neutral-950 text-white shadow-sm"
                : "text-gray-500 hover:text-neutral-900 hover:bg-gray-200/50"
            }`}
          >
            <LayoutDashboard size={13} />
            <span>My Garage</span>
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              activeTab === "leaderboard"
                ? "bg-neutral-950 text-white shadow-sm"
                : "text-gray-500 hover:text-neutral-900 hover:bg-gray-200/50"
            }`}
          >
            <Trophy size={13} />
            <span>Leaderboard</span>
          </button>
        </div>

        {/* User Auth Section */}
        <div className="flex items-center space-x-3">
          {authLoading ? (
            <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-neutral-800 animate-spin"></div>
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none p-1 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
              >
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                  alt="avatar" 
                  className="w-7 h-7 rounded-full border border-gray-200 object-cover bg-gray-50"
                />
                <span className="hidden sm:inline text-xs font-bold text-neutral-800 max-w-[100px] truncate">
                  {user.displayName || "Driver"}
                </span>
              </button>

              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-52 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl p-2 animate-fade-in text-left">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs font-bold text-neutral-900 truncate">{user.displayName || "Mallu Driver"}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email || "No email"}</p>
                      {user.isAnonymous && (
                        <span className="inline-block text-[8px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded mt-1 font-bold">
                          Guest Driver
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        setActiveTab("history");
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left text-xs font-medium text-gray-700 hover:text-neutral-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <LayoutDashboard size={13} />
                      <span>My Garage</span>
                    </button>

                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-left text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button 
                onClick={loginAnon}
                className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-neutral-900 rounded-xl transition-all"
              >
                Guest
              </button>
              <button 
                onClick={loginGoogle}
                className="flex items-center space-x-1.5 px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-extrabold rounded-xl transition-all shadow-sm"
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="md:hidden flex justify-around mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => setActiveTab("calculate")}
          className={`flex items-center space-x-1 py-1 px-3 rounded-lg text-xs font-bold transition-colors ${
            activeTab === "calculate" ? "text-neutral-900" : "text-gray-400"
          }`}
        >
          <Calculator size={13} />
          <span>Calculate</span>
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center space-x-1 py-1 px-3 rounded-lg text-xs font-bold transition-colors ${
            activeTab === "history" ? "text-neutral-900" : "text-gray-400"
          }`}
        >
          <LayoutDashboard size={13} />
          <span>Garage</span>
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex items-center space-x-1 py-1 px-3 rounded-lg text-xs font-bold transition-colors ${
            activeTab === "leaderboard" ? "text-neutral-900" : "text-gray-400"
          }`}
        >
          <Trophy size={13} />
          <span>Leaderboard</span>
        </button>
      </div>
    </nav>
  );
}
