/**
 * Date Utilities for Daily Task Planner
 */

export const formatDateKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateKey = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const SHORT_MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const SHORT_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Format e.g. "October 7, 2026"
 */
export const formatDisplayDate = (dateKey) => {
  const d = parseDateKey(dateKey);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

/**
 * Format relative title: "Today", "Tomorrow", "Yesterday", or "October 7"
 */
export const formatRelativeDateLabel = (dateKey) => {
  const todayStr = formatDateKey(new Date());

  const tomDate = new Date();
  tomDate.setDate(tomDate.getDate() + 1);
  const tomStr = formatDateKey(tomDate);

  const yestDate = new Date();
  yestDate.setDate(yestDate.getDate() - 1);
  const yestStr = formatDateKey(yestDate);

  if (dateKey === todayStr) return "Today";
  if (dateKey === tomStr) return "Tomorrow";
  if (dateKey === yestStr) return "Yesterday";

  const d = parseDateKey(dateKey);
  return `${SHORT_MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
};

export const isToday = (dateKey) => {
  return dateKey === formatDateKey(new Date());
};

/**
 * Shift date string by N days
 */
export const addDays = (dateKey, numDays) => {
  const d = parseDateKey(dateKey);
  d.setDate(d.getDate() + numDays);
  return formatDateKey(d);
};

/**
 * Get days for calendar view (matrix of days for year & month)
 */
export const getCalendarMonthDays = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];
  const startDayOfWeek = firstDay.getDay(); // 0 = Sun

  // Prev month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      dateKey: formatDateKey(d),
      dayNumber: d.getDate(),
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateObj = new Date(year, month, d);
    days.push({
      dateKey: formatDateKey(dateObj),
      dayNumber: d,
      isCurrentMonth: true
    });
  }

  // Next month padding to fill grid 35 or 42
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const dateObj = new Date(year, month + 1, d);
    days.push({
      dateKey: formatDateKey(dateObj),
      dayNumber: d,
      isCurrentMonth: false
    });
  }

  return days;
};

/**
 * Generate date strings based on repeat rule
 */
export const generateDatesForRepeat = ({
  startDateKey,
  repeat = 'once', // 'once', 'everyday', 'weekdays', 'custom'
  untilDateKey,
  selectedDates = []
}) => {
  if (repeat === 'custom' && selectedDates.length > 0) {
    return Array.from(new Set(selectedDates)).sort();
  }

  if (repeat === 'once') {
    return [startDateKey];
  }

  const start = parseDateKey(startDateKey);
  const end = untilDateKey ? parseDateKey(untilDateKey) : new Date(start.getTime() + 86400000 * 30); // Default 30 days max if unspecified

  const dates = [];
  const curr = new Date(start);

  while (curr <= end) {
    const dKey = formatDateKey(curr);
    const dayOfWeek = curr.getDay();

    if (repeat === 'everyday') {
      dates.push(dKey);
    } else if (repeat === 'weekdays') {
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        dates.push(dKey);
      }
    }

    curr.setDate(curr.getDate() + 1);
  }

  return dates;
};
