import { DateTime } from "../types/DateTimes";
import { WeekProgress } from "../types/Habit";
import { Todo, TodoType } from "../types/Todo";
import {
  convertDate,
  generateUniqueKeyForWeek,
  getStartAndEndOfWeek,
} from "./dateUtils";

export function getCompletedDatesForTodo(
  todo: Todo,
  date: Date
): DateTime[] | null {
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

        return getCompletedDatesForTodo(todo, date);
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

        return getCompletedDatesForTodo(todo, date);
      }
    }
  }
  return null;
}

export function getWeekKey(date: Date): string {
  const startEndOfWeek = getStartAndEndOfWeek(date);
  return generateUniqueKeyForWeek(
    startEndOfWeek.startOfWeek,
    startEndOfWeek.endOfWeek
  );
}

export function updateTodoStreak(
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

export function getTodoDateCompletion(todo: Todo, date: Date): DateTime | null {
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
}
