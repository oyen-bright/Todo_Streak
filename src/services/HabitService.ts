import { collection } from "../config/collectionName";
import { DateTime } from "../types/DateTimes";
import { DailyProgress, HabitTracker, WeekProgress } from "../types/Habit";
import { Todo, TodoType } from "../types/Todo";
import { convertDate, getWeekKey } from "../utils/dateUtils";
import {
  clearCollections,
  getDocument,
  updateDocument,
} from "./FirebaseService";

const HabitService = {
  getHabit: (todoID: string): Promise<HabitTracker> => {
    return getDocument<HabitTracker>(collection.habit, todoID);
  },

  updateHabit: async (todo: Todo, date: Date): Promise<void> => {
    try {
      const appDateTime: DateTime = convertDate(date);
      const currentCompletedDate: DateTime[] | null = getHabitCompletedDates(
        todo,
        date
      );

      if (currentCompletedDate) {
        if (
          !currentCompletedDate.some((item) => item.date === appDateTime.date)
        ) {
          currentCompletedDate.push(appDateTime);
          const completedDateDate: string[] = currentCompletedDate.map(
            (e) => e.date
          );

          let newLongestStreak = 0;
          let newCurrentStreak = 0;

          if (todo.type === TodoType.daily) {
            newCurrentStreak = calculateDailyCurrentStreak(completedDateDate);
            newLongestStreak = calculateDailyLongestStreak(completedDateDate);
          }

          if (todo.type === TodoType.weekly) {
            const trackedDate = todo.tracking?.progress.weekly?.data as Record<
              string,
              WeekProgress
            >;
            const habitStreak = calculateWeeklyStreaks(trackedDate);
            newLongestStreak = habitStreak.longestStreak;
            newCurrentStreak = habitStreak.currentStreak;
          }

          const updatedTodo: Todo = updateTodoStreak(
            todo,
            newCurrentStreak,
            newLongestStreak,
            date
          );

          await updateDocument(
            collection.habit,
            todo.id,
            updatedTodo.tracking!
          );
        } else {
          throw new Error("Task already completed please refresh to update");
        }
      }
    } catch (error) {
      console.error("Error updating todo: ", error);
      throw error;
    }
  },

  getDailyStreak: (
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
  },

  getWeeklyStreak: (
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
  },

  getWeekStreak: (
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
  },

  getCompletedDateTime: (todo: Todo, date: Date): DateTime | null => {
    const currentDay: number = date.getDay();
    const currentDateDateTime = convertDate(date);
    const weekKey = getWeekKey(date);

    if (
      todo.type === TodoType.daily &&
      todo.tracking?.progress.daily?.[currentDay]
    ) {
      const completionData = todo.tracking.progress.daily[
        currentDay
      ].completedDates.find((e) => e.date === currentDateDateTime.date);
      return completionData ? completionData : null;
    }

    if (todo.type === TodoType.weekly) {
      const weekProgress =
        (todo.tracking?.progress.weekly?.data as Record<string, WeekProgress>)[
          weekKey
        ] ?? null;

      if (weekProgress) {
        const completionData = weekProgress.completedDates.find(
          (e) => e.date === currentDateDateTime.date
        );
        return completionData ? completionData : null;
      }
    }

    return null;
  },
  clearData: async () => {
    return clearCollections(collection.habit);
  },
};

function getHabitCompletedDates(todo: Todo, date: Date): DateTime[] | null {
  const currentDay: number = date.getDay();

  if (todo.type === TodoType.daily) {
    const progress = todo.tracking?.progress.daily?.[currentDay] ?? null;
    if (progress) {
      return progress.completedDates;
    } else {
      if (todo.tracking?.progress.daily) {
        todo.tracking.progress.daily = {
          ...(todo.tracking.progress.daily ?? {}),
          [currentDay]: {
            currentStreak: 0,
            longestStreak: 0,
            completedDates: [],
          },
        };

        return getHabitCompletedDates(todo, date);
      }
    }
  } else if (todo.type === TodoType.weekly) {
    const weekKey = getWeekKey(date);

    const weekProgress =
      (todo.tracking?.progress.weekly?.data as Record<string, WeekProgress>)[
        weekKey
      ] ?? null;

    if (weekProgress) {
      return weekProgress.completedDates;
    } else {
      if (todo.tracking?.progress.weekly) {
        if (todo.tracking?.progress.weekly) {
          (todo.tracking.progress.weekly.data as Record<string, WeekProgress>) =
            {
              ...(todo.tracking.progress.weekly.data as Record<
                string,
                WeekProgress
              >),
              [weekKey]: {
                completedDates: [],
                frequency: todo.frequency ?? 0,
              },
            };
        }

        return getHabitCompletedDates(todo, date);
      }
    }
  }
  return null;
}

function calculateWeeklyStreaks(weekMap: Record<string, WeekProgress>): {
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

function calculateDailyLongestStreak(completedDates: string[]): number {
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
}

function calculateDailyCurrentStreak(completedDates: string[]): number {
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
}

function updateTodoStreak(
  todo: Todo,
  currentStreak: number,
  longestStreak: number,
  date: Date
): Todo {
  const currentDay: number = date.getDay();

  if (
    todo.type === TodoType.daily &&
    todo.tracking?.progress.daily?.[currentDay]
  ) {
    todo.tracking.progress.daily[currentDay].currentStreak = currentStreak;
    todo.tracking.progress.daily[currentDay].longestStreak = longestStreak;
  }

  if (todo.type === TodoType.weekly && todo.tracking?.progress.weekly) {
    todo.tracking.progress.weekly.currentStreak = currentStreak;
    todo.tracking.progress.weekly.longestStreak = longestStreak;
  }

  return todo;
}
export default HabitService;
