import React from 'react';
import { Check, Calendar, CheckSquare, Square } from 'lucide-react';
import { formatDateKey, MONTH_NAMES } from '../utils/dateUtils';

export default function TodaysFocus({ tasks, onToggleCompletion }) {
  const today = new Date();
  const todayKey = formatDateKey(today);
  const formattedTodayDate = `${MONTH_NAMES[today.getMonth()].slice(0, 3).toUpperCase()} ${today.getDate()}`;

  const totalTasks = tasks.length;
  const completedCount = tasks.filter(t => t.completed && t.completed[todayKey]).length;
  const percentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <Calendar size={14} />
            <span>TODAY · {formattedTodayDate}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 m-0 mt-0.5">
            Today's Focus
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-300">
            {completedCount} / {totalTasks} completed
          </span>
          <span className="text-xs px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold rounded-full">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-5">
        <div 
          className="bg-indigo-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-slate-500 text-sm italic">No tasks created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {tasks.map(task => {
            const isCompleted = !!(task.completed && task.completed[todayKey]);

            return (
              <div 
                key={task.id}
                onClick={() => onToggleCompletion(task.id, todayKey)}
                className={`
                  flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer select-none
                  ${isCompleted 
                    ? 'bg-indigo-950/20 border-indigo-900/40 text-slate-300' 
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-800 hover:border-slate-600'}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden pr-2">
                  <div className={`
                    w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors
                    ${isCompleted ? 'bg-indigo-600 text-white' : 'border border-slate-600 text-transparent'}
                  `}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className={`text-sm font-medium truncate ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </span>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded border border-slate-700/60 bg-slate-800 text-slate-400 shrink-0">
                  {task.category || 'Other'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
