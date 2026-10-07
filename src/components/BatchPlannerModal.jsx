import React, { useState } from 'react';
import { X, Plus, Calendar, Trash2 } from 'lucide-react';
import { formatDateKey, addDays, SHORT_MONTH_NAMES } from '../utils/dateUtils';

const CATEGORIES = ['Development', 'Study', 'Fitness', 'Work', 'Personal', 'General'];

export default function BatchPlannerModal({ isOpen, onClose, onSaveBatchPlans, selectedDateKey, members = [] }) {
  if (!isOpen) return null;

  const todayStr = formatDateKey(new Date());
  const tomStr = addDays(todayStr, 1);
  const next2Str = addDays(todayStr, 2);

  const [selectedMemberId, setSelectedMemberId] = useState('member-1');

  const [plans, setPlans] = useState([
    { date: todayStr, tasks: [{ title: '', category: 'Development' }] },
    { date: tomStr, tasks: [{ title: '', category: 'Study' }] },
    { date: next2Str, tasks: [{ title: '', category: 'Fitness' }] }
  ]);

  const addTaskRow = (planIndex) => {
    setPlans(prev => {
      const copy = [...prev];
      copy[planIndex].tasks.push({ title: '', category: 'Development' });
      return copy;
    });
  };

  const removeTaskRow = (planIndex, taskIndex) => {
    setPlans(prev => {
      const copy = [...prev];
      copy[planIndex].tasks = copy[planIndex].tasks.filter((_, idx) => idx !== taskIndex);
      return copy;
    });
  };

  const updateTaskField = (planIndex, taskIndex, field, value) => {
    setPlans(prev => {
      const copy = [...prev];
      copy[planIndex].tasks[taskIndex][field] = value;
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveBatchPlans(plans, selectedMemberId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073F40]/40 backdrop-blur-xs">
      <div className="bg-white border border-[#A8DDD5]/60 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6E8581] hover:text-[#073F40] p-1 rounded-lg hover:bg-[#E8F4F0] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold text-[#073F40] mb-1">
          Multi-Day Rapid Planner
        </h2>
        <p className="text-xs text-[#6E8581] mb-4">
          Plan tasks across multiple upcoming dates in a single view.
        </p>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase text-[#6E8581] mb-1">
            Planning For Team Member
          </label>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="w-full px-3.5 py-2 bg-[#F7F8F2] border border-[#A8DDD5] rounded-xl text-[#123536] text-xs font-semibold cursor-pointer"
          >
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {plans.map((plan, planIdx) => (
            <div key={plan.date} className="p-4 bg-[#F7F8F2] border border-[#A8DDD5]/60 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-[#A8DDD5]/30 pb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#159A92]" />
                  <input
                    type="date"
                    value={plan.date}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPlans(prev => {
                        const copy = [...prev];
                        copy[planIdx].date = val;
                        return copy;
                      });
                    }}
                    className="text-xs font-bold text-[#073F40] bg-white border border-[#A8DDD5] rounded-md px-2 py-1"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => addTaskRow(planIdx)}
                  className="text-xs text-[#159A92] hover:text-[#073F40] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Row</span>
                </button>
              </div>

              <div className="space-y-2">
                {plan.tasks.map((taskItem, taskIdx) => (
                  <div key={taskIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Task title..."
                      value={taskItem.title}
                      onChange={(e) => updateTaskField(planIdx, taskIdx, 'title', e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#A8DDD5] rounded-lg text-xs font-medium text-[#123536] focus:outline-none focus:border-[#159A92]"
                    />

                    <select
                      value={taskItem.category}
                      onChange={(e) => updateTaskField(planIdx, taskIdx, 'category', e.target.value)}
                      className="px-2 py-1.5 bg-white border border-[#A8DDD5] rounded-lg text-xs text-[#123536] cursor-pointer"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    {plan.tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTaskRow(planIdx, taskIdx)}
                        className="p-1 text-[#6E8581] hover:text-rose-600 rounded cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#A8DDD5]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#6E8581] hover:text-[#073F40] hover:bg-[#E8F4F0] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#073F40] hover:bg-[#0B5553] rounded-lg shadow-xs transition-all cursor-pointer"
            >
              Save All Schedules
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
