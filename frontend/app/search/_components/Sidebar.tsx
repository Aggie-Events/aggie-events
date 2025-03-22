import React, { useState } from "react";
import { useMenuHandle } from "@/components/MenuHandle";
import { FaCalendarAlt, FaChevronDown } from "react-icons/fa";

interface SidebarProps {
  onFilterChange: (filters: { 
    tags?: string[]; 
    dateRange?: [Date, Date]; 
    timeRange?: [string, string] 
  }) => void;
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  const dateFilterMenu = useMenuHandle();
  const locationMenu = useMenuHandle();
  const tagsMenu = useMenuHandle();
  
  const handleTagSelect = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    onFilterChange({ tags: newTags });
  };
  
  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
    
    if (start && end) {
      onFilterChange({ dateRange: [start, end] });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Filters</h2>
      
      {/* Date filter */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Date</h3>
          <button 
            onClick={() => dateFilterMenu.setIsMenuOpen(!dateFilterMenu.isMenuOpen)}
            className="text-sm text-gray-500 flex items-center"
          >
            <FaChevronDown className={`ml-1 h-3 w-3 transition-transform ${dateFilterMenu.isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {dateFilterMenu.isMenuOpen && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDateSelect(new Date(), new Date())}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  handleDateSelect(tomorrow, tomorrow);
                }}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Tomorrow
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const endOfWeek = new Date();
                  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
                  handleDateSelect(today, endOfWeek);
                }}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                This Week
              </button>
            </div>
            
            <div className="flex flex-col gap-2">
              <div>
                <label className="block text-sm text-gray-700">Start Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    handleDateSelect(date, endDate);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">End Date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    handleDateSelect(startDate, date);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Location filter */}
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
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Search locations..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
            />
            <div className="space-y-1">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-maroon focus:ring-maroon h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">On Campus</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-maroon focus:ring-maroon h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">Off Campus</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-maroon focus:ring-maroon h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700">Virtual</span>
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Tags filter */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Tags</h3>
          <button 
            onClick={() => tagsMenu.setIsMenuOpen(!tagsMenu.isMenuOpen)}
            className="text-sm text-gray-500 flex items-center"
          >
            <FaChevronDown className={`ml-1 h-3 w-3 transition-transform ${tagsMenu.isMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {tagsMenu.isMenuOpen && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Search tags..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
            />
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {["Academic", "Arts", "Career", "Cultural", "Recreation", "Service", "Social", "Sports", "Other"].map((tag) => (
                <label key={tag} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-maroon focus:ring-maroon h-4 w-4"
                    checked={selectedTags.includes(tag)}
                    onChange={() => handleTagSelect(tag)}
                  />
                  <span className="ml-2 text-sm text-gray-700">{tag}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <button
        onClick={() => {
          // Apply all filters
          onFilterChange({
            tags: selectedTags,
            dateRange: startDate && endDate ? [startDate, endDate] : undefined
          });
        }}
        className="w-full py-2 px-4 bg-maroon text-white rounded-md hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon"
      >
        Apply Filters
      </button>
    </div>
  );
}