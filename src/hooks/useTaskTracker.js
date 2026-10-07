import { useState, useEffect, useMemo } from 'react';
import { formatDateKey } from '../utils/dateUtils';
import { calculateMonthlyStats, calculateCategoryStats } from '../utils/statistics';
import { evaluateAchievements } from '../utils/achievements';

const STORAGE_KEY = 'secondcome_tasks_v1';

const INITIAL_SAMPLE_TASKS = [
  {
    id: 'sample-1',
    title: 'Coding & React Practice',
    category: 'Development',
    target: 'Daily',
    createdAt: new Date().toISOString(),
    completed: {
      [formatDateKey(new Date())]: true,
      [formatDateKey(new Date(Date.now() - 86400000))]: true,
      [formatDateKey(new Date(Date.now() - 86400000 * 2))]: true
    }
  },
  {
    id: 'sample-2',
    title: 'Study System Architecture',
    category: 'Study',
    target: '5x a week',
    createdAt: new Date().toISOString(),
    completed: {
      [formatDateKey(new Date())]: true,
      [formatDateKey(new Date(Date.now() - 86400000))]: true
    }
  },
  {
    id: 'sample-3',
    title: 'Workout & Fitness',
    category: 'Fitness',
    target: 'Daily',
    createdAt: new Date().toISOString(),
    completed: {
      [formatDateKey(new Date())]: false,
      [formatDateKey(new Date(Date.now() - 86400000))]: true
    }
  },
  {
    id: 'sample-4',
    title: 'Reading Technical Articles',
    category: 'Personal',
    target: '30 mins',
    createdAt: new Date().toISOString(),
    completed: {
      [formatDateKey(new Date())]: true
    }
  },
  {
    id: 'sample-5',
    title: 'Portfolio Improvements',
    category: 'Work',
    target: 'Weekly',
    createdAt: new Date().toISOString(),
    completed: {}
  }
];

export function useTaskTracker() {
  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth()); // 0-indexed

  // Load initial tasks from localStorage or sample tasks
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load tasks from localStorage", e);
    }
    return INITIAL_SAMPLE_TASKS;
  });

  // Save tasks to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks to localStorage", e);
    }
  }, [tasks]);

  // Navigation functions
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Task manipulation
  const addTask = ({ title, category, target }) => {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      category: category || 'Other',
      target: target || '',
      createdAt: new Date().toISOString(),
      completed: {}
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const editTask = (id, { title, category, target }) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          title: title.trim(),
          category: category || 'Other',
          target: target || ''
        };
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskCompletion = (taskId, dateKey) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const completedMap = { ...(t.completed || {}) };
        completedMap[dateKey] = !completedMap[dateKey];
        return {
          ...t,
          completed: completedMap
        };
      }
      return t;
    }));
  };

  // Calculated statistics
  const monthlyStats = useMemo(() => {
    return calculateMonthlyStats(tasks, currentYear, currentMonth);
  }, [tasks, currentYear, currentMonth]);

  const categoryStats = useMemo(() => {
    return calculateCategoryStats(tasks, currentYear, currentMonth);
  }, [tasks, currentYear, currentMonth]);

  const achievements = useMemo(() => {
    return evaluateAchievements(tasks, monthlyStats);
  }, [tasks, monthlyStats]);

  return {
    currentYear,
    currentMonth,
    tasks,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    addTask,
    editTask,
    deleteTask,
    toggleTaskCompletion,
    monthlyStats,
    categoryStats,
    achievements
  };
}
