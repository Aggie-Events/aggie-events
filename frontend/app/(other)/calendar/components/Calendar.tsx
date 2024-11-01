// components/Calendar.tsx
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';

interface CalendarProps {
  onDateClick: (day: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const renderHeader = (): JSX.Element => {
    return (
      <div className="flex justify-between items-center py-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>&lt;</button>
        <h2 className="text-xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>&gt;</button>
      </div>
    );
  };

  const renderDays = (): JSX.Element => {
    const days: JSX.Element[] = [];
    const weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < weekDays.length; i++) {
      days.push(
        <div className="text-center font-bold" key={i}>
          {weekDays[i]}
        </div>
      );
    }
    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = (): JSX.Element => {
    const monthStart: Date = startOfMonth(currentMonth);
    const monthEnd: Date = endOfMonth(monthStart);
    const startDate: Date = startOfWeek(monthStart);
    const endDate: Date = endOfWeek(monthEnd);

    const rows: JSX.Element[] = [];
    let days: JSX.Element[] = [];
    let day: Date = startDate;
    let formattedDate: string = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay: Date = day;

        days.push(
          <div
            className={`text-center py-2 cursor-pointer ${
              !isSameMonth(day, monthStart)
                ? 'text-gray-400'
                : isSameDay(day, selectedDate)
                ? 'bg-blue-500 text-white'
                : ''
            }`}
            key={day.toISOString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toISOString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
