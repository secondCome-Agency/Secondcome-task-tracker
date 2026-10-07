import React from 'react';
import { MONTH_NAMES } from '../utils/dateUtils';

export default function Analytics({ stats, currentMonth }) {
  const {
    completionRate = 0,
    completedInstances = 0,
    missedInstances = 0,
    bestDay = "N/A",
    perfectDaysCount = 0,
    currentStreak = 0,
    bestStreak = 0,
    dailyStats = []
  } = stats;

  const monthName = MONTH_NAMES[currentMonth];

  // SVG Line Chart calculations
  const chartHeight = 120;
  const chartWidth = 600;
  const padding = 20;

  const points = dailyStats.map((d, index) => {
    const x = padding + (index / Math.max(1, dailyStats.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (d.percentage / 100) * (chartHeight - padding * 2);
    return { x, y, percentage: d.percentage, dayNumber: d.dayNumber };
  });

  const pathD = points.length > 0
    ? points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '')
    : '';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 mb-8">
      <h3 className="text-base font-bold text-slate-100 mb-4">
        Monthly Analytics ({monthName})
      </h3>

      {/* Overview Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Completion Rate
          </span>
          <span className="text-xl font-bold text-indigo-400 mt-1 block">
            {completionRate}%
          </span>
        </div>

        <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Completed Tasks
          </span>
          <span className="text-xl font-bold text-emerald-400 mt-1 block">
            {completedInstances}
          </span>
        </div>

        <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Missed Tasks
          </span>
          <span className="text-xl font-bold text-rose-400 mt-1 block">
            {missedInstances}
          </span>
        </div>

        <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-lg">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Best Day
          </span>
          <span className="text-sm font-bold text-amber-400 mt-1 block truncate">
            {bestDay}
          </span>
        </div>
      </div>

      {/* Daily Completion Line Chart */}
      <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-medium">
          <span>Daily Completion Trend (%)</span>
          <span>100% Target</span>
        </div>

        <div className="w-full overflow-x-auto">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full h-32 overflow-visible"
          >
            {/* Grid background lines */}
            <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#334155" strokeDasharray="3 3" opacity="0.5" />
            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#334155" />

            {/* Line graph */}
            {pathD && (
              <path 
                d={pathD} 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            )}

            {/* Data points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="3.5"
                className="fill-indigo-500 stroke-slate-900 stroke-2 hover:r-5 transition-all cursor-pointer"
              >
                <title>{`Day ${p.dayNumber}: ${p.percentage}%`}</title>
              </circle>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
