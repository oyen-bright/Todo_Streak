import { Container, List } from "@mui/material";
import TodoItem from "./TodoItem";
import useFilteredTodos from "../../hooks/useFilteredTodos";

const TodoList: React.FC = () => {
  const { filteredTodos, error } = useFilteredTodos();

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
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </List>
    </Container>
  );
};

export default TodoList;
