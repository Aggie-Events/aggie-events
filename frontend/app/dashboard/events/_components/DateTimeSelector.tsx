import React, { useState } from "react";
import { MdAccessTime } from "react-icons/md";

interface DateTimeSelectorProps {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isAllDay: boolean;
  onStartDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndDateChange: (date: string) => void;
  onEndTimeChange: (time: string) => void;
  onAllDayChange: (isAllDay: boolean) => void;
}

export default function DateTimeSelector({
  startDate,
  startTime,
  endDate,
  endTime,
  isAllDay,
  onStartDateChange,
  onStartTimeChange,
  onEndDateChange,
  onEndTimeChange,
  onAllDayChange,
}: DateTimeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAllDay}
            onChange={(e) => onAllDayChange(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">All day</span>
        </label>
      </div>

      {/* Date/Time Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MdAccessTime className="inline mr-1" />
            Start Date *
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        
        {/* Start Time */}
        {!isAllDay && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdAccessTime className="inline mr-1" />
              Start Time (CST)*
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        )}
      </div>

      {/* End Date/Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MdAccessTime className="inline mr-1" />
            End Date *
          </label>
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        {!isAllDay && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MdAccessTime className="inline mr-1" />
              End Time (CST)*
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
} 