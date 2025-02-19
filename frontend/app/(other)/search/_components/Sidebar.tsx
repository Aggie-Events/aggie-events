import React from "react";

interface SidebarProps {
  onFilterChange: (filters: { tags?: string[]; dateRange?: [Date, Date]; timeRange?: [string, string] }) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange }) => {
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map(tag => tag.trim());
    onFilterChange({ tags });
  };

  const handleDateRangeChange = (start: Date, end: Date) => {
    onFilterChange({ dateRange: [start, end] });
  };

  const handleTimeRangeChange = (start: string, end: string) => {
    onFilterChange({ timeRange: [start, end] });
  };

  return (
    <div className="sidebar bg-white shadow-lg p-4 rounded-lg w-64">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Tags</h4>
        <input
          type="text"
          placeholder="Enter tags separated by commas"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-maroon"
          onChange={handleTagChange}
        />
      </div>

      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Date Range</h4>
        <input
          type="date"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-maroon mb-2"
          onChange={(e) => handleDateRangeChange(new Date(e.target.value), new Date())}
        />
        <input
          type="date"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-maroon"
          onChange={(e) => handleDateRangeChange(new Date(), new Date(e.target.value))}
        />
      </div>

      <div>
        <h4 className="text-md font-medium mb-2">Time Range</h4>
        <input
          type="time"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-maroon mb-2"
          onChange={(e) => handleTimeRangeChange(e.target.value, "")}
        />
        <input
          type="time"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-maroon"
          onChange={(e) => handleTimeRangeChange("", e.target.value)}
        />
      </div>
    </div>
  );
};

export default Sidebar; 