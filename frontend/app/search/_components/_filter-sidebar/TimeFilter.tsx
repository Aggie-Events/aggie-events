import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useMenuHandle } from "@/components/MenuHandle";
import { FilterButton } from "./FilterButton";
interface TimeFilterProps {
  onTimeChange: (startTime: string, endTime: string) => void;
}

export default function TimeFilter({ onTimeChange }: TimeFilterProps) {
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const timeFilterMenu = useMenuHandle({ isOpen: true });

  const handleTimeSelect = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);

    if (start && end) {
      onTimeChange(start, end);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Time</h3>
        <button
          onClick={() =>
            timeFilterMenu.setIsMenuOpen(!timeFilterMenu.isMenuOpen)
          }
          className="text-sm text-gray-500 flex items-center"
        >
          <FaChevronDown
            className={`ml-1 h-3 w-3 transition-transform ${timeFilterMenu.isMenuOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {timeFilterMenu.isMenuOpen && (
        <div className="space-y-2">
          <div className="flex flex-col gap-2">
            <FilterButton
              onClick={() => handleTimeSelect("", "")}
              active={startTime === "" && endTime === ""}
              text="Any"
            />
            <div>
              <label className="block text-sm text-gray-700">Start Time</label>
              <input
                type="time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
                value={startTime}
                onChange={(e) => handleTimeSelect(e.target.value, endTime)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">End Time</label>
              <input
                type="time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
                value={endTime}
                onChange={(e) => handleTimeSelect(startTime, e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
