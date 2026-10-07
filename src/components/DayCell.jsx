import React from 'react';
import { Check } from 'lucide-react';

export default function DayCell({ 
  isCompleted, 
  isToday, 
  isFuture, 
  onClick 
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-8 h-8 sm:w-9 sm:h-9 rounded-md flex items-center justify-center transition-all cursor-pointer select-none
        ${isCompleted 
          ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xs shadow-indigo-600/40 scale-100' 
          : isFuture 
            ? 'bg-slate-800/30 text-slate-600 border border-slate-800/50 hover:bg-slate-800/60' 
            : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 hover:bg-slate-700/60 hover:text-slate-300'}
        ${isToday && !isCompleted ? 'ring-2 ring-indigo-500/70 ring-offset-1 ring-offset-slate-900 border-indigo-500/40 bg-indigo-950/20' : ''}
      `}
      title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {isCompleted && (
        <Check size={16} strokeWidth={3} className="animate-in zoom-in-50 duration-150" />
      )}
    </button>
  );
}
