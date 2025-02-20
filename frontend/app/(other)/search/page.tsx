"use client";
import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchFilters, setFilterParam, castFilterParam } from "@/config/query-types";
import { useEventSearch } from "@/api/event";
import EventList from "./_components/EventList";
import PageSelect from "./_components/PageSelect";
import Sidebar from "./_components/Sidebar";
import SearchHeader from "./_components/SearchHeader";
import CategoryTags, { Category, categories } from "./_components/CategoryTags";

// Filters
// - Date Range
// - Time
//   - All-day
//   - Support for multiday events with different times?
// - Location
// - Tags
// - Organizations
// - Sort by
// - Search bar

// Topic Page (browse popular tags)
// Tag page (browse events with a specific tag)

// By default, search will be for future events

const sortOptions = [
  { display: "Date: Upcoming", value: "start" },
  { display: "Most Popular", value: "heart" },
  { display: "Recently Added", value: "posted" },
  { display: "Recently Updated", value: "updated" },
  { display: "Alphabetical (A-Z)", value: "alpha_asc" },
  { display: "Alphabetical (Z-A)", value: "alpha_desc" },
];

export default function Search() {
  const searchParams = useSearchParams();
  const filters = useRef<SearchFilters>(getFilters());
  const { push } = useRouter();
  
  const { data: searchResults, isLoading } = useEventSearch(searchParams.toString());
  const results = searchResults?.events;
  
  const [tags, setTags] = useState<string[]>(
    filters.current.tags ? Array.from(filters.current.tags) : []
  );
  const [selectedCategory, setSelectedCategory] = useState<Category>("All Events");

  function getFilters(): SearchFilters {
    const params = new URLSearchParams(searchParams);
    let newFilters: SearchFilters = {};
    for (const [key, value] of params.entries()) {
      const castKey = key as keyof SearchFilters;
      const val = castFilterParam(key, value);
      setFilterParam(newFilters, castKey, val);
    }
    return newFilters;
  }

  function updateUrl() {
    const params = new URLSearchParams(searchParams);
    Object.entries(filters.current).forEach(([key, val]) => {
      if (val) {
        if (val instanceof Set) {
          val.size > 0 ? params.set(key, Array.from(val).join(",")) : params.delete(key);
        } else if (Array.isArray(val)) {
          params.set(key, val.join(","));
        } else {
          params.set(key, val.toString());
        }
      } else {
        params.delete(key);
      }
    });
    setTags(Array.from(filters.current.tags ?? []));
    push(`/search?${params.toString()}`);
  }

  function handleCategorySelect(category: Category) {
    filters.current.tags = category === "All Events" ? new Set() : new Set([category]);
    setSelectedCategory(category);
    filters.current.page = 1;
    updateUrl();
  }

  const handleFilterChange = (newFilters: { 
    tags?: string[]; 
    dateRange?: [Date, Date]; 
    timeRange?: [string, string] 
  }) => {
    if (newFilters.tags) filters.current.tags = new Set(newFilters.tags);
    // if (newFilters.dateRange) {
    //   filters.current.dateRange![0] = newFilters.dateRange[0];
    //   filters.current.dateRange![1] = newFilters.dateRange[1];
    // }
    // if (newFilters.timeRange) {
    //   filters.current.dateRange![0] = newFilters.timeRange[0];
    //   filters.current.timeRange![1] = newFilters.timeRange[1];
    // }
    updateUrl();
  };

  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col w-full">
        <div className="bg-white shadow-md px-4 py-4 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto">
            <SearchHeader 
              filters={filters}
              onSearch={updateUrl}
              sortOptions={sortOptions}
            />
            <CategoryTags
              filters={filters}
              selectedCategory={selectedCategory}
              tags={tags}
              onCategorySelect={handleCategorySelect}
              onUpdateFilters={updateUrl}
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full py-4 flex gap-2">
          <Sidebar onFilterChange={handleFilterChange} />
          {isLoading ? (
            <div className="w-full flex justify-center items-center">
              <div className="w-12 h-12 border-4 border-maroon border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-light">
                  {searchResults.resultSize} Results{" "}
                  <span className="text-gray-500 text-sm">
                    ({searchResults.duration.toFixed(2)} ms)
                  </span>
                </h1>
              </div>

              <EventList events={results} />

              {results.length < searchResults.resultSize && (
                <div className="flex justify-center mt-6">
                  <PageSelect
                    page={filters.current.page ?? 1}
                    pageSize={searchResults.pageSize}
                    setPage={(page) => {
                      filters.current.page = page;
                      updateUrl();
                    }}
                    maxResults={searchResults.resultSize}
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
