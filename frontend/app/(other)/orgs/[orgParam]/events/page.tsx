"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaSearch, FaChevronDown, FaCalendarAlt } from "react-icons/fa";
import { useOrgPageInformation } from "@/api/orgs";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useEventsByOrg } from "@/api/event";
import { useMenuSelect } from "@/components/common/MenuSelectionHook";
import OrgEventCard from "@/app/(other)/orgs/[orgParam]/events/_components/OrgEventCard";
import PageSelect from "@/app/search/_components/PageSelect";

type SortField = "name" | "date" | "saves";
type SortDirection = "asc" | "desc";

// Sort options for the dropdown
const sortOptions = [
  { value: "date-asc", label: "Date (Oldest First)" },
  { value: "date-desc", label: "Date (Newest First)" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "saves-asc", label: "Likes (Low to High)" },
  { value: "saves-desc", label: "Likes (High to Low)" },
];

// Sample tags for the filter
const availableTags = [
  "Academic",
  "Arts",
  "Career",
  "Cultural",
  "Recreation",
  "Service",
  "Social",
  "Sports",
  "Other",
];

export default function OrgEventsPage() {
  const { orgParam } = useParams<{ orgParam: string }>();
  const {
    data: org,
    isLoading,
    isError,
  } = useOrgPageInformation(orgParam as string);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortValue, setSortValue] = useState("date-asc");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Menu handles for filter sections
  const dateFilterMenu = useMenuSelect();
  const tagsMenu = useMenuSelect();
  const locationMenu = useMenuSelect();

  // Extract sort field and direction from the sort value
  const [sortField, sortDirection] = useMemo(() => {
    const [field, direction] = sortValue.split("-") as [
      SortField,
      SortDirection,
    ];
    return [field, direction];
  }, [sortValue]);

  // Fetch events for the organization
  const { data: events = [], isLoading: eventsLoading } = useEventsByOrg(
    org?.org_id ?? 0,
  );

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    // First filter the events
    let filtered = events.filter((event) => {
      // Text search filter
      const textMatch =
        !searchQuery ||
        event.event_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.event_description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        event.event_location
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        event.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      // Tags filter
      const tagsMatch =
        selectedTags.length === 0 ||
        (event.tags && selectedTags.some((tag) => event.tags.includes(tag)));

      // Date range filter
      let dateMatch = true;
      if (startDate && endDate && event.start_time) {
        const eventDate = new Date(event.start_time);
        dateMatch = eventDate >= startDate && eventDate <= endDate;
      }

      return textMatch && tagsMatch && dateMatch;
    });

    // Then sort them
    return filtered.sort((a, b) => {
      const modifier = sortDirection === "asc" ? 1 : -1;

      switch (sortField) {
        case "name":
          return (
            modifier * (a.event_name?.localeCompare(b.event_name || "") || 0)
          );
        case "date":
          return (
            modifier *
            (new Date(a.start_time || 0).getTime() -
              new Date(b.start_time || 0).getTime())
          );
        case "saves":
          return modifier * ((a.event_likes || 0) - (b.event_likes || 0));
        default:
          return 0;
      }
    });
  }, [
    events,
    searchQuery,
    sortField,
    sortDirection,
    selectedTags,
    startDate,
    endDate,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortValue, selectedTags, startDate, endDate]);

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  // Handle date selection
  const handleDateSelect = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Pagination calculation
  const paginatedEvents = filteredAndSortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !org) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold text-maroon mb-4">
          Organization Not Found
        </h1>
        <p className="text-gray-600">
          The organization you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-10 px-2 sm:px-4 md:px-8 lg:px-12">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Filters Column */}
        <div className={`md:block ${showFilters ? "block" : "hidden"}`}>
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Filters</h2>

              {/* Date filter */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Date</h3>
                  <button
                    onClick={() =>
                      dateFilterMenu.setIsMenuOpen(!dateFilterMenu.isMenuOpen)
                    }
                    className="text-sm text-gray-500 flex items-center"
                  >
                    <FaChevronDown
                      className={`ml-1 h-3 w-3 transition-transform ${dateFilterMenu.isMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {dateFilterMenu.isMenuOpen && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
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
                          endOfWeek.setDate(
                            today.getDate() + (7 - today.getDay()),
                          );
                          handleDateSelect(today, endOfWeek);
                        }}
                        className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                      >
                        This Week
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div>
                        <label className="block text-sm text-gray-700">
                          Start Date
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
                          onChange={(e) => {
                            const date = e.target.value
                              ? new Date(e.target.value)
                              : null;
                            handleDateSelect(date, endDate);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700">
                          End Date
                        </label>
                        <input
                          type="date"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
                          onChange={(e) => {
                            const date = e.target.value
                              ? new Date(e.target.value)
                              : null;
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
                    onClick={() =>
                      locationMenu.setIsMenuOpen(!locationMenu.isMenuOpen)
                    }
                    className="text-sm text-gray-500 flex items-center"
                  >
                    <FaChevronDown
                      className={`ml-1 h-3 w-3 transition-transform ${locationMenu.isMenuOpen ? "rotate-180" : ""}`}
                    />
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
                        <input
                          type="checkbox"
                          className="rounded text-maroon focus:ring-maroon h-4 w-4"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          On Campus
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-maroon focus:ring-maroon h-4 w-4"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Off Campus
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-maroon focus:ring-maroon h-4 w-4"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Virtual
                        </span>
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
                    <FaChevronDown
                      className={`ml-1 h-3 w-3 transition-transform ${tagsMenu.isMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {tagsMenu.isMenuOpen && (
                  <div className="space-y-2">
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {availableTags.map((tag) => (
                        <label key={tag} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded text-maroon focus:ring-maroon h-4 w-4"
                            checked={selectedTags.includes(tag)}
                            onChange={() => handleTagSelect(tag)}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {tag}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Clear filters button */}
              <button
                onClick={() => {
                  setSelectedTags([]);
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Events Column */}
        <div className="md:col-span-3 lg:col-span-4">
          {/* Combined Events Box */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header with Search and Sort */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Events
                  </h2>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200"
                  >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
                  {/* Search */}
                  <div className="relative w-full sm:w-60">
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 px-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>

                  {/* Sort Dropdown */}
                  <div className="w-full sm:w-auto">
                    <select
                      value={sortValue}
                      onChange={(e) => setSortValue(e.target.value)}
                      className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent appearance-none bg-white"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Active filters display */}
              {(selectedTags.length > 0 || startDate || endDate) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagSelect(tag)}
                        className="font-bold text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {startDate && endDate && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {startDate.toLocaleDateString()} -{" "}
                      {endDate.toLocaleDateString()}
                      <button
                        onClick={() => handleDateSelect(null, null)}
                        className="font-bold text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Events List */}
            {eventsLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : paginatedEvents.length > 0 ? (
              <div className="grid gap-4 p-4">
                {paginatedEvents.map((event) => (
                  <OrgEventCard key={event.event_id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <FaCalendarAlt className="text-5xl text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No events found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery ||
                  selectedTags.length > 0 ||
                  startDate ||
                  endDate
                    ? "No events match your search criteria. Try different filters."
                    : "This organization hasn't posted any events yet. Check back later or follow to get notified when they do."}
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredAndSortedEvents.length > itemsPerPage && (
              <div className="flex justify-center p-6 border-t border-gray-200">
                <PageSelect
                  page={currentPage}
                  pageSize={itemsPerPage}
                  setPage={setCurrentPage}
                  maxResults={filteredAndSortedEvents.length}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
