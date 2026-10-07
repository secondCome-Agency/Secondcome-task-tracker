import React from 'react';
import { Flame, Trophy, CheckCircle2, Star, Target } from 'lucide-react';

export default function MonthlyOverview({ stats }) {
  const {
    completionRate = 0,
    totalPossibleInstances = 0,
    completedInstances = 0,
    currentStreak = 0,
    bestStreak = 0,
    perfectDaysCount = 0,
    totalTasks = 0
  } = stats;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Monthly Progress */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Monthly Progress</span>
            <Target size={16} className="text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.max(0, completionRate))}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {completedInstances} / {totalPossibleInstances} completed ({totalTasks} active tasks)
          </p>
        </div>

        {/* Current Streak */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Current Streak</span>
            <Flame size={16} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {currentStreak}
            </span>
            <span className="text-sm font-medium text-slate-400">days</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Best streak this month: <strong className="text-slate-200">{bestStreak} days</strong>
          </p>
        </div>

        {/* Perfect Days */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Perfect Days</span>
            <Star size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {perfectDaysCount}
            </span>
            <span className="text-sm font-medium text-slate-400">days</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            100% daily target completed
          </p>
        </div>

        {/* Completed Instances */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Completed</span>
            <CheckCircle2 size={16} className="text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {completedInstances}
            </span>
            <span className="text-sm font-medium text-slate-400">tasks</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Across {totalTasks} tracked habits
          </p>
        </div>
      </div>
    </div>
  );
}
