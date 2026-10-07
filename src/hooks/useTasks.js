import { useState, useEffect, useMemo } from 'react';
import { formatDateKey, addDays, generateDatesForRepeat } from '../utils/dateUtils';
import { DEFAULT_MEMBERS, loadTasksFromStorage, saveTasksToStorage, calculateStreak } from '../utils/taskUtils';

export function useTasks() {
  const [selectedDateKey, setSelectedDateKey] = useState(() => formatDateKey(new Date()));
  const [allTasks, setAllTasks] = useState(loadTasksFromStorage);
  const [members] = useState(DEFAULT_MEMBERS);

  // Sync state to localStorage
  useEffect(() => {
    saveTasksToStorage(allTasks);
  }, [allTasks]);

  // Tasks belonging ONLY to the selected date
  const selectedDateTasks = useMemo(() => {
    return allTasks.filter(t => t.date === selectedDateKey);
  }, [allTasks, selectedDateKey]);

  // Navigation
  const goToPreviousDay = () => {
    setSelectedDateKey(prev => addDays(prev, -1));
  };

  const goToNextDay = () => {
    setSelectedDateKey(prev => addDays(prev, 1));
  };

  const goToToday = () => {
    setSelectedDateKey(formatDateKey(new Date()));
  };

  const selectDate = (dateKey) => {
    setSelectedDateKey(dateKey);
  };

  // Toggle completion for a specific task instance
  const toggleTaskCompletion = (taskId) => {
    setAllTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  // Add tasks across one or multiple dates / repeat settings
  const addTasks = ({ memberId = 'member-1', title, category, dates, repeat = 'once', untilDateKey }) => {
    if (!title.trim()) return;

    let targetDates = dates && dates.length > 0 ? dates : [selectedDateKey];

    if (repeat !== 'once') {
      targetDates = generateDatesForRepeat({
        startDateKey: targetDates[0] || selectedDateKey,
        repeat,
        untilDateKey,
        selectedDates: targetDates
      });
    }

    const newTasks = targetDates.map(dateKey => ({
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 7)}`,
      memberId: memberId || 'member-1',
      title: title.trim(),
      category: category || 'General',
      date: dateKey,
      completed: false,
      createdAt: new Date().toISOString()
    }));

    setAllTasks(prev => [...newTasks, ...prev]);
  };

  // Batch Add multiple tasks across dates for rapid planning
  const addBatchPlanningTasks = (plans, defaultMemberId = 'member-1') => {
    // plans is an array of { date: string, memberId?: string, tasks: Array<{ title, category }> }
    const newTasks = [];

    plans.forEach(plan => {
      const planMemberId = plan.memberId || defaultMemberId || 'member-1';
      plan.tasks.forEach(t => {
        if (t.title.trim()) {
          newTasks.push({
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 7)}`,
            memberId: planMemberId,
            title: t.title.trim(),
            category: t.category || 'General',
            date: plan.date,
            completed: false,
            createdAt: new Date().toISOString()
          });
        }
      });
    });

    if (newTasks.length > 0) {
      setAllTasks(prev => [...newTasks, ...prev]);
    }
  };

  // Edit task
  const editTask = (taskId, { memberId, title, category }) => {
    setAllTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          memberId: memberId || t.memberId || 'member-1',
          title: title.trim(),
          category: category || t.category
        };
      }
      return t;
    }));
  };

  // Move task to another date
  const moveTaskToDate = (taskId, newDateKey) => {
    setAllTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          date: newDateKey
        };
      }
      return t;
    }));
  };

  // Duplicate task to another date (or same date)
  const duplicateTask = (taskId, targetDateKey) => {
    const original = allTasks.find(t => t.id === taskId);
    if (!original) return;

    const copy = {
      ...original,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 7)}`,
      memberId: original.memberId || 'member-1',
      date: targetDateKey || original.date,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setAllTasks(prev => [copy, ...prev]);
  };

  // Delete task
  const deleteTask = (taskId) => {
    setAllTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Stats calculation for current date across all team members
  const completedCount = selectedDateTasks.filter(t => t.completed).length;
  const totalCount = selectedDateTasks.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const streakDays = useMemo(() => calculateStreak(allTasks), [allTasks]);

  return {
    members,
    selectedDateKey,
    selectedDateTasks,
    allTasks,
    goToPreviousDay,
    goToNextDay,
    goToToday,
    selectDate,
    toggleTaskCompletion,
    addTasks,
    addBatchPlanningTasks,
    editTask,
    moveTaskToDate,
    duplicateTask,
    deleteTask,
    completedCount,
    totalCount,
    progressPercentage,
    streakDays
  };
}
