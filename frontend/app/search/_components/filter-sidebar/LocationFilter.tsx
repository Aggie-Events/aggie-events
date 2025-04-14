import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useMenuSelect } from "@/components/common/MenuSelectionHook";
import { useSearchParams } from "next/navigation";
import { FilterSection } from "@/app/search/_components/filter-sidebar/components/FilterSection";
import { FilterButton } from "@/app/search/_components/filter-sidebar/components/FilterButton";

interface LocationFilterProps {
  onLocationChange: (locations: string[]) => void;
}

// Available location types
const LOCATION_TYPES = ["On Campus", "Off Campus", "Virtual"];

export default function LocationFilter({
  onLocationChange,
}: LocationFilterProps) {
  const searchParams = useSearchParams();

  // Initialize from URL parameters if available
  const initialLocations = searchParams.get("locations")
    ? searchParams.get("locations")!.split(",")
    : [];

  const [selectedLocations, setSelectedLocations] =
    useState<string[]>(initialLocations);
  const locationMenu = useMenuSelect({ isOpen: true });

  // Update parent component when locations change on initial load
  useEffect(() => {
    if (initialLocations.length > 0) {
      onLocationChange(initialLocations);
    }
  }, []); // Runs only on mount to sync initial state

  const handleLocationSelect = (location: string) => {
    const newLocations = selectedLocations.includes(location)
      ? selectedLocations.filter((l) => l !== location)
      : [...selectedLocations, location];

    setSelectedLocations(newLocations);
    onLocationChange(newLocations);
  };

  const resetLocationFilter = () => {
    setSelectedLocations([]);
    onLocationChange([]);
  };

  return (
    <FilterSection title="Location">
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterButton
            onClick={resetLocationFilter}
            active={selectedLocations.length === 0}
            text="Any"
          />
          {LOCATION_TYPES.map((locationType) => (
            <FilterButton
              key={locationType}
              onClick={() => handleLocationSelect(locationType)}
              active={selectedLocations.includes(locationType)}
              text={locationType}
            />
          ))}
        </div>
      </div>
    </FilterSection>
  );
}
