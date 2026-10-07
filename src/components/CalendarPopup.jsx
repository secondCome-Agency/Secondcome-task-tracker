import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { MONTH_NAMES, getCalendarMonthDays, parseDateKey, formatDateKey } from '../utils/dateUtils';

export default function CalendarPopup({ isOpen, onClose, selectedDateKey, onSelectDate }) {
  if (!isOpen) return null;

  const currentSelectedDate = parseDateKey(selectedDateKey);
  const [viewYear, setViewYear] = useState(currentSelectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentSelectedDate.getMonth());

  const daysGrid = getCalendarMonthDays(viewYear, viewMonth);
  const todayKey = formatDateKey(new Date());

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  return (
    <div className="absolute top-full mt-3 z-40 w-80 bg-white border border-[#A8DDD5]/60 rounded-2xl p-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#A8DDD5]/30">
        <button
          onClick={handlePrevMonth}
          className="p-1 text-[#6E8581] hover:text-[#073F40] hover:bg-[#E8F4F0] rounded-md transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-bold text-sm text-[#073F40]">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-1 text-[#6E8581] hover:text-[#073F40] hover:bg-[#E8F4F0] rounded-md transition-colors cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-[#6E8581] mb-2">
        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
      </div>

      {/* Days matrix */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysGrid.map((day, idx) => {
          const isSelected = day.dateKey === selectedDateKey;
          const isCurrentToday = day.dateKey === todayKey;

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(day.dateKey)}
              className={`
                h-8 w-8 rounded-lg text-xs font-semibold flex items-center justify-center cursor-pointer transition-all mx-auto
                ${isSelected 
                  ? 'bg-[#073F40] text-white shadow-xs' 
                  : isCurrentToday 
                    ? 'bg-[#E8F4F0] text-[#159A92] font-bold border border-[#159A92]/40' 
                    : day.isCurrentMonth 
                      ? 'text-[#123536] hover:bg-[#E8F4F0] hover:text-[#073F40]' 
                      : 'text-[#6E8581]/40'}
              `}
            >
              {day.dayNumber}
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-[#A8DDD5]/30 flex justify-end">
        <button
          onClick={onClose}
          className="text-xs font-medium text-[#6E8581] hover:text-[#073F40] px-2 py-1 rounded cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
