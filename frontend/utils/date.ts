import { DateTime } from "luxon";

/**
 * Checks if two dates fall on the same day.
 *
 * @param {Date} date1 - The first date to compare.
 * @param {Date} date2 - The second date to compare.
 * @returns {boolean} - Returns true if both dates are on the same day, otherwise false.
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Formats a date interval into a readable string.
 *
 * @param {Date} start - The start date and time.
 * @param {Date} end - The end date and time.
 * @returns {string} - A formatted string representing the date interval.
 * @example "Monday, January 1, 12:00 PM - 1:00 PM"
 * @example "Monday, January 1, 12:00 PM - Tuesday, January 2, 1:00 PM"
 */
export function formatDateInterval(start: Date, end: Date): string {
  const startDayStr = start.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const endDayStr = end.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const startTimeStr = start.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTimeStr = end.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (isSameDay(start, end)) {
    return `${startDayStr}, ${startYear}, ${startTimeStr} - ${endTimeStr}`;
  } else {
    return `${startDayStr}, ${startYear}, ${startTimeStr} - ${endDayStr}, ${startYear !== endYear ? endYear + "," : ""} ${endTimeStr}`;
  }
}

export const formatTimeInterval = (start: Date, end: Date): string => {
  // const startDayStr = start.toLocaleDateString("en-US", {
  //   weekday: "long",
  //   month: "long",
  //   day: "numeric",
  // });
  // const endDayStr = end.toLocaleDateString("en-US", {
  //   weekday: "long",
  //   month: "long",
  //   day: "numeric",
  // });
  const startTimeStr = start.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTimeStr = end.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${startTimeStr} - ${endTimeStr}`;
};

/**
 * Converts local date and time to CST
 * 
 * @param {string} date - The date in YYYY-MM-DD format
 * @param {string} time - The time in HH:mm format
 * @returns {Date} - Date object in CST
 */
export function toCST(date: string, time: string): Date {
  return DateTime.fromFormat(`${date} ${time}`, 'yyyy-MM-dd HH:mm', { zone: 'America/Chicago' })
    .toJSDate();
}

/**
 * Converts a date to UTC midnight for all-day events
 */
export function dateToUTCMidnight(date: string): Date {
  return DateTime.fromFormat(date, 'yyyy-MM-dd', { zone: 'UTC' })
    .startOf('day')
    .toJSDate();
}

/**
 * Formats a date for input
 * @param date - The date to format
 * @returns The formatted date (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Formats a time for input
 * @param date - The date to format
 * @returns The formatted time
 */
export const formatTimeForInput = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

/**
 * Gets the date of today
 * @returns The date of today
 */
export const getToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Gets the date of tomorrow
 * @returns The date of tomorrow
 */
export const getTomorrow = (): Date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

/**
 * Gets the last day of the week
 * @returns The last day of the week
 */
export const getEndOfWeek = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date();
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
  return endOfWeek;
};

/**
 * Gets the last day of the month
 * @returns The last day of the month
 */
export const getEndOfMonth = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endOfMonth = new Date();
  endOfMonth.setMonth(today.getMonth() + 1);
  endOfMonth.setDate(0);
  return endOfMonth;
};

/**
 * Checks if the date is today
 * @param date - The date to check
 * @returns True if the date is today, false otherwise
 */
export const isToday = (date: Date): boolean => {
  return date.getDate() === getToday().getDate();
};

/**
 * Checks if the date is tomorrow
 * @param date - The date to check
 * @returns True if the date is tomorrow, false otherwise
 */
export const isTomorrow = (date: Date): boolean => {
  return date.getDate() === getTomorrow().getDate();
};

/**
 * Checks if the date is the last day of the week
 * @param date - The date to check
 * @returns True if the date is the last day of the week, false otherwise
 */
export const isThisWeekEndDay = (date: Date): boolean => {
  return date.getDate() === getEndOfWeek().getDate();
};

/**
 * Checks if the date is the last day of the month
 * @param date - The date to check
 * @returns True if the date is the last day of the month, false otherwise
 */
export const isThisMonthEndDay = (date: Date): boolean => {
  return date.getDate() === getEndOfMonth().getDate();
};



