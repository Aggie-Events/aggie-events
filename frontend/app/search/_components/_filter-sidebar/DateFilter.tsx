import React, { useState } from "react";
import { FilterButton } from "./FilterButton";
import { FilterSection } from "./FilterSection";
import {
  getToday,
  getTomorrow,
  getEndOfWeek,
  formatDateForInput,
} from "@/utils/date";

interface DateFilterProps {
  onDateChange: (
    startDate: Date | undefined,
    endDate: Date | undefined,
  ) => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

type DateFilterButton = "any" | "today" | "tomorrow" | "thisWeek";

export default function DateFilter({
  onDateChange,
  startDate,
  endDate,
}: DateFilterProps) {
  const [activeDateButton, setActiveDateButton] =
    useState<DateFilterButton | null>(null);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value ? new Date(e.target.value) : undefined;
    onDateChange(newStartDate, endDate);
    setActiveDateButton(null);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value ? new Date(e.target.value) : undefined;
    onDateChange(startDate, newEndDate);
    setActiveDateButton(null);
  };

  const handleButtonSelect = (
    start: Date | null,
    end: Date | null,
    buttonName: string,
  ) => {
    setActiveDateButton(buttonName as DateFilterButton);
    onDateChange(start ?? undefined, end ?? undefined);
  };

  return (
    <FilterSection title="Date">
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterButton
            onClick={() => {
              handleButtonSelect(null, null, "any");
            }}
            active={activeDateButton === "any"}
            text="Any"
          />
          <FilterButton
            onClick={() => {
              const today = getToday();
              handleButtonSelect(today, today, "today");
            }}
            active={activeDateButton === "today"}
            text="Today"
          />
          <FilterButton
            onClick={() => {
              const tomorrow = getTomorrow();
              handleButtonSelect(tomorrow, tomorrow, "tomorrow");
            }}
            active={activeDateButton === "tomorrow"}
            text="Tomorrow"
          />
          <FilterButton
            onClick={() => {
              const today = getToday();
              const endOfWeek = getEndOfWeek();
              handleButtonSelect(today, endOfWeek, "thisWeek");
            }}
            active={activeDateButton === "thisWeek"}
            text="This Week"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <label className="block text-sm text-gray-700">Start Date</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
              value={startDate ? formatDateForInput(startDate) : ""}
              onChange={handleStartDateChange}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">End Date</label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
              value={endDate ? formatDateForInput(endDate) : ""}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
      </div>
    </FilterSection>
  );
}
