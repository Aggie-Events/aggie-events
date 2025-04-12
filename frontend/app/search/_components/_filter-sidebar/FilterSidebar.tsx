import React, { useState, useEffect } from "react";
import DateFilter from "./DateFilter";
import TimeFilter from "./TimeFilter";
import LocationFilter from "./LocationFilter";
import TagsFilter from "./TagsFilter";
import { useSearchParams } from "next/navigation";

interface SidebarProps {
  onFilterChange: (filters: FilterState) => void;
}

type FilterState = {
  tags: string[];
  dateRange: [Date | null, Date | null]; // Date part only
  timeRange: [string | null, string | null]; // Time part as strings
  locations: string[];
};

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const searchParams = useSearchParams();
  
  // Initialize state from URL params
  const [filters, setFilters] = useState<FilterState>({
    tags: searchParams.get('tags') ? searchParams.get('tags')!.split(',') : [],
    dateRange: [
      searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null,
      searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null
    ],
    timeRange: [
      searchParams.get('startTime') || "",
      searchParams.get('endTime') || ""
    ],
    locations: searchParams.get('locations') ? searchParams.get('locations')!.split(',') : []
  });

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const applyFilters = () => {
    const tempFilters: {
      tags?: string[];
      dateRange?: [Date, Date];
      timeRange?: [string, string];
      locations?: string[];
    } = {};
    
    if (filters.tags.length > 0) {
      tempFilters.tags = filters.tags;
    }
    
    if (filters.dateRange[0] && filters.dateRange[1]) {
      // Create full dates with the time component
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      
      // Apply time if available
      if (filters.timeRange[0]) {
        const [hours, minutes] = filters.timeRange[0].split(':').map(Number);
        startDate.setHours(hours, minutes, 0, 0);
      } else {
        startDate.setHours(0, 0, 0, 0);
      }
      
      if (filters.timeRange[1]) {
        const [hours, minutes] = filters.timeRange[1].split(':').map(Number);
        endDate.setHours(hours, minutes, 0, 0);
      } else {
        endDate.setHours(23, 59, 59, 999);
      }
      
      tempFilters.dateRange = [startDate, endDate];
    }
    
    if (filters.timeRange[0] || filters.timeRange[1]) {
      tempFilters.timeRange = [filters.timeRange[0] || "", filters.timeRange[1] || ""];
    }
    
    if (filters.locations.length > 0) {
      tempFilters.locations = filters.locations;
    }
    
    onFilterChange(tempFilters as FilterState);
  };
  
  const resetFilters = () => {
    setFilters({
      tags: [],
      dateRange: [null, null],
      timeRange: ["", ""],
      locations: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filters</h2>
        
        <button
          onClick={resetFilters}
          className="text-sm text-gray-500 hover:text-maroon"
        >
          Reset All
        </button>
      </div>
      
      <DateFilter 
        onDateChange={(startDate: Date | null, endDate: Date | null) => setFilters(prev => ({ ...prev, dateRange: [startDate, endDate] }))}
        initialDates={filters.dateRange}
      />
      <TimeFilter 
        onTimeChange={(startTime: string, endTime: string) => setFilters(prev => ({ ...prev, timeRange: [startTime, endTime] }))}
        initialTimes={[
          filters.timeRange[0] || "",
          filters.timeRange[1] || ""
        ]}
      />
      <LocationFilter onLocationChange={(locations: string[]) => setFilters(prev => ({ ...prev, locations }))} />
      <TagsFilter onTagsChange={(tags: string[]) => setFilters(prev => ({ ...prev, tags }))} />
      
      <button
        onClick={applyFilters}
        className="w-full py-2 px-4 bg-maroon text-white rounded-md hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon"
      >
        Apply Filters
      </button>
    </div>
  );
}