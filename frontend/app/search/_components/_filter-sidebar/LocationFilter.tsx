import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useMenuHandle } from "@/components/MenuHandle";
import { useSearchParams } from "next/navigation";

interface LocationFilterProps {
  onLocationChange: (locations: string[]) => void;
}

// Available location types
const LOCATION_TYPES = ["On Campus", "Off Campus", "Virtual"];

export default function LocationFilter({ onLocationChange }: LocationFilterProps) {
  const searchParams = useSearchParams();
  
  // Initialize from URL parameters if available
  const initialLocations = searchParams.get('locations')
    ? searchParams.get('locations')!.split(',')
    : [];
    
  const [selectedLocations, setSelectedLocations] = useState<string[]>(initialLocations);
  const locationMenu = useMenuHandle({isOpen: true});
  
  // Update parent component when locations change on initial load
  useEffect(() => {
    if (initialLocations.length > 0) {
      onLocationChange(initialLocations);
    }
  }, []); // Runs only on mount to sync initial state

  const handleLocationSelect = (location: string) => {
    const newLocations = selectedLocations.includes(location)
      ? selectedLocations.filter(l => l !== location)
      : [...selectedLocations, location];
    
    setSelectedLocations(newLocations);
    onLocationChange(newLocations);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Location</h3>
        <button 
          onClick={() => locationMenu.setIsMenuOpen(!locationMenu.isMenuOpen)}
          className="text-sm text-gray-500 flex items-center"
        >
          <FaChevronDown className={`ml-1 h-3 w-3 transition-transform ${locationMenu.isMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {locationMenu.isMenuOpen && (
        <div className="space-y-1"> 
          {LOCATION_TYPES.map(locationType => (
            <label key={locationType} className="flex items-center">
              <input 
                type="checkbox" 
                className="rounded text-maroon focus:ring-maroon h-4 w-4"
                checked={selectedLocations.includes(locationType)}
                onChange={() => handleLocationSelect(locationType)}
              />
              <span className="ml-2 text-sm text-gray-700">{locationType}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
} 