import React from "react";
import { FaSearch } from "react-icons/fa";
import EventList from "@/app/(other)/search/EventList";

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

// By default, search will be for future events
export default function Search() {
  return (
    <div className="flex flex-row absolute w-full h-full justify-center">
      <div className="flex flex-col grow-0 h-full basis-[1500px]">
        {/* Upper Box */}
        <div className="shadow-md">
          <div className="px-5 py-5 border-b-[1px] border-gray-200">
            <h1 className="text-4xl font-semibold">Search Page</h1>
            <h2 className="text-lg mt-3">
              This is the search page. You can search for events here.
            </h2>
            <div className="flex mt-2">
              <input
                alt="Test"
                className="bg-gray-100 rounded-sm px-2 max-w-[500px] w-full"
                placeholder="Search for event name, tags, organizations, locations..."
              ></input>
              <button className="bg-blue-500 rounded-r-md py-2 px-3">
                <FaSearch color="white" />
              </button>
            </div>
          </div>

          {/* Banner footer */}
          <div className="flex w-full border-b-[1px] border-gray-200">
            <span className="text-md font-semibold grow px-3 py-1 ">
              # results
            </span>
            <div className="flex border-l-[1px] border-gray-200 px-3 py-1 ">
              <span className="mr-2">Sort by:</span>
              <select>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 flex gap-2 grow">
          <div className="grow py-3 px-5">
            <h1 className="text-xl font-semibold">Search Results</h1>
            <EventList />
          </div>

          <div className="p-3 basis-52 bg-gray-50 shrink-0">
            <h1 className="text-xl font-semibold">Filter</h1>
            <p className="text-lg">
              This is where the filter options will be displayed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
