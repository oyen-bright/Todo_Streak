import { FC, useState } from "react";
import { Box, Button, Card, TextField, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddTodoModal from "./AddTodoModal";

const AddTodo: FC = () => {
  const [todoTitle, setTodoTitle] = useState<string>("");
  const theme = useTheme();
  const [openAddTodoModal, setOpenAddTodoModal] = useState(false);

  const handleClose = () => {
    setTodoTitle("");
    setOpenAddTodoModal(false);
  };
  const onInputFieldKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };
  const onInputFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTodoTitle(e.target.value);
  };
  function handleAddTask() {
    setOpenAddTodoModal(true);
  }

  return (
    <Box component="div">
      <Card
        elevation={10}
        sx={{
          margin: "0",

          display: "flex",
          alignItems: "center",
          padding: "2px 10px",
          backgroundColor: theme.palette.primary.main,
          color: "#fff",
        }}
      >
        <AddIcon />
        <TextField
          value={todoTitle}
          onChange={onInputFieldChange}
          onKeyDown={onInputFieldKeyDown}
          fullWidth
          InputProps={{
            style: { color: "white", fontSize: "20px", padding: "5px" },
            placeholder: "Add a new task",
          }}
        />
        {todoTitle.length >= 3 && (
          <Button
            onClick={handleAddTask}
            variant="text"
            style={{ color: "white", fontSize: "17px" }}
          >
            ADD
          </Button>
        )}
      </Card>
      {openAddTodoModal && (
        <AddTodoModal
          open={openAddTodoModal}
          title={todoTitle}
          handleClose={handleClose}
        />
      )}
    </Box>
  );
};

export default AddTodo;
