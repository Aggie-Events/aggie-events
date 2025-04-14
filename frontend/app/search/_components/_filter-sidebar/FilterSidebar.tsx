import React, { useState, useEffect } from "react";
import DateFilter from "./DateFilter";
import TimeFilter from "./TimeFilter";
import TagsFilter from "./TagsFilter";
import { SearchFilters } from "@/config/query-types";

interface SidebarProps {
  onFilterChange: (filters: SearchFilters) => void;
  filters: SearchFilters;
}

export default function Sidebar({ onFilterChange, filters }: SidebarProps) {
  const applyFilters = (newFilters: SearchFilters) => {
    console.log({
      tags: new Set(newFilters.tags),
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
      startTime: newFilters.startTime ?? undefined,
      endTime: newFilters.endTime ?? undefined,
    });
    onFilterChange({
      tags: new Set(newFilters.tags),
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
      startTime: newFilters.startTime ?? undefined,
      endTime: newFilters.endTime ?? undefined,
    });
  };

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filters</h2>

        <button
          onClick={() =>
            applyFilters({
              ...filters,
              tags: new Set(),
              startDate: undefined,
              endDate: undefined,
              startTime: undefined,
              endTime: undefined,
            })
          }
          className="text-sm text-gray-500 hover:text-maroon"
        >
          Reset All
        </button>
      </div>

      <DateFilter
        onDateChange={(
          startDate: Date | undefined,
          endDate: Date | undefined,
        ) => {
          console.log("startDate", startDate
            ? startDate.toISOString().split("T")[0]
            : undefined);
          console.log("endDate", endDate
            ? endDate.toISOString().split("T")[0]
            : undefined);
          applyFilters({
            ...filters,
            startDate: startDate
              ? startDate.toISOString().split("T")[0]
              : undefined,
            endDate: endDate ? endDate.toISOString().split("T")[0] : undefined,
          });
        }}
        startDate={filters.startDate ? new Date(filters.startDate) : undefined}
        endDate={filters.endDate ? new Date(filters.endDate) : undefined}
      />
      <TimeFilter
        onTimeChange={(startTime: string | undefined, endTime: string | undefined) =>
          applyFilters({ ...filters, startTime, endTime })
        }
        startTime={filters.startTime}
        endTime={filters.endTime}
      />
       {/* <LocationFilter onLocationChange={(locations: string[]) => applyFilters({ ...filters, locations })} /> */}
      <TagsFilter
        onTagsChange={(tags: string[]) =>
          applyFilters({ ...filters, tags: new Set(tags) })
        }
        selectedTags={Array.from(filters.tags || new Set())}
      /> 

      <button
        onClick={() => applyFilters(filters)}
        className="w-full py-2 px-4 bg-maroon text-white rounded-md hover:bg-maroon-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maroon"
      >
        Apply Filters
      </button>
    </div>
  );
}
