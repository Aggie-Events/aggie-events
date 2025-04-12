import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useMenuHandle } from "@/components/MenuHandle";
import { FilterButton } from "./FilterButton";
import { useSearchParams } from "next/navigation";
import {
  formatDateForInput as formatDateUtil,
  getToday,
  getTomorrow,
  getEndOfWeek,
  isToday,
  isTomorrow,
  isThisWeekEndDay,
  formatDateForInput,
} from "@/utils/date";

interface DateFilterProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
  initialDates?: [Date | null, Date | null];
}

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type DateFilterButton = "any" | "today" | "tomorrow" | "thisWeek";

export default function DateFilter({ onDateChange, initialDates }: DateFilterProps) {
  const searchParams = useSearchParams();

  // Initialize from initialDates prop if provided, otherwise from URL parameters
  const initialStartDate = initialDates
    ? initialDates[0]
    : (searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : null);

  const initialEndDate = initialDates
    ? initialDates[1]
    : (searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : null);

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: initialStartDate,
    endDate: initialEndDate,
  });
  const [activeDateButton, setActiveDateButton] =
    useState<DateFilterButton | null>(null);
  const dateFilterMenu = useMenuHandle({ isOpen: true });

  // Determine active button on initial load
  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      if (isToday(initialStartDate) && isToday(initialEndDate)) {
        setActiveDateButton("today");
      } else if (isTomorrow(initialStartDate) && isTomorrow(initialEndDate)) {
        setActiveDateButton("tomorrow");
      } else if (
        isToday(initialStartDate) &&
        isThisWeekEndDay(initialEndDate)
      ) {
        setActiveDateButton("thisWeek");
      } else {
        setActiveDateButton(null);
      }
    } else if (!initialStartDate && !initialEndDate) {
      setActiveDateButton("any");
    }
  }, [initialStartDate, initialEndDate]);

  // Update date range when initialDates prop changes
  useEffect(() => {
    if (initialDates) {
      setDateRange({
        startDate: initialDates[0],
        endDate: initialDates[1]
      });
      
      // Set active button based on new dates
      if (initialDates[0] && initialDates[1]) {
        if (isToday(initialDates[0]) && isToday(initialDates[1])) {
          setActiveDateButton("today");
        } else if (isTomorrow(initialDates[0]) && isTomorrow(initialDates[1])) {
          setActiveDateButton("tomorrow");
        } else if (
          isToday(initialDates[0]) &&
          isThisWeekEndDay(initialDates[1])
        ) {
          setActiveDateButton("thisWeek");
        } else {
          setActiveDateButton(null);
        }
      } else if (!initialDates[0] && !initialDates[1]) {
        setActiveDateButton("any");
      }
    }
  }, [initialDates]);

  const handleDateSelect = (
    start: Date | null,
    end: Date | null,
    buttonName?: string,
  ) => {
    setDateRange({ startDate: start, endDate: end });
    setActiveDateButton((buttonName as DateFilterButton) || null);
    onDateChange(start, end);
  };

  const resetDateFilter = () => {
    setDateRange({ startDate: null, endDate: null });
    setActiveDateButton("any");
    onDateChange(null, null);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value ? new Date(e.target.value) : null;
    
    // Reset active button since we're now using custom dates
    setActiveDateButton(null);
    
    const newDateRange = {
      ...dateRange,
      startDate: newStartDate,
    };
    setDateRange(newDateRange);
    onDateChange(newDateRange.startDate, newDateRange.endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value ? new Date(e.target.value) : null;
    
    // Reset active button since we're now using custom dates
    setActiveDateButton(null);
    
    const newDateRange = {
      ...dateRange,
      endDate: newEndDate,
    };
    setDateRange(newDateRange);
    onDateChange(newDateRange.startDate, newDateRange.endDate);
  };

  return (
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
            <FilterButton
              onClick={resetDateFilter}
              active={activeDateButton === "any"}
              text="Any"
            />
            <FilterButton
              onClick={() => {
                const today = getToday();
                handleDateSelect(today, today, "today");
              }}
              active={activeDateButton === "today"}
              text="Today"
            />
            <FilterButton
              onClick={() => {
                const tomorrow = getTomorrow();
                handleDateSelect(tomorrow, tomorrow, "tomorrow");
              }}
              active={activeDateButton === "tomorrow"}
              text="Tomorrow"
            />
            <FilterButton
              onClick={() => {
                const today = getToday();
                const endOfWeek = getEndOfWeek();
                handleDateSelect(today, endOfWeek, "thisWeek");
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
                value={
                  dateRange.startDate
                    ? formatDateForInput(dateRange.startDate)
                    : ""
                }
                onChange={handleStartDateChange}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">End Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
                value={
                  dateRange.endDate ? formatDateForInput(dateRange.endDate) : ""
                }
                onChange={handleEndDateChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
