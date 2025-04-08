"use client";
import React, { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { FaBookmark, FaFilter, FaSearch, FaTags } from "react-icons/fa";
import { useSavedEvents, useToggleEventSave, SearchEventsReturn } from "@/api/event";
import { useAuth } from "@/components/auth/AuthContext";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AnimatePresence } from "framer-motion";
import LoadingBar from "@/components/LoadingBar";
import ToastManager from "@/components/toast/ToastManager";
import LoginScreen from "@/components/auth/LoginScreen";
import EventDisplay from "@/app/search/_components/_event-display/EventDisplay";
import Sidebar from "@/app/search/_components/_filter-sidebar/FilterSidebar";
import SortOption from "@/app/search/_components/SortOption";
import PageSelect from "@/app/search/_components/PageSelect";
import Link from "next/link";

// Sort options
const sortOptions = [
  { display: "Date Saved (Newest)", value: "saved_desc" },
  { display: "Date Saved (Oldest)", value: "saved_asc" },
  { display: "Event Date (Upcoming)", value: "start_asc" },
  { display: "Event Date (Later)", value: "start_desc" },
  { display: "Most Popular", value: "saves_desc" },
  { display: "Alphabetical (A-Z)", value: "name_asc" },
  { display: "Alphabetical (Z-A)", value: "name_desc" },
];

// Extended interface to include saved_at field
interface SavedEvent extends SearchEventsReturn {
  saved_at: Date;
}

export default function SavedEventsPage() {
  const { user } = useAuth();
  const { data: savedEventsData = [], isLoading, isError, error } = useSavedEvents();
  const { mutateAsync: toggleEventSave } = useToggleEventSave();
  
  // Cast the saved events to our extended interface
  const savedEvents = savedEventsData as SavedEvent[];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("saved_desc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [eventStates, setEventStates] = useState<Record<number, { isSaved: boolean; saves: number }>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;
  
  // Sidebar width for draggable sidebar
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  
  // Parse the sort value
  const [sortField, sortDirection] = useMemo(() => {
    const [field, direction] = sortValue.split("_");
    return [field, direction];
  }, [sortValue]);
  
  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    // Get all available tags from saved events
    const allTags = new Set<string>();
    savedEvents.forEach(event => {
      if (event.tags) {
        event.tags.forEach(tag => allTags.add(tag));
      }
    });
    
    // Filter events
    let filtered = savedEvents.filter(event => {
      // Text search filter
      const textMatch = !searchQuery || (
        (event.event_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.event_description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.event_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      
      // Tags filter
      const tagsMatch = selectedTags.length === 0 || 
        (event.tags && selectedTags.some(tag => event.tags.includes(tag)));
      
      return textMatch && tagsMatch;
    });
    
    // Sort events
    return filtered.sort((a, b) => {
      const modifier = sortDirection === "asc" ? 1 : -1;
      
      switch (sortField) {
        case "name":
          return modifier * (a.event_name?.localeCompare(b.event_name || "") || 0);
        case "start":
          return modifier * ((new Date(a.start_time || 0)).getTime() - (new Date(b.start_time || 0)).getTime());
        case "saved":
          return modifier * ((new Date(a.saved_at || 0)).getTime() - (new Date(b.saved_at || 0)).getTime());
        case "saves":
          return modifier * ((a.event_saves || 0) - (b.event_saves || 0));
        default:
          return 0;
      }
    });
  }, [savedEvents, searchQuery, sortField, sortDirection, selectedTags]);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortValue, selectedTags]);
  
  // Handle tag selection from sidebar
  const handleFilterChange = (newFilters: { tags?: string[] }) => {
    if (newFilters.tags) setSelectedTags(newFilters.tags);
  };
  
  // Pagination
  const paginatedEvents = filteredAndSortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Handle save/unsave event
  const handleSaveEvent = (eventId: number) => {
    if (!user) {
      ToastManager.addToast("Please login to save events", "error", 3000);
      setShowLogin(true);
      return;
    }

    const event = savedEvents.find(e => e.event_id === eventId);
    if (!event) return;

    // Get current save state
    const currentState = eventStates[eventId] || { 
      isSaved: true, // All events on this page are saved by default
      saves: event.event_saves 
    };
    
    // Call the API to toggle save status
    toggleEventSave({ eventId: eventId.toString(), isCurrentlySaved: currentState.isSaved }).then(() => {
      // Update local state
      setEventStates(prev => ({
        ...prev,
        [eventId]: {
          isSaved: !currentState.isSaved,
          saves: currentState.saves + (currentState.isSaved ? -1 : 1)
        }
      }));
    });
  };
  
  // Placeholder functions
  const handleBlockEvent = (eventId: number) => {
    console.log(`Blocked event: ${eventId}`);
  };

  const handleReportEvent = (eventId: number) => {
    console.log(`Reported event: ${eventId}`);
  };
  
  // Sidebar drag handlers
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

  // Show login prompt if not authenticated
  if (user === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <FaBookmark className="text-5xl text-maroon mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your Saved Events</h1>
          <p className="text-gray-600 mb-6">
            Please log in to view and manage your saved events.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-2 bg-maroon text-white rounded-md hover:bg-darkmaroon transition-colors"
          >
            Log In
          </button>
        </div>
        {showLogin && <LoginScreen onClose={() => setShowLogin(false)} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full mb-8">
      <AnimatePresence>
        {isLoading && <LoadingBar />}
      </AnimatePresence>
      
      {/* Page header */}
      <div className="w-full bg-white border-b">
        <div className="mx-auto py-4 px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <FaBookmark className="text-maroon" />
                Your Saved Events
              </h1>
              <p className="text-gray-600">Events you've saved for later</p>
            </div>
            
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-sm rounded-full flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => {
                        setSelectedTags(selectedTags.filter(t => t !== tag));
                      }}
                      className="hover:text-maroon"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-maroon hover:underline"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div 
          className={`bg-white border-r overflow-y-auto h-full ${!showFilters ? 'hidden md:block' : 'block'}`}
          style={{ width: sidebarWidth }}
        >
          <div className="h-full p-4">
            <Sidebar onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Drag handle */}
        <div
          className="w-1 h-full bg-transparent hover:bg-gray-200 active:bg-gray-300 transition-colors cursor-col-resize hidden md:block"
          onMouseDown={handleMouseDown}
        />

        {/* Results area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 max-w-7xl">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="w-full md:w-auto">
                  <button 
                    onClick={() => setShowFilters(!showFilters)} 
                    className="md:hidden px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 w-full"
                  >
                    <FaFilter className="inline mr-2" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
                  {/* Search */}
                  <div className="relative w-full sm:w-60">
                    <input
                      type="text"
                      placeholder="Search saved events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  {/* Sort Dropdown */}
                  <div className="relative w-full sm:w-auto">
                    <select
                      value={sortValue}
                      onChange={(e) => setSortValue(e.target.value)}
                      className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent appearance-none bg-white"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.display}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="w-full flex justify-center items-center min-h-[200px]">
                <LoadingSpinner />
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <div className="text-maroon text-4xl mb-4">Oops!</div>
                <p className="text-gray-600 mb-4">
                  {error instanceof Error ? error.message : "Error loading saved events"}
                </p>
                {error instanceof Error && error.message.includes("login") && (
                  <button
                    onClick={() => setShowLogin(true)}
                    className="px-6 py-2 bg-maroon text-white rounded-md hover:bg-darkmaroon transition-colors"
                  >
                    Log In
                  </button>
                )}
              </div>
            ) : filteredAndSortedEvents.length === 0 ? (
              <div className="text-center py-12">
                <FaBookmark className="text-5xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No saved events found</h2>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedTags.length > 0 
                    ? "No events match your search criteria. Try adjusting your filters."
                    : "You haven't saved any events yet. Browse events and click the save button to add them here."}
                </p>
                <Link 
                  href="/search" 
                  className="px-6 py-2 bg-maroon text-white rounded-md hover:bg-darkmaroon transition-colors inline-block"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center z-10">
                  <h2 className="text-xl font-semibold">
                    {filteredAndSortedEvents.length} saved events
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  {paginatedEvents.map((event) => {
                    const state = eventStates[event.event_id] || {
                      isSaved: true, // All events here are saved by default
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

                {filteredAndSortedEvents.length > itemsPerPage && (
                  <div className="flex justify-center mt-6">
                    <PageSelect
                      page={currentPage}
                      pageSize={itemsPerPage}
                      setPage={setCurrentPage}
                      maxResults={filteredAndSortedEvents.length}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {showLogin && <LoginScreen onClose={() => setShowLogin(false)} />}
    </div>
  );
} 