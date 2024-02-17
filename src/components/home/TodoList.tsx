
import { FC,  } from "react";
import {
  
  Container,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";


interface TodoListProps {
    numberOfTasks: number;
  }


const TodoList: FC<TodoListProps> = ({ numberOfTasks }) => {
    return (
      <Container sx={{ height: "calc(100vh - 190px)", overflow: "auto" }}>
        <List>
          {Array.from({ length: numberOfTasks }, (_, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Task ${index + 1}`} />
            </ListItem>
          ))}
        </List>
      </Container>
    );
  };

  export default TodoList