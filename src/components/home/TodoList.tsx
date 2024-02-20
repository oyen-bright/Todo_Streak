import React, { useEffect, useState } from "react";
import { Container, List } from "@mui/material";
import TodoItem from "./TodoItem";
import { Todo, TodoType } from "../../types/Todo";
import { useFirestore } from "../../services/firebase/useFirestore";
import { useDate } from "../../contexts/DateContext";

const filterTodosByDate = (todos: Todo[], appDate: Date): Todo[] => {
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
      //TODO:on Date change recalculate the steak;
      return todo;
    });
};

const TodoList: React.FC = () => {
  const { getTodos } = useFirestore();
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const { appDate } = useDate();

  useEffect(() => {
    try {
      const unsubscribe = getTodos((todosFromFirestore: Todo[]) => {
        setTodos(todosFromFirestore);
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
      setFilteredTodos(filterTodosByDate(todos, appDate));
    }
  }, [appDate]);

  useEffect(() => {
    if (todos.length > 0) {
      setFilteredTodos(filterTodosByDate(todos, appDate));
    }
  }, [todos]);

  return (
    <Container
      sx={{
        height: "calc(100vh - 220px)",
        overflow: "auto",
        paddingTop: "10px",
      }}
    >
      <List>
        {error && <p>Error: {error}</p>}
        {filteredTodos.length === 0 && <p>No DATA</p>}
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </List>
    </Container>
  );
};

export default TodoList;
