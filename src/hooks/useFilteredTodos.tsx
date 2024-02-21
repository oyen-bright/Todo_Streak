import { useEffect, useState } from "react";
import { Todo } from "../types/Todo";
import TodoService from "../services/TodoService";
import { useDate } from "../contexts/DateContext";

interface UseFilteredTodosResult {
  filteredTodos: Todo[];
  error: string | null;
}

const useFilteredTodos = (): UseFilteredTodosResult => {
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const { appDate } = useDate();

  useEffect(() => {
    try {
      const unsubscribe = TodoService.getTodos((todos: Todo[]) => {
        setTodos(todos);
      });

      return () => unsubscribe();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "Failed to fetch todos");
      } else {
        setError("An unknown error occurred");
      }
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      setFilteredTodos(TodoService.filterTodosByDate(todos, appDate));
    }
  }, [appDate, todos]);

  return { filteredTodos, error };
};

export default useFilteredTodos;
