/**
 * Achievements evaluation helper for secondcome
 */

export const ACHIEVEMENTS_LIST = [
  {
    id: "first_step",
    title: "First Step",
    description: "Complete your first task.",
    icon: "🚀",
    check: (stats, allTimeCompletedCount) => allTimeCompletedCount >= 1
  },
  {
    id: "run_7_days",
    title: "7 Day Run",
    description: "Complete your daily target for 7 consecutive days.",
    icon: "🔥",
    check: (stats) => stats.bestStreak >= 7
  },
  {
    id: "tasks_50",
    title: "50 Tasks",
    description: "Complete 50 task instances.",
    icon: "🎯",
    check: (stats, allTimeCompletedCount) => allTimeCompletedCount >= 50
  },
  {
    id: "perfect_week",
    title: "Perfect Week",
    description: "Complete all planned tasks for 7 consecutive days.",
    icon: "🌟",
    check: (stats) => stats.perfectDaysCount >= 7 || stats.bestStreak >= 7
  },
  {
    id: "consistency",
    title: "Consistency",
    description: "Reach 80% monthly completion.",
    icon: "⚡",
    check: (stats) => stats.completionRate >= 80 && stats.totalPossibleInstances > 0
  },
  {
    id: "month_master",
    title: "Month Master",
    description: "Reach 100% completion for the month.",
    icon: "👑",
    check: (stats) => stats.completionRate === 100 && stats.totalPossibleInstances > 0
  }
];

export const evaluateAchievements = (tasks, stats) => {
  // Total completed instances across all dates for all tasks
  let allTimeCompletedCount = 0;
  tasks.forEach(task => {
    if (task.completed) {
      Object.values(task.completed).forEach(val => {
        if (val) allTimeCompletedCount++;
      });
    }
  });

  return ACHIEVEMENTS_LIST.map(achievement => {
    const isUnlocked = achievement.check(stats, allTimeCompletedCount);
    return {
      ...achievement,
      unlocked: isUnlocked
    };
  });
};
