import { FC, useState } from "react";
import {
  Button,

  Card,
  TextField,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const AddTodo: FC = () => {
    const [task, setTask] = useState<string>("");
    const theme = useTheme();
    function handleAddTask() {
      // Add logic to handle adding a new task
    }
  
    return (
      <Card
      
      elevation={10}
        sx={{
          margin:"0",
          display: "flex",
          alignItems: "center",
          padding: "2px 10px",
          backgroundColor: theme.palette.primary.main,

          color: "#fff",
        }}
      >
        <AddIcon />
        <TextField
          placeholder="Add a new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask();
            }
          }}
          fullWidth
          InputProps={{
            disableUnderline: true,
            style: { color: "white", fontSize: "20px", padding: "5px" },
            placeholder: "Add a new task",
          }}
        />
        {task.length >= 3 && (
          <Button
            onClick={handleAddTask}
            variant="text"
            style={{ color: "white", fontSize: "17px" }}
          >
            ADD
          </Button>
        )}
      </Card>
    );
  };

  export default AddTodo;