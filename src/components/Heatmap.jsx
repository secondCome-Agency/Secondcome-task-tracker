import React from 'react';
import { MONTH_NAMES } from '../utils/dateUtils';

export default function Heatmap({ dailyStats, currentMonth, currentYear }) {
  if (!dailyStats || dailyStats.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">
            Activity Heatmap
          </h3>
          <p className="text-xs text-slate-400">
            Daily task completion intensity for {MONTH_NAMES[currentMonth]} {currentYear}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded-xs bg-slate-800/80 border border-slate-700/50" />
          <div className="w-3 h-3 rounded-xs bg-indigo-950 border border-indigo-900/50" />
          <div className="w-3 h-3 rounded-xs bg-indigo-700" />
          <div className="w-3 h-3 rounded-xs bg-indigo-500" />
          <span>More</span>
        </div>
      </div>

      {/* Grid of Squares */}
      <div className="flex flex-wrap gap-2 pt-2">
        {dailyStats.map((day) => {
          let bgClass = "bg-slate-800/80 border-slate-700/50";
          if (day.total > 0 && day.completed > 0) {
            const pct = day.percentage;
            if (pct >= 80) {
              bgClass = "bg-indigo-500 border-indigo-400 text-white shadow-xs shadow-indigo-500/30";
            } else if (pct >= 50) {
              bgClass = "bg-indigo-700 border-indigo-600 text-white";
            } else {
              bgClass = "bg-indigo-950 border-indigo-900/80 text-indigo-300";
            }
          }

          const tooltipText = `${MONTH_NAMES[currentMonth]} ${day.dayNumber}
${day.completed} of ${day.total} tasks completed
${day.percentage}% completion`;

          return (
            <div
              key={day.dateKey}
              className={`
                group relative w-7 h-7 sm:w-8 sm:h-8 rounded-md border flex items-center justify-center text-xs font-medium cursor-pointer transition-all hover:scale-110 hover:z-10
                ${bgClass}
                ${day.isFuture ? 'opacity-40' : ''}
              `}
            >
              <span>{day.dayNumber}</span>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-30 pointer-events-none">
                <div className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg py-1.5 px-3 shadow-xl whitespace-pre text-center">
                  {tooltipText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
