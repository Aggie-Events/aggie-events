import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useMenuHandle } from "@/components/MenuHandle";
import { FilterButton } from "./FilterButton";

interface DateFilterProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

export default function DateFilter({ onDateChange }: DateFilterProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeDateButton, setActiveDateButton] = useState<string | null>(null);
  const dateFilterMenu = useMenuHandle({isOpen: true});

  const handleDateSelect = (start: Date | null, end: Date | null, buttonName?: string) => {
    setStartDate(start);
    setEndDate(end);
    setActiveDateButton(buttonName || null);
    onDateChange(start, end);
  };

  const resetDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setActiveDateButton('any');
    onDateChange(null, null);
  };

  // Reset active button when manual date inputs change
  useEffect(() => {
    if (startDate || endDate) {
      // Only reset if the dates don't match any of the preset button values
      if (activeDateButton === 'today') {
        const today = new Date();
        const isToday = startDate?.toDateString() === today.toDateString() && 
                       endDate?.toDateString() === today.toDateString();
        if (!isToday) {
          setActiveDateButton(null);
        }
      } else if (activeDateButton === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const isTomorrow = startDate?.toDateString() === tomorrow.toDateString() && 
                          endDate?.toDateString() === tomorrow.toDateString();
        if (!isTomorrow) {
          setActiveDateButton(null);
        }
      } else if (activeDateButton === 'thisWeek') {
        const today = new Date();
        const endOfWeek = new Date();
        endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
        const isThisWeek = startDate?.toDateString() === today.toDateString() && 
                          endDate?.toDateString() === endOfWeek.toDateString();
        if (!isThisWeek) {
          setActiveDateButton(null);
        }
      }
    }
  }, [startDate, endDate, activeDateButton]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Date</h3>
        <button 
          onClick={() => dateFilterMenu.setIsMenuOpen(!dateFilterMenu.isMenuOpen)}
          className="text-sm text-gray-500 flex items-center"
        >
          <FaChevronDown className={`ml-1 h-3 w-3 transition-transform ${dateFilterMenu.isMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {dateFilterMenu.isMenuOpen && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={resetDateFilter}
              className={`px-3 py-1 text-sm rounded-full ${activeDateButton === 'any' ? 'bg-maroon text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Any
            </button>
            <FilterButton
              onClick={() => handleDateSelect(new Date(), new Date(), 'today')}
              active={activeDateButton === 'today'}
              text="Today"
            />
            <FilterButton
              onClick={() => {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                handleDateSelect(tomorrow, tomorrow, 'tomorrow');
              }}
              active={activeDateButton === 'tomorrow'}
              text="Tomorrow"
            />
            <FilterButton   
              onClick={() => {
                const today = new Date();
                const endOfWeek = new Date();
                endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
                handleDateSelect(today, endOfWeek, 'thisWeek');
              }}
              active={activeDateButton === 'thisWeek'}
              text="This Week"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <div>
              <label className="block text-sm text-gray-700">Start Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleDateSelect(date, endDate);
                }}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">End Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maroon focus:ring-maroon sm:text-sm"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleDateSelect(startDate, date);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 