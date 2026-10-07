import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar as CalendarIcon, Repeat } from 'lucide-react';
import { formatDateKey, addDays, MONTH_NAMES } from '../utils/dateUtils';

const CATEGORIES = ['Development', 'Study', 'Fitness', 'Work', 'Personal', 'General'];

export default function AddTaskModal({ 
  isOpen, 
  onClose, 
  selectedDateKey,
  onSaveTasks, 
  taskToEdit,
  onEditSave,
  members = [],
  defaultMemberId = 'member-1'
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Development');
  const [memberId, setMemberId] = useState(defaultMemberId);
  
  // Date Selection mode: 'today', 'tomorrow', 'custom_dates'
  const [dateSelectionMode, setDateSelectionMode] = useState('selected_date');
  const [selectedDatesList, setSelectedDatesList] = useState([selectedDateKey]);
  const [customDateInput, setCustomDateInput] = useState('');

  // Repeat mode: 'once', 'everyday', 'weekdays'
  const [repeatOption, setRepeatOption] = useState('once');
  const [untilDateKey, setUntilDateKey] = useState(() => addDays(selectedDateKey, 7));

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setCategory(taskToEdit.category || 'Development');
      setMemberId(taskToEdit.memberId || defaultMemberId || 'member-1');
    } else {
      setTitle('');
      setCategory('Development');
      setMemberId(defaultMemberId || 'member-1');
      setDateSelectionMode('selected_date');
      setSelectedDatesList([selectedDateKey]);
      setRepeatOption('once');
    }
  }, [taskToEdit, isOpen, selectedDateKey, defaultMemberId]);

  if (!isOpen) return null;

  const todayStr = formatDateKey(new Date());
  const tomorrowStr = addDays(todayStr, 1);

  const toggleSelectDate = (dateKey) => {
    setSelectedDatesList(prev => 
      prev.includes(dateKey) 
        ? prev.filter(d => d !== dateKey) 
        : [...prev, dateKey].sort()
    );
  };

  const handleAddCustomDate = () => {
    if (customDateInput && !selectedDatesList.includes(customDateInput)) {
      setSelectedDatesList(prev => [...prev, customDateInput].sort());
      setCustomDateInput('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (taskToEdit) {
      onEditSave(taskToEdit.id, { memberId, title, category });
      onClose();
      return;
    }

    let finalDates = [];
    if (dateSelectionMode === 'today') {
      finalDates = [todayStr];
    } else if (dateSelectionMode === 'tomorrow') {
      finalDates = [tomorrowStr];
    } else if (dateSelectionMode === 'selected_date') {
      finalDates = [selectedDateKey];
    } else if (dateSelectionMode === 'custom_dates') {
      finalDates = selectedDatesList.length > 0 ? selectedDatesList : [selectedDateKey];
    }

    onSaveTasks({
      memberId,
      title: title.trim(),
      category,
      dates: finalDates,
      repeat: repeatOption,
      untilDateKey
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#073F40]/40 backdrop-blur-xs">
      <div className="bg-white border border-[#A8DDD5]/60 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6E8581] hover:text-[#073F40] p-1 rounded-lg hover:bg-[#E8F4F0] transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold text-[#073F40] mb-4">
          {taskToEdit ? 'Edit Task' : 'Add New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Member Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase text-[#6E8581] mb-1">
              Team Member
            </label>
            <select
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F7F8F2] border border-[#A8DDD5] rounded-xl text-[#123536] focus:outline-none focus:border-[#159A92] focus:bg-white text-sm font-medium cursor-pointer"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Task Name */}
          <div>
            <label className="block text-xs font-semibold uppercase text-[#6E8581] mb-1">
              Task Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete React UI Project"
              className="w-full px-3.5 py-2.5 bg-[#F7F8F2] border border-[#A8DDD5] rounded-xl text-[#123536] placeholder-[#6E8581]/60 focus:outline-none focus:border-[#159A92] focus:bg-white transition-all text-sm font-medium"
              autoFocus
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase text-[#6E8581] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F7F8F2] border border-[#A8DDD5] rounded-xl text-[#123536] focus:outline-none focus:border-[#159A92] focus:bg-white text-sm font-medium cursor-pointer"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Date Selection Options */}
          {!taskToEdit && (
            <div className="border-t border-[#A8DDD5]/30 pt-3 space-y-3">
              <label className="block text-xs font-semibold uppercase text-[#073F40]">
                Schedule Date(s)
              </label>

              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setDateSelectionMode('selected_date')}
                  className={`py-2 px-3 rounded-lg border text-center cursor-pointer transition-all ${
                    dateSelectionMode === 'selected_date'
                      ? 'bg-[#073F40] text-white border-[#073F40] font-bold'
                      : 'bg-[#F7F8F2] text-[#123536] border-[#A8DDD5]/60 hover:bg-[#E8F4F0]'
                  }`}
                >
                  Selected Date ({selectedDateKey})
                </button>

                <button
                  type="button"
                  onClick={() => setDateSelectionMode('today')}
                  className={`py-2 px-3 rounded-lg border text-center cursor-pointer transition-all ${
                    dateSelectionMode === 'today'
                      ? 'bg-[#073F40] text-white border-[#073F40] font-bold'
                      : 'bg-[#F7F8F2] text-[#123536] border-[#A8DDD5]/60 hover:bg-[#E8F4F0]'
                  }`}
                >
                  Today ({todayStr})
                </button>

                <button
                  type="button"
                  onClick={() => setDateSelectionMode('tomorrow')}
                  className={`py-2 px-3 rounded-lg border text-center cursor-pointer transition-all ${
                    dateSelectionMode === 'tomorrow'
                      ? 'bg-[#073F40] text-white border-[#073F40] font-bold'
                      : 'bg-[#F7F8F2] text-[#123536] border-[#A8DDD5]/60 hover:bg-[#E8F4F0]'
                  }`}
                >
                  Tomorrow ({tomorrowStr})
                </button>

                <button
                  type="button"
                  onClick={() => setDateSelectionMode('custom_dates')}
                  className={`py-2 px-3 rounded-lg border text-center cursor-pointer transition-all ${
                    dateSelectionMode === 'custom_dates'
                      ? 'bg-[#073F40] text-white border-[#073F40] font-bold'
                      : 'bg-[#F7F8F2] text-[#123536] border-[#A8DDD5]/60 hover:bg-[#E8F4F0]'
                  }`}
                >
                  Select Multiple Dates
                </button>
              </div>

              {/* Multi-date Selector */}
              {dateSelectionMode === 'custom_dates' && (
                <div className="p-3 bg-[#E8F4F0]/60 border border-[#A8DDD5]/60 rounded-xl space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={customDateInput}
                      onChange={(e) => setCustomDateInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-[#A8DDD5] rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomDate}
                      className="px-3 py-1.5 bg-[#159A92] hover:bg-[#0B5553] text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedDatesList.map(dKey => (
                      <span key={dKey} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-white border border-[#A8DDD5] text-[#073F40] rounded-md font-semibold">
                        {dKey}
                        <button
                          type="button"
                          onClick={() => toggleSelectDate(dKey)}
                          className="hover:text-rose-600 cursor-pointer ml-1"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Repeat options */}
              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase text-[#6E8581] mb-1">
                  Repeat Setting
                </label>
                <select
                  value={repeatOption}
                  onChange={(e) => setRepeatOption(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#A8DDD5] rounded-xl text-xs text-[#123536] cursor-pointer"
                >
                  <option value="once">Once</option>
                  <option value="everyday">Every Day</option>
                  <option value="weekdays">Weekdays (Mon-Fri)</option>
                </select>
              </div>

              {repeatOption !== 'once' && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#6E8581] mb-1">
                    Repeat Until
                  </label>
                  <input
                    type="date"
                    value={untilDateKey}
                    onChange={(e) => setUntilDateKey(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F7F8F2] border border-[#A8DDD5] rounded-xl text-xs"
                  />
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#A8DDD5]/30">
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
              {taskToEdit ? 'Save Changes' : 'Schedule Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
