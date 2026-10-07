import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, ArrowRight, Edit3, Copy, Trash2, ChevronRight } from 'lucide-react';
import { addDays, formatDateKey } from '../utils/dateUtils';

export default function TaskMenu({ 
  task, 
  onEdit, 
  onMoveTo, 
  onDuplicate, 
  onDelete 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMoveSubmenu, setShowMoveSubmenu] = useState(false);
  const [moveCustomDate, setMoveCustomDate] = useState('');
  const menuRef = useRef(null);

  const tomorrowStr = addDays(task.date, 1);
  const nextAvailableStr = addDays(task.date, 2);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowMoveSubmenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-[#6E8581] hover:text-[#073F40] hover:bg-[#E8F4F0] rounded-lg transition-colors cursor-pointer"
        title="Task options"
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#A8DDD5]/60 rounded-xl shadow-lg py-1 z-30 text-xs font-medium text-[#123536] animate-in fade-in zoom-in-95 duration-150">
          {!showMoveSubmenu ? (
            <>
              <button
                onClick={() => {
                  onEdit(task);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#E8F4F0] hover:text-[#073F40] text-left cursor-pointer"
              >
                <Edit3 size={14} className="text-[#159A92]" />
                <span>Edit Task</span>
              </button>

              <button
                onClick={() => setShowMoveSubmenu(true)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-[#E8F4F0] hover:text-[#073F40] text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ArrowRight size={14} className="text-[#159A92]" />
                  <span>Move to...</span>
                </div>
                <ChevronRight size={12} className="text-[#6E8581]" />
              </button>

              <button
                onClick={() => {
                  onDuplicate(task.id, task.date);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#E8F4F0] hover:text-[#073F40] text-left cursor-pointer"
              >
                <Copy size={14} className="text-[#159A92]" />
                <span>Duplicate</span>
              </button>

              <div className="my-1 border-t border-[#A8DDD5]/30" />

              <button
                onClick={() => {
                  onDelete(task.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-50 text-rose-600 text-left cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </>
          ) : (
            <>
              <div className="px-3 py-1.5 font-semibold text-[#073F40] border-b border-[#A8DDD5]/30 flex items-center justify-between">
                <span>Move to Date</span>
                <button 
                  onClick={() => setShowMoveSubmenu(false)}
                  className="text-[10px] text-[#6E8581] hover:text-[#073F40]"
                >
                  Back
                </button>
              </div>

              <button
                onClick={() => {
                  onMoveTo(task.id, tomorrowStr);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 hover:bg-[#E8F4F0] hover:text-[#073F40] text-left cursor-pointer"
              >
                Tomorrow ({tomorrowStr})
              </button>

              <button
                onClick={() => {
                  onMoveTo(task.id, nextAvailableStr);
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 hover:bg-[#E8F4F0] hover:text-[#073F40] text-left cursor-pointer"
              >
                In 2 Days ({nextAvailableStr})
              </button>

              <div className="p-2 border-t border-[#A8DDD5]/30">
                <span className="block text-[10px] text-[#6E8581] mb-1 font-semibold">
                  Select Specific Date
                </span>
                <div className="flex gap-1">
                  <input
                    type="date"
                    value={moveCustomDate}
                    onChange={(e) => setMoveCustomDate(e.target.value)}
                    className="w-full px-1.5 py-1 bg-[#F7F8F2] border border-[#A8DDD5] rounded text-[11px]"
                  />
                  <button
                    onClick={() => {
                      if (moveCustomDate) {
                        onMoveTo(task.id, moveCustomDate);
                        setIsOpen(false);
                      }
                    }}
                    disabled={!moveCustomDate}
                    className="px-2 py-1 bg-[#073F40] text-white text-[10px] font-bold rounded cursor-pointer disabled:opacity-40"
                  >
                    Move
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
