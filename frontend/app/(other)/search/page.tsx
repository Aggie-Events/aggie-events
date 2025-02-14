"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FilterTagList from "@/app/(other)/search/_components/filter-tag-list/FilterTagList";
import {
  SearchFilters,
  setFilterParam,
  castFilterParam,
} from "@/config/query-types";
import { searchEvents, SearchEventsReturn } from "@/api/event";
import EventList from "@/app/(other)/search/_components/EventList";
import FilterList, {
  FilterListOutput,
} from "@/app/(other)/search/_components/filter-list/FilterList";
import PageSelect from "@/app/(other)/search/_components/PageSelect";

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

const sortOptions: { display: string; value: string }[] = [
  { display: "Date: Upcoming", value: "start" },
  { display: "Most Popular", value: "heart" },
  { display: "Recently Added", value: "posted" },
  { display: "Recently Updated", value: "updated" },
  { display: "Alphabetical (A-Z)", value: "alpha_asc" },
  { display: "Alphabetical (Z-A)", value: "alpha_desc" },
];

const categories = [
  "All Events",
  "Today",
  "This Week",
  "Free Food",
  "Career Fairs",
  "Sports",
  "Academic",
  "Social",
  "Greek Life",
  "Workshops",
];

type Category = (typeof categories)[number];

export interface SearchState {
  page: number;
  duration: number;
  pageSize: number;
  totalResultSize: number;
}

export default function Search() {
  const searchParams = useSearchParams();
  const filters = useRef<SearchFilters>(getFilters());
  const { push } = useRouter();
  const [results, setResults] = useState<SearchEventsReturn[] | undefined>(
    undefined,
  );
  // Mostly to trigger a re-render when the tags are updated
  const [tags, setTags] = useState<string[]>(
    filters.current.tags ? Array.from(filters.current.tags) : [],
  );
  const [searchState, setSearchState] = useState<SearchState>({
    page: 1,
    duration: 0,
    pageSize: 0,
    totalResultSize: 0,
  });
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("All Events");

  // Returns SearchFilters object from the URL query parameters
  function getFilters(): SearchFilters {
    const params = new URLSearchParams(searchParams);
    let newFilters: SearchFilters = {};
    for (const [key, value] of params.entries()) {
      const castKey = key as keyof SearchFilters;
      const val = castFilterParam(key, value);
      setFilterParam(newFilters, castKey, val);
    }
    console.log("Filters: ", newFilters);
    return newFilters;
  }

  function setPage(page: number) {
    filters.current = {
      ...filters.current,
      page: page,
    };
    updateUrl();
  }

  useEffect(() => {
    filters.current = getFilters();
    if (filters.current.tags) {
      // Update selected category if it matches a tag
      const tagArray = Array.from(filters.current.tags);
      if (tagArray.length === 1 && categories.includes(tagArray[0])) {
        setSelectedCategory(tagArray[0] as Category);
      } else {
        setSelectedCategory("All Events");
      }
    }

    searchEvents(searchParams.toString()).then((res) => {
      setResults(res.events);
      setTags(Array.from(filters.current.tags ?? []));
      setSearchState({
        page: filters.current.page ?? 1,
        pageSize: res.pageSize,
        duration: res.duration,
        totalResultSize: res.resultSize,
      });
    });
  }, [searchParams]);

  // Updates the query parameters in the URL using the filter-list variable
  function updateUrl() {
    // TODO: If search query changes, reset page to 1
    // Manipulate url query parameters
    const params = new URLSearchParams(searchParams);
    Object.keys(filters.current).forEach((key) => {
      const val = filters.current[key as keyof SearchFilters];
      if (val) {
        // TODO: Consider just hard typing this to remove jank
        if (val instanceof Set) {
          if (val.size > 0) {
            params.set(key, Array.from(val).join(","));
          } else {
            params.delete(key);
          }
        } else if (Array.isArray(val)) {
          params.set(key, val.join(","));
        } else {
          params.set(key, val.toString());
        }
      } else {
        params.delete(key);
      }
    });
    if (filters.current.tags) {
      setTags(Array.from(filters.current.tags!));
    }
    push(`/search?${params.toString()}`);
  }

  function updateFilters(filtersUpdate: FilterListOutput) {
    if (filtersUpdate.name !== undefined) {
      filters.current.name = filtersUpdate.name.trim();
    }

    if (filtersUpdate.tag) {
      const newTag = filtersUpdate.tag.trim();
      const currentTags = filters.current.tags || new Set();

      if (!currentTags.has(newTag)) {
        filters.current.tags = new Set([...currentTags, newTag]);
        // Reset selected category when adding custom tags
        setSelectedCategory("All Events");
      }
    }

    // Reset to page 1 when changing filters
    filters.current.page = 1;
    updateUrl();
  }

  // Change the function signature to use Category type
  function handleCategorySelect(category: Category) {
    if (category === "All Events") {
      filters.current.tags = new Set();
    } else {
      filters.current.tags = new Set([category]);
    }
    setSelectedCategory(category); // No need for type assertion
    filters.current.page = 1;
    updateUrl();
  }

  return (
    <div className="flex flex-col w-full">
      {/* Modern Search Header - reduced vertical padding */}
      <div className="bg-white shadow-md px-4 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filter Bar - more compact spacing */}
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
                    if (e.key === "Enter") updateUrl();
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
                    updateUrl();
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

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {/* Category Pills - more compact */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-1 rounded-full border text-sm transition-all duration-300
                    ${
                      category === selectedCategory
                        ? "bg-maroon text-white border-maroon"
                        : "border-gray-200 hover:border-maroon hover:text-maroon"
                    }`}
                  onClick={() => handleCategorySelect(category as Category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Active Filters - inline with categories */}
            {tags && tags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">|</span>
                <FilterTagList
                  tags={tags}
                  onTagClose={(tag) => {
                    const newTags = new Set(filters.current.tags);
                    newTags.delete(tag);
                    filters.current.tags = newTags;
                    updateUrl();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section - reduced top padding */}
      <div className="max-w-6xl mx-auto w-full px-4 py-4">
        {results && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-light">
                {searchState.totalResultSize} Results{" "}
                <span className="text-gray-500 text-sm">
                  ({searchState.duration.toFixed(2)} ms)
                </span>
              </h1>
            </div>

            <EventList events={results} />

            {results?.length < searchState.totalResultSize && (
              <div className="flex justify-center mt-6">
                <PageSelect
                  page={searchState.page}
                  pageSize={searchState.pageSize}
                  setPage={(pageNum) => setPage(pageNum)}
                  maxResults={searchState.totalResultSize}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
