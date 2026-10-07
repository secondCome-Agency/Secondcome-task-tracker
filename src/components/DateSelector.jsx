import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { formatDisplayDate, formatRelativeDateLabel, isToday } from '../utils/dateUtils';
import CalendarPopup from './CalendarPopup';

export default function DateSelector({ 
  selectedDateKey, 
  onPrevDay, 
  onNextDay, 
  onSelectToday, 
  onSelectDate 
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const relativeLabel = formatRelativeDateLabel(selectedDateKey);
  const fullDateLabel = formatDisplayDate(selectedDateKey);
  const isSelectedToday = isToday(selectedDateKey);

  return (
    <div className="flex flex-col items-center mb-6 max-w-2xl mx-auto px-4 relative">
      {/* Date Navigation Bar */}
      <div className="flex items-center justify-between w-full max-w-md bg-white border border-[#A8DDD5]/40 rounded-xl px-2 py-2 shadow-xs">
        <button
          onClick={onPrevDay}
          className="p-2 text-[#6E8581] hover:text-[#073F40] hover:bg-[#E8F4F0] rounded-lg transition-colors cursor-pointer"
          title="Previous Day"
          aria-label="Previous Day"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Clickable Date Display */}
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="flex items-center gap-2 px-3 py-1 text-[#073F40] hover:bg-[#E8F4F0] rounded-lg transition-colors cursor-pointer font-bold text-base sm:text-lg"
        >
          <CalendarIcon size={18} className="text-[#159A92]" />
          <span>{fullDateLabel}</span>
        </button>

        <button
          onClick={onNextDay}
          className="p-2 text-[#6E8581] hover:text-[#073F40] hover:bg-[#E8F4F0] rounded-lg transition-colors cursor-pointer"
          title="Next Day"
          aria-label="Next Day"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Quick Jump Buttons: Today & Relative Badge */}
      <div className="flex items-center gap-2 mt-2.5">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E8F4F0] text-[#0B5553] border border-[#A8DDD5]/40">
          {relativeLabel}
        </span>

        {!isSelectedToday && (
          <button
            onClick={onSelectToday}
            className="text-xs font-semibold text-[#159A92] hover:text-[#073F40] underline underline-offset-2 cursor-pointer transition-colors"
          >
            Jump to Today
          </button>
        )}
      </div>

      {/* Elegant Calendar Modal / Dropdown Popup */}
      <CalendarPopup
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDateKey={selectedDateKey}
        onSelectDate={(dKey) => {
          onSelectDate(dKey);
          setIsCalendarOpen(false);
        }}
      />
    </div>
  );
}
