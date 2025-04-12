import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useMenuHandle } from "@/components/MenuHandle";
import { FilterButton } from "./FilterButton";
import { useSearchParams } from "next/navigation";
import { formatTimeForInput } from "@/utils/date";

interface TimeFilterProps {
  onTimeChange: (startTime: string, endTime: string) => void;
  initialTimes?: [string | null, string | null]; // Optional initialTimes prop with nullable values
}

export default function TimeFilter({ onTimeChange, initialTimes }: TimeFilterProps) {
  const searchParams = useSearchParams();
  
  // Initialize from URL parameters or initialTimes prop if available
  const initialStartTime = initialTimes ? (initialTimes[0] || "") : (searchParams.get('startTime') || "");
  const initialEndTime = initialTimes ? (initialTimes[1] || "") : (searchParams.get('endTime') || "");
  
  const [startTime, setStartTime] = useState<string>(initialStartTime);
  const [endTime, setEndTime] = useState<string>(initialEndTime);
  const [activeTimeButton, setActiveTimeButton] = useState<string | null>("any");
  const timeFilterMenu = useMenuHandle({ isOpen: true });
  
  // Update state when initialTimes changes
  useEffect(() => {
    if (initialTimes) {
      setStartTime(initialTimes[0] || "");
      setEndTime(initialTimes[1] || "");
      
      // Determine the active button based on the times
      if ((!initialTimes[0] || initialTimes[0] === "") && (!initialTimes[1] || initialTimes[1] === "")) {
        setActiveTimeButton("any");
      } else if (initialTimes[0] === "06:00" && initialTimes[1] === "12:00") {
        setActiveTimeButton("morning");
      } else if (initialTimes[0] === "12:00" && initialTimes[1] === "17:00") {
        setActiveTimeButton("afternoon");
      } else if (initialTimes[0] === "17:00" && initialTimes[1] === "23:59") {
        setActiveTimeButton("evening");
      } else {
        setActiveTimeButton(null);
      }
    }
  }, [initialTimes]);
  
  // Set initial button state based on URL params
  useEffect(() => {
    if (!initialTimes) {
      if (initialStartTime || initialEndTime) {
        setActiveTimeButton(null);
      } else {
        setActiveTimeButton("any");
      }
    }
  }, [initialStartTime, initialEndTime, initialTimes]);

  const handleTimeSelect = (start: string, end: string, buttonName?: string) => {
    setStartTime(start);
    setEndTime(end);
    setActiveTimeButton(buttonName || null);
    onTimeChange(start, end);
  };
  
  const resetTimeFilter = () => {
    setStartTime("");
    setEndTime("");
    setActiveTimeButton("any");
    onTimeChange("", "");
  };
  
  // Preset time ranges
  const setMorning = () => {
    handleTimeSelect("06:00", "12:00", "morning");
  };
  
  const setAfternoon = () => {
    handleTimeSelect("12:00", "17:00", "afternoon");
  };
  
  const setEvening = () => {
    handleTimeSelect("17:00", "23:59", "evening");
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
          <div className="flex flex-wrap gap-2 mb-2">
            <FilterButton
              onClick={resetTimeFilter}
              active={activeTimeButton === "any"}
              text="Any"
            />
            <FilterButton
              onClick={setMorning}
              active={activeTimeButton === "morning"}
              text="Morning"
            />
            <FilterButton
              onClick={setAfternoon}
              active={activeTimeButton === "afternoon"}
              text="Afternoon"
            />
            <FilterButton
              onClick={setEvening}
              active={activeTimeButton === "evening"}
              text="Evening"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <div>
              <label className="block text-sm text-gray-700">Start Time</label>
              <input
                type="time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
                value={startTime}
                onChange={(e) => {
                  setActiveTimeButton(null);
                  handleTimeSelect(e.target.value, endTime);
                }}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">End Time</label>
              <input
                type="time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
                value={endTime}
                onChange={(e) => {
                  setActiveTimeButton(null);
                  handleTimeSelect(startTime, e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
