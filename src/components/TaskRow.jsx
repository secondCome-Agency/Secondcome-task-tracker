import React from 'react';
import DayCell from './DayCell';
import { Edit2, Trash2, Tag } from 'lucide-react';
import { isToday as checkIsToday, isFutureDate } from '../utils/dateUtils';

const CATEGORY_COLORS = {
  Development: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Study: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Fitness: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Work: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Personal: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Other: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
};

export default function TaskRow({ 
  task, 
  days, 
  onToggleCompletion, 
  onEdit, 
  onDelete 
}) {
  const categoryBadgeClass = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.Other;

  return (
    <tr className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group">
      {/* Sticky Left Column: Task Information & Actions */}
      <td className="sticky left-0 bg-slate-900 z-10 px-4 py-3 min-w-[220px] max-w-[260px] border-r border-slate-800 shadow-[4px_0_12px_-2px_rgba(0,0,0,0.5)]">
        <div className="flex items-start justify-between gap-2">
          <div className="overflow-hidden">
            <div className="font-semibold text-sm text-slate-100 truncate" title={task.title}>
              {task.title}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${categoryBadgeClass}`}>
                {task.category || 'Other'}
              </span>
              {task.target && (
                <span className="text-[10px] text-slate-400 truncate">
                  {task.target}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons (Edit & Delete) */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="p-1 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded cursor-pointer"
              title="Edit Task"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 rounded cursor-pointer"
              title="Delete Task"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </td>

      {/* Grid Day Cells */}
      {days.map(day => {
        const isCompleted = !!(task.completed && task.completed[day.dateKey]);
        const isToday = checkIsToday(day.dateKey);
        const isFuture = isFutureDate(day.dateKey);

        return (
          <td 
            key={day.dateKey} 
            className={`px-1 py-2 text-center align-middle ${isToday ? 'bg-indigo-950/20' : ''}`}
          >
            <div className="flex justify-center">
              <DayCell
                isCompleted={isCompleted}
                isToday={isToday}
                isFuture={isFuture}
                onClick={() => onToggleCompletion(task.id, day.dateKey)}
              />
            </div>
          </td>
        );
      })}
    </tr>
  );
}
