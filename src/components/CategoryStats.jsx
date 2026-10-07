import React from 'react';

export default function CategoryStats({ categoryStats }) {
  if (!categoryStats || categoryStats.length === 0) return null;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-8">
      <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider mb-4">
        Category Performance
      </h3>

      <div className="space-y-4">
        {categoryStats.map((cat) => (
          <div key={cat.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">
                {cat.name} <span className="text-slate-500 font-normal">({cat.taskCount} tasks)</span>
              </span>
              <span className="font-bold text-slate-300">
                {cat.percentage}%
              </span>
            </div>

            {/* Horizontal progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
