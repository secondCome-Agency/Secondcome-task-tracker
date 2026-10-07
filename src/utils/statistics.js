/**
 * Statistics calculation helpers for secondcome
 */
import { getDaysForMonth, formatDateKey, isFutureDate } from './dateUtils';

/**
 * Calculate completion percentage and details for a month
 */
export const calculateMonthlyStats = (tasks, year, month) => {
  const days = getDaysForMonth(year, month);
  const todayKey = formatDateKey(new Date());

  // Filter days that are elapsed (up to today or whole month if past month)
  const elapsedDays = days.filter(d => d.dateKey <= todayKey);
  
  if (tasks.length === 0) {
    return {
      totalTasks: 0,
      totalPossibleInstances: 0,
      completedInstances: 0,
      missedInstances: 0,
      completionRate: 0,
      perfectDaysCount: 0,
      currentStreak: 0,
      bestStreak: 0,
      bestDay: null
    };
  }

  let totalPossibleInstances = 0;
  let completedInstances = 0;
  let perfectDaysCount = 0;

  // Track daily completion stats for heatmap / charts
  const dailyStats = days.map(d => {
    let dayCompleted = 0;
    let dayTotal = tasks.length;

    tasks.forEach(task => {
      if (task.completed && task.completed[d.dateKey]) {
        dayCompleted++;
      }
    });

    const rate = dayTotal > 0 ? (dayCompleted / dayTotal) : 0;
    
    // Only count instances for elapsed days (or today)
    if (d.dateKey <= todayKey) {
      totalPossibleInstances += dayTotal;
      completedInstances += dayCompleted;
      if (dayTotal > 0 && dayCompleted === dayTotal) {
        perfectDaysCount++;
      }
    }

    return {
      dayNumber: d.dayNumber,
      dateKey: d.dateKey,
      dayOfWeek: d.dayOfWeek,
      completed: dayCompleted,
      total: dayTotal,
      percentage: Math.round(rate * 100),
      isPerfect: dayTotal > 0 && dayCompleted === dayTotal,
      isFuture: isFutureDate(d.dateKey)
    };
  });

  const elapsedDailyStats = dailyStats.filter(d => d.dateKey <= todayKey);
  
  // Calculate streaks across daily stats
  // A "successful day" is defined as user meeting 100% daily target (or >= 80% if preferred, let's use 100% perfect or all completed tasks)
  // Let's check streak based on days with 100% completion (or at least 1 completed task if tasks exist)
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Iterate backwards from today to find current streak
  let streakCheckIndex = elapsedDailyStats.length - 1;
  while (streakCheckIndex >= 0) {
    const day = elapsedDailyStats[streakCheckIndex];
    if (day.total > 0 && day.completed === day.total) {
      currentStreak++;
      streakCheckIndex--;
    } else {
      break;
    }
  }

  // Best streak calculation in the month
  elapsedDailyStats.forEach(day => {
    if (day.total > 0 && day.completed === day.total) {
      tempStreak++;
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  });

  // Best day identification
  let bestDay = null;
  let maxCompleted = -1;
  elapsedDailyStats.forEach(d => {
    if (d.completed > maxCompleted && d.total > 0) {
      maxCompleted = d.completed;
      bestDay = `Day ${d.dayNumber} (${d.completed}/${d.total})`;
    }
  });

  const missedInstances = totalPossibleInstances - completedInstances;
  const completionRate = totalPossibleInstances > 0 
    ? Math.round((completedInstances / totalPossibleInstances) * 100) 
    : 0;

  return {
    totalTasks: tasks.length,
    totalPossibleInstances,
    completedInstances,
    missedInstances,
    completionRate,
    perfectDaysCount,
    currentStreak,
    bestStreak,
    bestDay: bestDay || "N/A",
    dailyStats
  };
};

/**
 * Calculate category breakdown performance
 */
export const calculateCategoryStats = (tasks, year, month) => {
  const days = getDaysForMonth(year, month);
  const todayKey = formatDateKey(new Date());
  const elapsedDays = days.filter(d => d.dateKey <= todayKey);

  const categories = {};

  tasks.forEach(task => {
    const category = task.category || "Other";
    if (!categories[category]) {
      categories[category] = { totalInstances: 0, completedInstances: 0, taskCount: 0 };
    }
    categories[category].taskCount += 1;

    elapsedDays.forEach(d => {
      categories[category].totalInstances += 1;
      if (task.completed && task.completed[d.dateKey]) {
        categories[category].completedInstances += 1;
      }
    });
  });

  const categoryList = Object.keys(categories).map(cat => {
    const data = categories[cat];
    const percentage = data.totalInstances > 0 
      ? Math.round((data.completedInstances / data.totalInstances) * 100) 
      : 0;
    return {
      name: cat,
      taskCount: data.taskCount,
      completedInstances: data.completedInstances,
      totalInstances: data.totalInstances,
      percentage
    };
  });

  categoryList.sort((a, b) => b.percentage - a.percentage);
  return categoryList;
};
