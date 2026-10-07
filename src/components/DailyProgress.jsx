import React from 'react';

export default function DailyProgress({ completedCount, totalCount, percentage }) {
  if (totalCount === 0) return null;

  return (
    <div className="mb-6 max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between text-xs font-semibold text-[#073F40] mb-2">
        <span className="uppercase tracking-wider">Daily Progress</span>
        <span className="text-[#6E8581] font-mono">
          {completedCount} / {totalCount} completed ({percentage}%)
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-[#E8F4F0] h-2.5 rounded-full overflow-hidden border border-[#A8DDD5]/40 p-0.5">
        <div
          className="bg-[#159A92] h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
