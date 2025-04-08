"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchFilters, setFilterParam, castFilterParam } from "@/config/query-types";
import { useEventSearch, useToggleEventSave } from "@/api/event";
import EventDisplay from "./_components/_event-display/EventDisplay";
import PageSelect from "./_components/PageSelect";
import Sidebar from "./_components/_filter-sidebar/FilterSidebar";
import SortOption from "./_components/SortOption";
import LoadingBar from "@/components/LoadingBar";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthContext";
import ToastManager from "@/components/toast/ToastManager";
import LoginScreen from "@/components/auth/LoginScreen";

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
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [eventStates, setEventStates] = useState<Record<number, { isSaved: boolean; saves: number }>>({});
  const { mutateAsync: toggleEventSave } = useToggleEventSave();
  
  const { data: searchResults, isLoading, isFetching } = useEventSearch(searchParams.toString());
  const results = searchResults?.events;
  
  const [tags, setTags] = useState<string[]>(
    filters.current.tags ? Array.from(filters.current.tags) : []
  );
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

  const handleSaveEvent = (eventId: number) => {
    if (!user) {
      ToastManager.addToast("Please login to save events", "error", 3000);
      setShowLogin(true);
      return;
    }

    const event = results?.find(e => e.event_id === eventId);
    if (!event) return;

    // Update the event card state
    // Functions like an optimistic update to show the event as saved immediately without having to refetch
    const currentState = eventStates[eventId] || { 
      isSaved: event.event_saved ?? false, 
      saves: event.event_saves 
    };
    
    toggleEventSave({ eventId: eventId.toString(), isCurrentlySaved: currentState.isSaved }).then(() => {
      setEventStates(prev => ({
        ...prev,
        [eventId]: {
          isSaved: !currentState.isSaved,
          saves: currentState.saves + (currentState.isSaved ? -1 : 1)
        }
      }));
    });
  };

  const handleBlockEvent = (eventId: number) => {
    // Implement block functionality
    console.log(`Blocked event: ${eventId}`);
  };

  const handleReportEvent = (eventId: number) => {
    // Implement report functionality
    console.log(`Reported event: ${eventId}`);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] relative">
      <AnimatePresence>
        {isFetching && <LoadingBar />}
      </AnimatePresence>

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

                <div className="flex flex-col gap-4">
                  {results.map((event) => {
                    const state = eventStates[event.event_id] || {
                      isSaved: event.event_saved ?? false,
                      saves: event.event_saves
                    };
                    
                    return (
                      <EventDisplay
                        key={event.event_id}
                        event={event}
                        onSaveEvent={handleSaveEvent}
                        onBlockEvent={handleBlockEvent}
                        onReportEvent={handleReportEvent}
                        isSaved={state.isSaved}
                        saves={state.saves}
                      />
                    );
                  })}
                </div>

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
      {showLogin && <LoginScreen onClose={() => setShowLogin(false)} />}
    </div>
  );
}
