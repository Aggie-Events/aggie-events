"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SearchFilters,
} from "@/config/query-types";
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
import { DraggableSidebar } from "@/components/common/DraggableSidebar";
import { useFilterHook } from "./_components/FilterHook";

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
  const { push } = useRouter();
  const { user } = useAuth();

  const { mutateAsync: toggleEventSave } = useToggleEventSave();
  const {
    data: results,
    isLoading,
    isFetching,
  } = useEventSearch(searchParams.toString());

  const [showLogin, setShowLogin] = useState(false);
  const [eventStates, setEventStates] = useState<
    Record<number, { isSaved: boolean; saves: number }>
  >({});
  const { filters } = useFilterHook();

  function updateSearchParams(filters: SearchFilters) {
    // Update the URL with the current filters
    const params = new URLSearchParams();

    // Add current filter params
    Object.entries(filters).forEach(([key, val]) => {
      if (val) {
        if (val instanceof Set) {
          val.size > 0
            ? params.set(key, Array.from(val).join(","))
            : params.delete(key);
        } else if (Array.isArray(val)) {
          params.set(key, val.join(","));
        } else {
          params.set(key, val.toString());
        }
      }
    });

    push(`/search?${params.toString()}`);
  }

  const handleSaveEvent = (eventId: number) => {
    if (!user) {
      ToastManager.addToast("Please login to save events", "error", 3000);
      setShowLogin(true);
      return;
    }

    const event = results?.events?.find((e) => e.event_id === eventId);
    if (!event) return;

    // Update the event card state
    // Functions like an optimistic update to show the event as saved immediately without having to refetch
    const currentState = eventStates[eventId] || {
      isSaved: event.event_saved ?? false,
      saves: event.event_saves,
    };

    toggleEventSave({
      eventId: eventId.toString(),
      isCurrentlySaved: currentState.isSaved,
    }).then(() => {
      setEventStates((prev) => ({
        ...prev,
        [eventId]: {
          isSaved: !currentState.isSaved,
          saves: currentState.saves + (currentState.isSaved ? -1 : 1),
        },
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
      <AnimatePresence>{isFetching && <LoadingBar />}</AnimatePresence>

      {/* Main content area with filters and results */}
      <div className="flex flex-1 overflow-hidden">
        <DraggableSidebar>
          <div className="h-full p-4">
            <Sidebar
              filters={filters}
              onFilterChange={(newFilters: SearchFilters) =>
                updateSearchParams({ ...newFilters, page: undefined })
              }
            />
          </div>
        </DraggableSidebar>

        {/* Results area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl">
            {isLoading ? (
              <div className="w-full flex justify-center items-center min-h-[200px]">
                <div className="w-12 h-12 border-4 border-maroon border-t-transparent rounded-full animate-spin" />
              </div>
            ) : results ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center z-10 bg-white px-4 py-2 sticky top-0 border-b border-gray-200">
                  <h1 className="text-lg font-semibold">
                    {results.resultSize} results{" "}
                    {filters.query ? `for "${filters.query}" ` : " "}
                    <span className="text-gray-500 text-sm">
                      ({results.duration.toFixed(2)} ms)
                    </span>
                  </h1>
                  <SortOption
                    currentSort={filters.sort ?? "start"}
                    onUpdate={(value) => {
                      updateSearchParams({ ...filters, sort: value, page: 1 });
                    }}
                    sortOptions={sortOptions}
                  />
                </div>

                <div className="flex flex-col gap-4 p-4">
                  {results.events.map((event) => {
                    const state = eventStates[event.event_id] || {
                      isSaved: event.event_saved ?? false,
                      saves: event.event_saves,
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

                {results.events.length < results.resultSize && (
                  <div className="flex justify-center mt-6">
                    <PageSelect
                      page={filters.page ?? 1}
                      pageSize={results.pageSize}
                      setPage={(page) => {
                        updateSearchParams({ ...filters, page });
                      }}
                      maxResults={results.resultSize}
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
