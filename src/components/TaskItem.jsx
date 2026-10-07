import React from 'react';
import { Check } from 'lucide-react';
import TaskMenu from './TaskMenu';

const CATEGORY_BADGES = {
  Development: 'bg-[#E8F4F0] text-[#073F40] border-[#A8DDD5]/60',
  Study: 'bg-[#E8F4F0] text-[#0B5553] border-[#A8DDD5]/60',
  Fitness: 'bg-[#E8F4F0] text-[#159A92] border-[#A8DDD5]/60',
  Work: 'bg-[#E8F4F0] text-[#073F40] border-[#A8DDD5]/60',
  Personal: 'bg-[#E8F4F0] text-[#6E8581] border-[#A8DDD5]/60',
  General: 'bg-[#E8F4F0] text-[#6E8581] border-[#A8DDD5]/60'
};

export default function TaskItem({ 
  task, 
  onToggleCompletion, 
  onEdit, 
  onMoveTo, 
  onDuplicate, 
  onDelete 
}) {
  const badgeClass = CATEGORY_BADGES[task.category] || CATEGORY_BADGES.General;

  return (
    <div className={`
      flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all mb-2.5 bg-white
      ${task.completed 
        ? 'border-[#A8DDD5]/30 opacity-75 bg-[#F7F8F2]/60' 
        : 'border-[#A8DDD5]/50 shadow-xs hover:border-[#159A92]/40'}
    `}>
      {/* Checkbox & Task Info */}
      <div className="flex items-center gap-3.5 overflow-hidden pr-2">
        <button
          onClick={() => onToggleCompletion(task.id)}
          className={`
            w-5 h-5 sm:w-6 sm:h-6 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0
            ${task.completed 
              ? 'bg-[#159A92] border-[#159A92] text-white shadow-xs' 
              : 'border-[#A8DDD5] hover:border-[#159A92] bg-[#F7F8F2] text-transparent'}
          `}
          title={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          <Check size={14} strokeWidth={3} className={task.completed ? 'block' : 'hidden'} />
        </button>

        <div className="overflow-hidden">
          <span className={`
            block text-sm sm:text-base font-semibold transition-all truncate
            ${task.completed ? 'line-through text-[#6E8581]' : 'text-[#123536]'}
          `}>
            {task.title}
          </span>

          {task.category && (
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-1 ${badgeClass}`}>
              {task.category}
            </span>
          )}
        </div>
      </div>

      {/* Task Action Menu */}
      <TaskMenu
        task={task}
        onEdit={onEdit}
        onMoveTo={onMoveTo}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    </div>
  );
}
