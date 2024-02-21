import { Unsubscribe } from "firebase/firestore";

import {
  addDocument,
  clearCollections,
  setDocument,
  subscribeToCollection,
  updateDocument,
} from "./FirebaseService";
import { collection } from "../config/collectionName";
import HabitService from "./HabitService";
import { Todo, TodoType } from "../types/Todo";
import { DailyProgress, HabitTracker, WeekProgress } from "../types/Habit";
import { getWeekKey } from "../utils/dateUtils";

const TodoService = {
  getTodos: (callback: (todos: Todo[]) => void): Unsubscribe => {
    try {
      const unsubscribe = subscribeToCollection(
        collection.todo,
        async (snapshot) => {
          const todos: Todo[] = [];
          await Promise.all(
            snapshot.docs.map(async (data) => {
              const todo = data.data() as Todo;
              if (todo.id !== "") {
                const todoHabit: HabitTracker = await HabitService.getHabit(
                  todo.id
                );
                todo.tracking = todoHabit;
                todos.push(todo);
              }
            })
          );
          callback(todos);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error getting todos: ", error);
      throw error;
    }
  },

  updateTodo: async (NewTodo: Todo) => {
    try {
      const weekKey = getWeekKey(new Date(NewTodo.updatedDate));

      if (NewTodo.type === TodoType.daily) {
        NewTodo.days?.forEach((e) => {
          console.log(e);

          console.log(NewTodo.tracking?.progress.daily);

          if (
            NewTodo.tracking?.progress.daily !== null &&
            NewTodo.tracking?.progress.daily[e] === undefined
          ) {
            NewTodo.tracking!.progress.daily[e] = {
              completedDates: [],
              longestStreak: 0,
              currentStreak: 0,
            };
          }
        });
      }

      if (NewTodo.type === TodoType.weekly) {
        const weekProgress =
          (
            NewTodo.tracking?.progress.weekly?.data as Record<
              string,
              WeekProgress
            >
          )[weekKey] ?? null;

        if (!weekProgress) {
          if (NewTodo.tracking?.progress.weekly) {
            (NewTodo.tracking.progress.weekly.data as Record<
              string,
              WeekProgress
            >) = {
              ...(NewTodo.tracking.progress.weekly.data as Record<
                string,
                WeekProgress
              >),
              [weekKey]: {
                completedDates: [],
                frequency: NewTodo.frequency ?? 0,
              },
            };
          }
        } else {
          (
            NewTodo.tracking?.progress.weekly?.data as Record<
              string,
              WeekProgress
            >
          )[weekKey].frequency = NewTodo.frequency ?? 0;
        }
      }

      if (NewTodo.tracking != null) {
        await updateDocument(collection.habit, NewTodo.id, NewTodo.tracking);
        await updateDocument(collection.todo, NewTodo.id, NewTodo);
      }
    } catch (error) {
      console.error("Error updating todo: ", error);
      throw error;
    }
  },

  addTodo: async (todo: Todo) => {
    try {
      const docRef = await addDocument(collection.todo, todo);

      const weekKey = getWeekKey(new Date(todo.createdDate));
      const habitData: HabitTracker = {
        todoID: docRef.id,
        type: todo.type,
        lastUpdated: todo.createdDate,
        progress: {
          daily:
            todo.type === TodoType.daily && todo.days
              ? todo.days.reduce((acc, day) => {
                  acc[day.toString()] = {
                    currentStreak: 0,
                    longestStreak: 0,
                    completedDates: [],
                  };
                  return acc;
                }, {} as Record<string, DailyProgress>)
              : null,
          weekly:
            todo.type === TodoType.weekly
              ? {
                  currentStreak: 0,
                  longestStreak: 0,
                  data: {
                    [weekKey]: {
                      frequency: todo.frequency ?? 0,
                      completedDates: [],
                    },
                  },
                }
              : null,
        },
      };

      await setDocument(collection.habit, docRef.id, habitData);
      await updateDocument(collection.todo, docRef.id, {
        id: docRef.id,
      });
    } catch (error) {
      console.error("Error adding todo: ", error);
      throw error;
    }
  },

  filterTodosByDate: (todos: Todo[], appDate: Date): Todo[] => {
    return todos
      .filter((todo) => {
        const createdDate = new Date(todo.createdDate);
        const currentDate = appDate;
        createdDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        const createdTimestamp = createdDate.getTime();
        const currentTimestamp = currentDate.getTime();
        const createdOrEarlierThanGivenDate =
          createdTimestamp <= currentTimestamp;

        if (createdOrEarlierThanGivenDate) {
          if (todo.type == TodoType.daily) {
            const currentAppDate = appDate.getDay();

            if (todo.days?.includes(currentAppDate)) {
              return true;
            }
            return false;
          }
        }

        return createdOrEarlierThanGivenDate;
      })
      .map((todo) => {
        //TODO:on Date change recalculate the steak for simulation if needed;
        return todo;
      });
  },

  clearData: async () => {
    return clearCollections(collection.todo);
  },
};
export default TodoService;
