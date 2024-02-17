import AddTodo from "../components/home/AddTodo";
import TodoList from "../components/home/TodoList";
import { FC,  } from "react";

import {
  Container,

} from "@mui/material";


const Home: FC = () => {
  const numberOfTasks = 20; 

  return (
    <Container>
      <TodoList numberOfTasks={numberOfTasks} />
      <AddTodo />
    </Container>
  );
};

export default Home;
