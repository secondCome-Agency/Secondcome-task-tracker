import React from 'react';
import TaskItem from './TaskItem';
import { Plus } from 'lucide-react';

export default function TaskList({ 
  members = [],
  tasks = [], 
  selectedDateKey,
  onToggleCompletion, 
  onEdit, 
  onMoveTo, 
  onDuplicate, 
  onDelete,
  onOpenAddTask 
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      {/* 5 Column Layout for Team Members */}
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar items-start">
        {members.map(member => {
          const memberTasks = tasks.filter(t => (t.memberId || 'member-1') === member.id);
          const completedCount = memberTasks.filter(t => t.completed).length;
          const totalCount = memberTasks.length;

          return (
            <div 
              key={member.id} 
              className="min-w-[240px] flex-1 bg-white border border-[#A8DDD5]/50 rounded-2xl p-4 shadow-xs flex flex-col"
            >
              {/* Member Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#A8DDD5]/40">
                <div>
                  <h3 className="text-sm font-bold text-[#073F40] m-0">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#6E8581] m-0 mt-0.5">
                    {completedCount} / {totalCount} completed
                  </p>
                </div>

                <button
                  onClick={() => onOpenAddTask(member.id)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#073F40] bg-[#E8F4F0] hover:bg-[#A8DDD5]/40 px-2.5 py-1.5 rounded-lg border border-[#A8DDD5]/60 transition-colors cursor-pointer"
                  title={`Add task for ${member.name}`}
                >
                  <Plus size={13} />
                  <span>Add Task</span>
                </button>
              </div>

              {/* Member Task List */}
              <div className="space-y-2 flex-1 min-h-[120px]">
                {memberTasks.length === 0 ? (
                  <div className="text-center py-6 px-2 border border-dashed border-[#A8DDD5]/60 rounded-xl bg-[#F7F8F2]/50">
                    <p className="text-xs font-medium text-[#6E8581]">No tasks scheduled</p>
                  </div>
                ) : (
                  memberTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleCompletion={onToggleCompletion}
                      onEdit={onEdit}
                      onMoveTo={onMoveTo}
                      onDuplicate={onDuplicate}
                      onDelete={onDelete}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
