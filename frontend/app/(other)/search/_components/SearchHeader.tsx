import React from 'react';
import { SearchFilters } from "@/config/query-types";

interface SearchHeaderProps {
  filters: React.MutableRefObject<SearchFilters>;
  onSearch: () => void;
  sortOptions: Array<{ display: string; value: string }>;
}

export default function SearchHeader({ filters, onSearch, sortOptions }: SearchHeaderProps) {
  return (
    <div className="bg-white rounded-lg p-3 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="col-span-2">
          <input
            type="text"
            placeholder="Search events, organizations, or keywords"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-maroon"
            onChange={(e) => {
              filters.current = {
                ...filters.current,
                name: e.target.value,
              };
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />
        </div>
        <div>
          <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-maroon">
            <option>Any Location</option>
            <option>MSC</option>
            <option>Kyle Field</option>
            <option>Zachry</option>
            <option>Evans Library</option>
          </select>
        </div>
        <div>
          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-maroon"
            onChange={(e) => {
              filters.current = {
                ...filters.current,
                sort: e.target.value,
              };
              onSearch();
            }}
          >
            {sortOptions.map(({ display, value }) => (
              <option key={value} value={value}>
                {display}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 