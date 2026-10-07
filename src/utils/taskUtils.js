/**
 * Task Utility Calculations & Storage Manager
 */
import { formatDateKey, addDays } from './dateUtils';

const STORAGE_KEY = 'secondcome_daily_tasks_v3';

const todayStr = formatDateKey(new Date());
const tomorrowStr = addDays(todayStr, 1);
const yesterdayStr = addDays(todayStr, -1);

export const DEFAULT_MEMBERS = [
  { id: 'member-1', name: 'Tanu' },
  { id: 'member-2', name: 'Member 2' },
  { id: 'member-3', name: 'Member 3' },
  { id: 'member-4', name: 'Member 4' },
  { id: 'member-5', name: 'Member 5' }
];

export const SAMPLE_DAILY_TASKS = [
  // Member 1 (Tanu) - Today
  {
    id: 'task-1-1',
    memberId: 'member-1',
    title: 'React work',
    category: 'Development',
    date: todayStr,
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-1-2',
    memberId: 'member-1',
    title: 'Portfolio website',
    category: 'Personal',
    date: todayStr,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-1-3',
    memberId: 'member-1',
    title: 'Assignment',
    category: 'Study',
    date: todayStr,
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-1-4',
    memberId: 'member-1',
    title: 'Exercise',
    category: 'Fitness',
    date: todayStr,
    completed: false,
    createdAt: new Date().toISOString()
  },

  // Member 1 (Tanu) - Tomorrow
  {
    id: 'task-1-5',
    memberId: 'member-1',
    title: 'React work',
    category: 'Development',
    date: tomorrowStr,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-1-6',
    memberId: 'member-1',
    title: 'Client website',
    category: 'Work',
    date: tomorrowStr,
    completed: false,
    createdAt: new Date().toISOString()
  },

  // Member 2 - Today
  {
    id: 'task-2-1',
    memberId: 'member-2',
    title: 'Research',
    category: 'Work',
    date: todayStr,
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2-2',
    memberId: 'member-2',
    title: 'Meeting',
    category: 'Work',
    date: todayStr,
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2-3',
    memberId: 'member-2',
    title: 'Documentation',
    category: 'Study',
    date: todayStr,
    completed: false,
    createdAt: new Date().toISOString()
  },

  // Member 3 - Today
  {
    id: 'task-3-1',
    memberId: 'member-3',
    title: 'Design system',
    category: 'Work',
    date: todayStr,
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3-2',
    memberId: 'member-3',
    title: 'Website wireframes',
    category: 'Work',
    date: todayStr,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3-3',
    memberId: 'member-3',
    title: 'UI Components',
    category: 'Development',
    date: todayStr,
    completed: true,
    createdAt: new Date().toISOString()
  },

  // Member 4 - Today
  {
    id: 'task-4-1',
    memberId: 'member-4',
    title: 'Client work',
    category: 'Work',
    date: todayStr,
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4-2',
    memberId: 'member-4',
    title: 'Testing & QA',
    category: 'Development',
    date: todayStr,
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4-3',
    memberId: 'member-4',
    title: 'Bug fixes',
    category: 'Development',
    date: todayStr,
    completed: false,
    createdAt: new Date().toISOString()
  },

  // Member 5 - Today
  {
    id: 'task-5-1',
    memberId: 'member-5',
    title: 'Content outline',
    category: 'Personal',
    date: todayStr,
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-5-2',
    memberId: 'member-5',
    title: 'Instagram post',
    category: 'Personal',
    date: todayStr,
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-5-3',
    memberId: 'member-5',
    title: 'Video Reel edit',
    category: 'Personal',
    date: todayStr,
    completed: false,
    createdAt: new Date().toISOString()
  }
];

export const loadTasksFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(t => ({
          ...t,
          memberId: t.memberId || 'member-1'
        }));
      }
    }
  } catch (e) {
    console.error("Failed to load tasks from localStorage", e);
  }
  return SAMPLE_DAILY_TASKS;
};

export const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks to localStorage", e);
  }
};

/**
 * Calculate streak: number of consecutive days ending today/yesterday with >= 80% task completion
 */
export const calculateStreak = (allTasks) => {
  const dateMap = {};

  allTasks.forEach(task => {
    if (!dateMap[task.date]) {
      dateMap[task.date] = { total: 0, completed: 0 };
    }
    dateMap[task.date].total += 1;
    if (task.completed) {
      dateMap[task.date].completed += 1;
    }
  });

  const today = new Date();
  let streak = 0;
  let checkDate = new Date(today);

  // Check today first, if no tasks today check from yesterday
  const todayKey = formatDateKey(today);
  if (!dateMap[todayKey] || dateMap[todayKey].total === 0) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateKey = formatDateKey(checkDate);
    const dayData = dateMap[dateKey];

    if (!dayData || dayData.total === 0) {
      break;
    }

    const rate = dayData.completed / dayData.total;
    if (rate >= 0.75) {
      streak += 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};
