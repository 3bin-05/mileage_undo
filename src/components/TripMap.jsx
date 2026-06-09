import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Navigation, Loader2 } from "lucide-react";

// Helper: Haversine Formula (Declared outside component to maintain purity)
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function TripMap({ onDistanceCalculated, onRouteDetailsSet }) {
  const [startQuery, setStartQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [activeSearch, setActiveSearch] = useState(null); // 'start' | 'dest' | null
  const [searching, setSearching] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null); // { distance, startName, destName }

  const [startCoords, setStartCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const startMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default view: Kochi, Kerala
    const defaultLat = 9.9312;
    const defaultLng = 76.2673;

    // Use global L from window
    const L = window.L;
    if (!L) {
      console.error("Leaflet is not loaded from CDN.");
      return;
    }

    mapInstanceRef.current = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([defaultLat, defaultLng], 10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers and Route when coords change
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;

    // Define icons
    const startIcon = L.divIcon({
      html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-700 border-2 border-white text-white font-extrabold shadow-lg transform -translate-y-1 hover:scale-110 transition-transform text-[10px]">START</div>`,
      className: "custom-leaflet-marker",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const destIcon = L.divIcon({
      html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-700 border-2 border-white text-white font-extrabold shadow-lg transform -translate-y-1 hover:scale-110 transition-transform text-[10px]">DEST</div>`,
      className: "custom-leaflet-marker",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    // Helper OSRM Routing Function
    const calculateOSRMRoute = async (start, dest) => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${dest.lon},${dest.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.code === "Ok" && data.routes && data.routes[0]) {
          const route = data.routes[0];
          const distKM = parseFloat((route.distance / 1000).toFixed(2));
          
          const routeDetails = {
            distance: distKM,
            startName: startQuery || "Start Point",
            destName: destQuery || "Destination Point"
          };
          setRouteInfo(routeDetails);
          onDistanceCalculated(distKM);
          onRouteDetailsSet(routeDetails);

          if (routeLineRef.current) {
            routeLineRef.current.remove();
          }

          routeLineRef.current = L.geoJSON(route.geometry, {
            style: {
              color: "#18181b",
              weight: 5,
              opacity: 0.8,
              dashArray: "2, 8",
            }
          }).addTo(mapInstanceRef.current);

          mapInstanceRef.current.fitBounds(routeLineRef.current.getBounds(), {
            padding: [40, 40]
          });
        } else {
          throw new Error("OSRM routing failed");
        }
      } catch (error) {
        console.warn("OSRM error, falling back to straight-line distance:", error);
        const distance = calculateHaversineDistance(start.lat, start.lon, dest.lat, dest.lon);
        const distKM = parseFloat(distance.toFixed(2));
        
        const routeDetails = {
          distance: distKM,
          startName: startQuery || "Start Point",
          destName: destQuery || "Destination Point"
        };
        setRouteInfo(routeDetails);
        onDistanceCalculated(distKM);
        onRouteDetailsSet(routeDetails);

        if (routeLineRef.current) {
          routeLineRef.current.remove();
        }

        routeLineRef.current = L.polyline([[start.lat, start.lon], [dest.lat, dest.lon]], {
          color: "#b91c1c",
          weight: 4,
          dashArray: "5, 5"
        }).addTo(mapInstanceRef.current);

        mapInstanceRef.current.fitBounds(routeLineRef.current.getBounds(), {
          padding: [40, 40]
        });
      }
    };

    // Start Marker
    if (startCoords) {
      const pos = [startCoords.lat, startCoords.lon];
      if (startMarkerRef.current) {
        startMarkerRef.current.setLatLng(pos);
      } else {
        startMarkerRef.current = L.marker(pos, { icon: startIcon, draggable: true })
          .addTo(mapInstanceRef.current)
          .bindPopup("Starting Location")
          .openPopup();

        // Listen to dragend
        startMarkerRef.current.on("dragend", async (e) => {
          const newPos = e.target.getLatLng();
          setStartCoords({ lat: newPos.lat, lon: newPos.lng });
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}`);
            const data = await res.json();
            if (data && data.display_name) {
              const shortName = data.address.city || data.address.town || data.address.village || data.address.suburb || data.display_name.split(",")[0];
              setStartQuery(shortName);
            }
          } catch (err) {
            console.error("Reverse geocoding failed", err);
          }
        });
      }
    } else {
      if (startMarkerRef.current) {
        startMarkerRef.current.remove();
        startMarkerRef.current = null;
      }
    }

    // Destination Marker
    if (destCoords) {
      const pos = [destCoords.lat, destCoords.lon];
      if (destMarkerRef.current) {
        destMarkerRef.current.setLatLng(pos);
      } else {
        destMarkerRef.current = L.marker(pos, { icon: destIcon, draggable: true })
          .addTo(mapInstanceRef.current)
          .bindPopup("Destination Location");

        // Listen to dragend
        destMarkerRef.current.on("dragend", async (e) => {
          const newPos = e.target.getLatLng();
          setDestCoords({ lat: newPos.lat, lon: newPos.lng });
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPos.lat}&lon=${newPos.lng}`);
            const data = await res.json();
            if (data && data.display_name) {
              const shortName = data.address.city || data.address.town || data.address.village || data.address.suburb || data.display_name.split(",")[0];
              setDestQuery(shortName);
            }
          } catch (err) {
            console.error("Reverse geocoding failed", err);
          }
        });
      }
    } else {
      if (destMarkerRef.current) {
        destMarkerRef.current.remove();
        destMarkerRef.current = null;
      }
    }

    // Calculate Routing if both are set
    if (startCoords && destCoords) {
      calculateOSRMRoute(startCoords, destCoords);
    } else {
      if (routeLineRef.current) {
        routeLineRef.current.remove();
        routeLineRef.current = null;
      }
      if (startCoords) {
        mapInstanceRef.current.setView([startCoords.lat, startCoords.lon], 12);
      } else if (destCoords) {
        mapInstanceRef.current.setView([destCoords.lat, destCoords.lon], 12);
      }
    }
  }, [startCoords, destCoords, startQuery, destQuery, onDistanceCalculated, onRouteDetailsSet]);

  // Handle outside suggestion list clicks
  useEffect(() => {
    function handleClickOutside() {
      setActiveSearch(null);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const searchLocations = async (queryStr, type) => {
    if (!queryStr || queryStr.trim().length < 3) return;
    setSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryStr)}&limit=5&countrycodes=in`;
      const res = await fetch(url, {
        headers: { "Accept-Language": "en" }
      });
      const data = await res.json();
      if (type === "start") {
        setStartSuggestions(data);
      } else {
        setDestSuggestions(data);
      }
    } catch (e) {
      console.error("Nominatim Geocoding error:", e);
    } finally {
      setSearching(false);
    }
  };

  // Search debounce
  const searchTimeoutRef = useRef(null);
  const handleQueryChange = (val, type) => {
    if (type === "start") {
      setStartQuery(val);
    } else {
      setDestQuery(val);
    }
    setActiveSearch(type);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(val, type);
    }, 500);
  };

  const selectSuggestion = (item, type) => {
    const coords = { lat: parseFloat(item.lat), lon: parseFloat(item.lon) };
    const displayName = item.display_name.split(",")[0] + ", " + (item.display_name.split(",")[1] || "").trim();
    
    if (type === "start") {
      setStartQuery(displayName);
      setStartCoords(coords);
      setStartSuggestions([]);
    } else {
      setDestQuery(displayName);
      setDestCoords(coords);
      setDestSuggestions([]);
    }
    setActiveSearch(null);
  };

  return (
    <div className="space-y-4">
      {/* Search Input Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Start Location Search */}
        <div className="relative text-left" onClick={(e) => e.stopPropagation()}>
          <label className="block text-[9px] font-extrabold text-neutral-500 mb-1 uppercase tracking-wider flex items-center space-x-1">
            <MapPin size={11} className="text-green-600" />
            <span>Start Location</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search start point (e.g. Kochi)..."
              value={startQuery}
              onChange={(e) => handleQueryChange(e.target.value, "start")}
              onFocus={() => setActiveSearch("start")}
              className="w-full typewriter-input text-xs pl-8"
            />
            <Search size={12} className="absolute left-3 top-3.5 text-gray-400" />
            {searching && activeSearch === "start" && (
              <Loader2 size={12} className="absolute right-3 top-3.5 text-gray-450 animate-spin" />
            )}
          </div>
          
          {/* Suggestions Dropdown */}
          {activeSearch === "start" && startSuggestions.length > 0 && (
            <div className="absolute z-35 w-full mt-1 bg-white border border-gray-250 rounded-xl shadow-xl overflow-hidden">
              {startSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSuggestion(item, "start")}
                  className="px-3 py-2 text-xs hover:bg-neutral-50 border-b border-gray-100 last:border-b-0 cursor-pointer text-gray-800 text-left search-suggestion-item truncate"
                >
                  <span className="font-bold">{item.display_name.split(",")[0]}</span>
                  <span className="text-[10px] text-gray-400 block truncate">{item.display_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Destination Location Search */}
        <div className="relative text-left" onClick={(e) => e.stopPropagation()}>
          <label className="block text-[9px] font-extrabold text-neutral-500 mb-1 uppercase tracking-wider flex items-center space-x-1">
            <Navigation size={11} className="text-red-650" />
            <span>Destination</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search destination (e.g. Alappuzha)..."
              value={destQuery}
              onChange={(e) => handleQueryChange(e.target.value, "dest")}
              onFocus={() => setActiveSearch("dest")}
              className="w-full typewriter-input text-xs pl-8"
            />
            <Search size={12} className="absolute left-3 top-3.5 text-gray-400" />
            {searching && activeSearch === "dest" && (
              <Loader2 size={12} className="absolute right-3 top-3.5 text-gray-450 animate-spin" />
            )}
          </div>

          {/* Suggestions Dropdown */}
          {activeSearch === "dest" && destSuggestions.length > 0 && (
            <div className="absolute z-35 w-full mt-1 bg-white border border-gray-250 rounded-xl shadow-xl overflow-hidden">
              {destSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSuggestion(item, "dest")}
                  className="px-3 py-2 text-xs hover:bg-neutral-50 border-b border-gray-100 last:border-b-0 cursor-pointer text-gray-800 text-left search-suggestion-item truncate"
                >
                  <span className="font-bold">{item.display_name.split(",")[0]}</span>
                  <span className="text-[10px] text-gray-400 block truncate">{item.display_name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Map Container inside skeuomorphic border frame */}
      <div className="trip-map-wrapper w-full h-56 md:h-64 z-10">
        <div ref={mapContainerRef} className="w-full h-full bg-[#f2f4f7]" />
        
        {/* Help Tip Overlay */}
        <div className="absolute bottom-2 left-2 z-20 bg-neutral-900/90 text-white text-[8px] font-bold px-2 py-1 rounded shadow-md pointer-events-none uppercase tracking-wide">
          📍 Drag pins to adjust route on the map
        </div>
      </div>

      {/* Distance Status Display */}
      {routeInfo && (
        <div className="p-3 bg-neutral-100 rounded-xl border border-gray-250 flex items-center justify-between text-xs text-neutral-800">
          <div>
            <span className="text-[9px] font-extrabold uppercase text-gray-400 block leading-tight">Calculated Route</span>
            <span className="font-bold tracking-tight text-neutral-900 truncate max-w-[280px] block">
              {routeInfo.startName} ➔ {routeInfo.destName}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-extrabold uppercase text-gray-400 block leading-tight">Driving Distance</span>
            <span className="font-mono font-black text-sm text-neutral-900">
              {routeInfo.distance} KM
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
