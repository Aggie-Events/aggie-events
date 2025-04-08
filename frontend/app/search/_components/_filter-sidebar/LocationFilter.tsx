import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useMenuHandle } from "@/components/MenuHandle";

interface LocationFilterProps {
  onLocationChange: (locations: string[]) => void;
}

export default function LocationFilter({ onLocationChange }: LocationFilterProps) {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const locationMenu = useMenuHandle({isOpen: true});

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
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded text-maroon focus:ring-maroon h-4 w-4"
              checked={selectedLocations.includes("On Campus")}
              onChange={() => handleLocationSelect("On Campus")}
            />
            <span className="ml-2 text-sm text-gray-700">On Campus</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded text-maroon focus:ring-maroon h-4 w-4"
              checked={selectedLocations.includes("Off Campus")}
              onChange={() => handleLocationSelect("Off Campus")}
            />
            <span className="ml-2 text-sm text-gray-700">Off Campus</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="rounded text-maroon focus:ring-maroon h-4 w-4"
              checked={selectedLocations.includes("Virtual")}
              onChange={() => handleLocationSelect("Virtual")}
            />
            <span className="ml-2 text-sm text-gray-700">Virtual</span>
          </label>
        </div>
      )}
    </div>
  );
} 