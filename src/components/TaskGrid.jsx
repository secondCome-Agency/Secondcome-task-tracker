import React from 'react';
import TaskRow from './TaskRow';
import { getDaysForMonth, isToday as checkIsToday } from '../utils/dateUtils';
import { Plus, ListTodo } from 'lucide-react';

export default function TaskGrid({ 
  tasks, 
  currentYear, 
  currentMonth, 
  onToggleCompletion, 
  onEditTask, 
  onDeleteTask, 
  onOpenAddTask 
}) {
  const days = getDaysForMonth(currentYear, currentMonth);

  if (tasks.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <ListTodo size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-1">Your month is empty.</h3>
        <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
          Add your first task and start building your streak today!
        </p>
        <button
          onClick={onOpenAddTask}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={18} />
          <span>Add your first task</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden mb-8 shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {/* Sticky Task Header */}
              <th className="sticky left-0 bg-slate-900 z-20 px-4 py-3 min-w-[220px] max-w-[260px] border-r border-slate-800 shadow-[4px_0_12px_-2px_rgba(0,0,0,0.5)]">
                Task ({tasks.length})
              </th>

              {/* Day Headers */}
              {days.map(day => {
                const isToday = checkIsToday(day.dateKey);
                return (
                  <th 
                    key={day.dateKey}
                    className={`px-1 py-2.5 text-center min-w-[36px] sm:min-w-[40px] ${isToday ? 'bg-indigo-950/40 text-indigo-300 font-bold border-b-2 border-indigo-500' : ''}`}
                  >
                    <div className="text-[10px] text-slate-500 uppercase">{day.dayOfWeek}</div>
                    <div className={`text-sm ${isToday ? 'text-indigo-400 font-bold' : 'text-slate-300'}`}>
                      {day.dayNumber}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                days={days}
                onToggleCompletion={onToggleCompletion}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
