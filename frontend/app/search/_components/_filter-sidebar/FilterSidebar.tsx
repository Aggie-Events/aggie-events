import React, { useState } from "react";
import DateFilter from "./DateFilter";
import TimeFilter from "./TimeFilter";
import LocationFilter from "./LocationFilter";
import TagsFilter from "./TagsFilter";

interface SidebarProps {
  onFilterChange: (filters: { 
    tags?: string[]; 
    dateRange?: [Date, Date]; 
    timeRange?: [string, string];
    locations?: string[];
  }) => void;
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [timeRange, setTimeRange] = useState<[string, string] | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  
  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    if (startDate && endDate) {
      setDateRange([startDate, endDate]);
    } else {
      setDateRange(null);
    }
  };

  const handleTimeChange = (startTime: string, endTime: string) => {
    if (startTime && endTime) {
      setTimeRange([startTime, endTime]);
    } else {
      setTimeRange(null);
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleLocationChange = (locations: string[]) => {
    setSelectedLocations(locations);
  };

  const applyFilters = () => {
    onFilterChange({
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      dateRange: dateRange || undefined,
      timeRange: timeRange || undefined,
      locations: selectedLocations.length > 0 ? selectedLocations : undefined
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Filters</h2>
      
      <DateFilter onDateChange={handleDateChange} />
      <TimeFilter onTimeChange={handleTimeChange} />
      <LocationFilter onLocationChange={handleLocationChange} />
      <TagsFilter onTagsChange={handleTagsChange} />
      
      <button
        onClick={applyFilters}
        className="w-full py-2 px-4 bg-maroon text-white rounded-md hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon"
      >
        Apply Filters
      </button>
    </div>
  );
}