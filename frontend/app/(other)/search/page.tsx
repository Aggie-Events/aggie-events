import React from "react";
import { FaSearch } from "react-icons/fa";
import EventList from "@/app/(other)/search/EventList";
import CollapsableConfig from "@/app/(other)/search/CollapsableConfig";
import FilterInput from "@/app/(other)/search/FilterInput";

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
  "Date Posted",
  "Date Updated",
  "Alphabetical (A-Z)",
  "Alphabetical (Z-A)",
  "Most Popular",
];
const viewOptions = ["List View", "Calendar View"];
export default function Search() {
  return (
    <div className="flex flex-row w-full grow justify-center bg-white">
      <div className="flex flex-col grow-0 h-full min-h-fit basis-[1500px] bg-white relative">
        {/* Banner footer */}
        <div
          className="flex w-full border-b-[1px] border-gray-200 h-12 items-center
        sticky top-0 bg-white z-20"
        >
          <div className="grow px-1">
            <select className="bg-gray-100 text-md px-1 outline-0">
              {viewOptions.map((option) => (
                <option key={option} className="bg-white">
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex border-l-[1px] border-gray-200 px-3 py-1 items-center">
            <span className="mr-2">Sort by:</span>
            <select className="bg-gray-200 p-1 outline-0">
              {sortOptions.map((option) => (
                <option key={option} className="bg-gray-200">
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2 grow">
          <div className="p-3 basis-72 shrink-0">
            <div className="flex gap-2">
              <div className="text-lg font-semibold">Search For: </div>
              <select className="bg-gray-100 text-lg px-1 outline-0 font-semibold">
                <option className="font-semibold bg-white">Event</option>
                <option className="font-semibold bg-white">Organization</option>
              </select>
            </div>
            <CollapsableConfig title="Name">
              <FilterInput />
            </CollapsableConfig>
            <CollapsableConfig title="Tag">
              <FilterInput />
            </CollapsableConfig>
          </div>

          <div className="grow py-3 px-5">
            <h1 className="text-2xl font-bold">Search Results</h1>
            <h3>3 results (0.12 seconds)</h3>
            <EventList />
          </div>
        </div>
      </div>
    </div>
  );
}
