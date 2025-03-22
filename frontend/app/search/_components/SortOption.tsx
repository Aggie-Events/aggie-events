import React from "react";
import { SearchFilters } from "@/config/query-types";

interface SearchHeaderProps {
  filters: React.MutableRefObject<SearchFilters>;
  onSearch: () => void;
  sortOptions: Array<{ display: string; value: string }>;
}

export default function SortOption({
  filters,
  onSearch,
  sortOptions,
}: SearchHeaderProps) {
  return (
    <div className="flex justify-end min-w-fit">
      <select
        className="w-fit pl-3 py-2 border rounded-lg focus:outline-none focus:border-maroon text-sm"
        value={filters.current.sort || "start"}
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
            Sort by: {display}
          </option>
        ))}
      </select>
    </div>
  );
}
