"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchFilters, setFilterParam, castFilterParam } from "@/config/query-types";
import { useEventSearch } from "@/api/event";
import EventList from "./_components/EventList";
import PageSelect from "./_components/PageSelect";
import Sidebar from "./_components/Sidebar";
import SortOption from "./_components/SortOption";
import QuickFilters, { Category, categories } from "./_components/QuickFilters";
import LoadingBar from "@/components/LoadingBar";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

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
  
  const { data: searchResults, isLoading, isFetching } = useEventSearch(searchParams.toString());
  const results = searchResults?.events;
  
  const [tags, setTags] = useState<string[]>(
    filters.current.tags ? Array.from(filters.current.tags) : []
  );
  const [selectedCategory, setSelectedCategory] = useState<Category>("All Events");
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

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
    updateUrl();
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;
    document.body.classList.add('select-none');
  }, [sidebarWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    
    const delta = e.clientX - startX.current;
    const newWidth = startWidth.current + delta;
    
    if (newWidth >= 200 && newWidth <= 600) {
      setSidebarWidth(newWidth);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.classList.remove('select-none');
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] relative">
      <AnimatePresence>
        {isFetching && <LoadingBar />}
      </AnimatePresence>
      
      {/* Top bar with category tags */}
      <div className="w-full bg-white border-b">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-gray-500">Quick Filters</h2>
            <QuickFilters
              filters={filters}
              selectedCategory={selectedCategory}
              tags={tags}
              onCategorySelect={handleCategorySelect}
              onUpdateFilters={updateUrl}
            />
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-sm rounded-full flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => {
                      filters.current.tags = new Set(
                        Array.from(filters.current.tags || []).filter(t => t !== tag)
                      );
                      updateUrl();
                    }}
                    className="hover:text-maroon"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content area with filters and results */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div 
          className="bg-white border-r overflow-y-auto h-full"
          style={{ width: sidebarWidth }}
        >
          <div className="h-full p-4">
            <Sidebar onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Drag handle */}
        <div
          className="w-1 h-full bg-transparent hover:bg-gray-200 active:bg-gray-300 transition-colors cursor-col-resize"
          onMouseDown={handleMouseDown}
        />

        {/* Results area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 max-w-7xl">
            {isLoading ? (
              <div className="w-full flex justify-center items-center min-h-[200px]">
                <div className="w-12 h-12 border-4 border-maroon border-t-transparent rounded-full animate-spin" />
              </div>
            ) : results && searchResults ?  (
              <div className="space-y-4">
                <div className="flex justify-between items-center z-10">
                  <h1 className="text-xl font-semibold">
                    {searchResults.resultSize} results{" "}
                    <span className="text-gray-500 text-sm">
                      ({searchResults.duration.toFixed(2)} ms)
                    </span>
                  </h1>
                  <SortOption 
                    filters={filters}
                    onSearch={updateUrl}
                    sortOptions={sortOptions}
                  />
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
    </div>
  );
}
