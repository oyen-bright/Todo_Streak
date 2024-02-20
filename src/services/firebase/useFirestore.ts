import {
  addDoc,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  Unsubscribe,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import db from "../../config/firebase";
import { Todo, TodoType } from "../../types/Todo";
import { DailyProgress, HabitTracker, WeekProgress } from "../../types/Habit";
import { convertDate } from "../../utils/dateUtils";
import { DateTime } from "../../types/DateTimes";
import {
  createFirestoreCollection,
  getFirestoreDoc,
} from "./firebaseCollections";
import { habitCollectionName, todoCollectionName } from "./collectionNames";
import {
  getCompletedDatesForTodo,
  getWeekKey,
  updateTodoStreak,
} from "../../utils/todoUtils";
import {
  calculateCurrentStreak,
  calculateLongestStreak,
  calculateWeeklyStreaks,
} from "../../utils/streakUtils";

export const useFirestore = () => {
  const addTodo = async (todo: Todo) => {
    try {
      const docRef = await addDoc(
        createFirestoreCollection(todoCollectionName),
        todo
      );
      await updateDoc(getFirestoreDoc(todoCollectionName, docRef.id), {
        id: docRef.id,
      });

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

      console.log("Todo added with ID: ", docRef.id);

      await setDoc(doc(db, "Habit", docRef.id), habitData);
    } catch (error) {
      console.error("Error adding todo: ", error);
      throw error;
    }
  };

  const updateTodo = async (todo: Todo) => {
    try {
      const weekKey = getWeekKey(new Date(todo.updatedDate));

      if (TodoType.daily) {
        todo.days?.forEach((e) => {
          if (
            todo.tracking?.progress.daily !== null &&
            todo.tracking?.progress.daily[e] === undefined
          ) {
            todo.tracking!.progress.daily[e] = {
              completedDates: [],
              longestStreak: 0,
              currentStreak: 0,
            };
          }
        });
      }

      if (todo.type === TodoType.weekly) {
        const weekProgress =
          (
            todo.tracking?.progress.weekly?.data as Record<string, WeekProgress>
          )[weekKey] ?? null;

        if (!weekProgress) {
          if (todo.tracking?.progress.weekly) {
            (todo.tracking.progress.weekly.data as Record<
              string,
              WeekProgress
            >) = {
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
        } else {
          (
            todo.tracking?.progress.weekly?.data as Record<string, WeekProgress>
          )[weekKey].frequency = todo.frequency ?? 0;
        }

        if (todo.tracking != null) {
          await updateDoc(
            getFirestoreDoc(habitCollectionName, todo.id),
            todo.tracking
          );
          await updateDoc(getFirestoreDoc(todoCollectionName, todo.id), todo);
        }
      }
    } catch (error) {
      console.error("Error adding todo: ", error);
      throw error;
    }
  };

  const getTodos = (callback: (todos: Todo[]) => void): Unsubscribe => {
    try {
      const unsubscribe = onSnapshot(
        createFirestoreCollection(todoCollectionName),
        async (snapshot) => {
          const todos: Todo[] = [];
          await Promise.all(
            snapshot.docs.map(
              async (data: QueryDocumentSnapshot<DocumentData>) => {
                const todo = data.data() as Todo;
                const habitSnapshot = await getDoc(
                  getFirestoreDoc(habitCollectionName, data.id)
                );
                const habit = habitSnapshot.data() as HabitTracker;
                todo.tracking = habit;
                todos.push(todo);
              }
            )
          );
          callback(todos);
        }
      );
      return unsubscribe;
    } catch (error) {
      console.error("Error getting todos: ", error);
      throw error;
    }
  };

  const updateTodoHabit = async (todo: Todo, date: Date): Promise<void> => {
    try {
      const appDateTime: DateTime = convertDate(date);
      const currentCompletedDate: DateTime[] | null = getCompletedDatesForTodo(
        todo,
        date
      );

      console.log(currentCompletedDate);

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

          if (todo.type == TodoType.daily) {
            newCurrentStreak = calculateCurrentStreak(completedDateDate);
            newLongestStreak = calculateLongestStreak(completedDateDate);
          }

          if (todo.type == TodoType.weekly) {
            const trackedDate = todo.tracking?.progress.weekly?.data as Record<
              string,
              WeekProgress
            >;
            const habitStreak = calculateWeeklyStreaks(trackedDate);
            newLongestStreak = habitStreak.longestStreak;
            newCurrentStreak = habitStreak.currentStreak;
          }

          console.log(completedDateDate);

          console.log(newCurrentStreak);
          console.log(newLongestStreak);

          const updatedTodo: Todo = updateTodoStreak(
            todo,
            newCurrentStreak,
            newLongestStreak,
            date
          );

          console.log(updatedTodo.tracking?.progress.weekly?.data);

          await updateDoc(
            getFirestoreDoc(habitCollectionName, todo.id),

            updatedTodo.tracking!
          );
          console.log("Todo updated:", todo.id);
        } else {
          throw new Error("Task already completed please refresh to update");
        }
      }
    } catch (error) {
      console.error("Error updating todo: ", error);
      throw error;
    }
  };

  const resetDatabase = async () => {
    try {
      const todosQuerySnapshot = await getDocs(
        createFirestoreCollection(todoCollectionName)
      );
      const todosBatch = writeBatch(db);
      todosQuerySnapshot.forEach((doc) => {
        todosBatch.delete(doc.ref);
      });
      await todosBatch.commit();
      console.log("Todos collection deleted");
      const todoStreaksQuerySnapshot = await getDocs(
        createFirestoreCollection(habitCollectionName)
      );
      const todoStreaksBatch = writeBatch(db);
      todoStreaksQuerySnapshot.forEach((doc) => {
        todoStreaksBatch.delete(doc.ref);
      });
      await todoStreaksBatch.commit();
      console.log("TodoStreaks collection deleted");
      console.log("Database reset completed");
    } catch (error) {
      console.error("Error resetting database: ", error);
      throw error;
    }
  };

  return {
    addTodo,
    resetDatabase,
    getTodos,
    updateTodo,
    updateTodoHabit,
  };
};
