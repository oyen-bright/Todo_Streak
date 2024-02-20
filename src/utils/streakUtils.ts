import { DailyProgress, WeekProgress } from "../types/Habit";
import { Todo, TodoType } from "../types/Todo";
import { getWeekKey } from "./todoUtils";

export const getDailyStreak = (
  todo: Todo,
  currentDay: number
): { currentStreak: number; longestStreak: number } => {
  let currentStreak = 0;
  let longestStreak = 0;
  const habit = todo.tracking?.progress.daily;

  if (habit && habit[currentDay]) {
    const dailyProgress: DailyProgress = habit[currentDay];
    currentStreak = dailyProgress.currentStreak;
    longestStreak = dailyProgress.longestStreak;
  }

  return {
    currentStreak,
    longestStreak,
  };
};

export const getWeeklyStreak = (
  todo: Todo
): { currentStreak: number; longestStreak: number } => {
  let currentStreak = 0;
  let longestStreak = 0;
  const habit = todo.tracking?.progress.weekly;

  if (habit) {
    currentStreak = habit?.currentStreak as number;
    longestStreak = habit?.longestStreak as number;
  }

  return {
    currentStreak,
    longestStreak,
  };
};

export const getWeekStreak = (
  todo: Todo,
  date: Date
): { completed: number; frequency: number } => {
  let frequency = 0;
  let completed = 0;

  if (todo.type == TodoType.weekly) {
    const weekKey: string = getWeekKey(date);

    const weekProgress =
      (todo.tracking?.progress.weekly?.data as Record<string, WeekProgress>)[
        weekKey
      ] ?? null;

    if (weekProgress) {
      frequency = weekProgress.frequency;
      completed = weekProgress.completedDates.length;
    }
  }
  return {
    completed,
    frequency,
  };
};

export const calculateCurrentStreak = (completedDates: string[]): number => {
  completedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let currentStreak = 0;
  let previousDate: Date | null = null;

  for (const date of completedDates) {
    const currentDate = new Date(date);

    if (previousDate === null) {
      currentStreak = 1;
      previousDate = currentDate;
    } else {
      const daysDifference = Math.floor(
        (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDifference === 7) {
        currentStreak++;
        previousDate = currentDate;
      } else {
        break;
      }
    }
  }

  return currentStreak;
};

export function calculateWeeklyStreaks(weekMap: Record<string, WeekProgress>): {
  currentStreak: number;
  longestStreak: number;
} {
  const sortedKeys = Object.keys(weekMap).sort((a, b) => {
    const dateA = new Date(a.split("-")[0]);
    const dateB = new Date(b.split("-")[0]);
    return dateA.getTime() - dateB.getTime();
  });

  let currentStreak = 0;
  let longestStreak = 0;

  sortedKeys.forEach((key) => {
    const { completedDates, frequency } = weekMap[key];
    const numCompleted = completedDates.length;

    if (numCompleted >= frequency) {
      currentStreak += frequency;
    } else {
      currentStreak = 0;
    }

    longestStreak = Math.max(longestStreak, currentStreak);
  });

  return { currentStreak, longestStreak };
}

export const calculateLongestStreak = (completedDates: string[]): number => {
  let longestStreak = 0;
  let currentStreak = 0;
  let previousDate: Date | null = null;

  completedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  for (const date of completedDates) {
    const currentDate = new Date(date);

    if (previousDate === null) {
      currentStreak = 1;
      previousDate = currentDate;
    } else {
      const daysDifference = Math.floor(
        (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDifference > 7) {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      } else {
        currentStreak++;
      }
      previousDate = currentDate;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return longestStreak;
};
