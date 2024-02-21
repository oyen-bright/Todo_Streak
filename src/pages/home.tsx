import AddTodo from "../components/home/AddTodo";
import TodoList from "../components/home/TodoList";
import { FC } from "react";

import { Container } from "@mui/material";

const Home: FC = () => {
  return (
    <Container>
      <TodoList />
      <AddTodo />
    </Container>
  );
};

export default Home;
