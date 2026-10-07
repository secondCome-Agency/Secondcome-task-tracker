import React from 'react';
import { Flame, Plus, Calendar, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function Header({ streakDays, onOpenAddTask, onOpenBatchPlanner }) {
  const { isInstallable, promptInstall } = usePWAInstall();

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between py-6 px-4 border-b border-[#A8DDD5]/30 mb-6 max-w-7xl mx-auto gap-4">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#073F40] text-[#A8DDD5] flex items-center justify-center font-black text-lg shadow-xs">
          S
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#073F40] tracking-tight leading-none m-0">
            Secondcome
          </h1>
          <p className="text-xs text-[#6E8581] m-0 mt-0.5 font-medium">Team Daily Task Planner</p>
        </div>
      </div>

      {/* Actions & Streak */}
      <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-end">
        {/* Subtle Install App Button (Shown when browser supports installation) */}
        {isInstallable && (
          <button
            onClick={promptInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#073F40] bg-[#E8F4F0] hover:bg-[#A8DDD5]/40 border border-[#A8DDD5]/60 rounded-lg transition-colors cursor-pointer shadow-xs"
            title="Install DayGrid App"
          >
            <Download size={14} className="text-[#159A92]" />
            <span>Install App</span>
          </button>
        )}

        {/* Subtle Streak Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F4F0] text-[#073F40] text-xs font-semibold border border-[#A8DDD5]/40">
          <Flame size={14} className="text-[#159A92] fill-[#159A92]" />
          <span>{streakDays} day streak</span>
        </div>

        {/* Batch Planner Button */}
        <button
          onClick={onOpenBatchPlanner}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#073F40] hover:text-[#0B5553] bg-white hover:bg-[#E8F4F0] border border-[#A8DDD5]/60 rounded-lg transition-colors cursor-pointer"
          title="Plan multiple days ahead"
        >
          <Calendar size={14} />
          <span>Multi-day Plan</span>
        </button>

        {/* Add Task Button */}
        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#073F40] hover:bg-[#0B5553] rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus size={15} />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
}
