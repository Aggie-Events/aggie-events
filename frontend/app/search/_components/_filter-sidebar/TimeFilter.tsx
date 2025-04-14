import React from "react";
import { FilterButton } from "./FilterButton";
import { FilterSection } from "./FilterSection";

interface TimeFilterProps {
  onTimeChange: (startTime: string | undefined, endTime: string | undefined) => void;
  startTime: string | undefined;
  endTime: string | undefined;
}

type TimeFilterButton = "any" | "morning" | "afternoon" | "evening";

export default function TimeFilter({ onTimeChange, startTime, endTime }: TimeFilterProps) {
  const [activeTimeButton, setActiveTimeButton] = React.useState<TimeFilterButton | null>(null);

  const handleTimeSelect = (start: string | undefined, end: string | undefined, buttonName?: TimeFilterButton) => {
    setActiveTimeButton(buttonName || null);
    onTimeChange(start, end);
  };

  const resetTimeFilter = () => {
    setActiveTimeButton("any");
    onTimeChange(undefined, undefined);
  };

  return (
    <FilterSection title="Time">
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterButton
            onClick={resetTimeFilter}
            active={activeTimeButton === "any"}
            text="Any"
          />
          <FilterButton
            onClick={() => handleTimeSelect("06:00", "12:00", "morning")}
            active={activeTimeButton === "morning"}
            text="Morning"
          />
          <FilterButton
            onClick={() => handleTimeSelect("12:00", "17:00", "afternoon")}
            active={activeTimeButton === "afternoon"}
            text="Afternoon"
          />
          <FilterButton
            onClick={() => handleTimeSelect("17:00", "23:59", "evening")}
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
              value={startTime || ""}
              onChange={(e) => {
                setActiveTimeButton(null);
                handleTimeSelect(e.target.value || undefined, endTime);
              }}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">End Time</label>
            <input
              type="time"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
              value={endTime || ""}
              onChange={(e) => {
                setActiveTimeButton(null);
                handleTimeSelect(startTime, e.target.value || undefined);
              }}
            />
          </div>
        </div>
      </div>
    </FilterSection>
  );
}
