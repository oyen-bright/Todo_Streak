import { DateTime } from "./DateTimes";
import { TodoType } from "./Todo";

export type HabitTracker = {
  lastUpdated:string;
  todoID: string;
  type: TodoType;
  progress: {
    daily: Record<string, DailyProgress> | null;
    weekly: Record<string, Record<string, WeekProgress> | number> | null;
  };
};

export type DailyProgress = {
  currentStreak: number;
  longestStreak: number;
  completedDates: DateTime[];
};

export type WeekProgress = {
  completedDates: DateTime[];
  frequency: number;
};


