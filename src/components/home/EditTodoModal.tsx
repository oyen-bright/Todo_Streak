import { useTheme } from "@mui/material";
import { Todo, TodoType } from "../../types/Todo";
import { convertDayToNumber, convertNumberToDay } from "../../utils/dateUtils";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  Chip,
  CircularProgress,
  TextField,
  Box,
} from "@mui/material";
import CustomAlertDialog from "../alert";
import { useFirestore } from "../../services/firebase/useFirestore";
import { useDate } from "../../contexts/DateContext";

interface EditTodoModalProps {
  open: boolean;
  handleClose: () => void;
  todo: Todo;
}

const EditTodoModal: React.FC<EditTodoModalProps> = ({
  open,
  handleClose,
  todo,
}) => {
  const theme = useTheme();
  const { updateTodo } = useFirestore();
  const { appDate } = useDate();
  const [selectedDays, setSelectedDays] = useState<string[]>(
    (todo.days ?? []).map((e) => convertNumberToDay(e))
  );

  const [todoTitle, setTodoTitle] = useState<string>(todo.title);
  const [frequency, setFrequency] = useState<number | null>(todo.frequency);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<{
    showDialog: boolean;
    message: string;
  }>({
    showDialog: false,
    message: "",
  });
  const [formError, setError] = useState<{
    todoTitleError: string | null;
  }>({
    todoTitleError: null,
  });

  const availableDays: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const onModalClose = (_: object, reason: string) => {
    if (reason === "backdropClick" && loading) return;
    handleClose();
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleFrequencyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(event.target.value);
    setFrequency(value);
  };
  const handleDaySelection = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setError({ todoTitleError: null });

    event.preventDefault();

    if (!(todoTitle as string).trim()) {
      setError({
        todoTitleError: "Todo cannot be empty",
      });
      return;
    }

    const updatedTodo: Todo = {
      ...todo,
      title: todoTitle as string,
      frequency: frequency,
      days: selectedDays.map((e: string) => convertDayToNumber(e)),
      updatedDate: appDate.toISOString(),
    };

    try {
      setLoading(true);

      await updateTodo(updatedTodo);
      setLoading(false);
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        setLoading(false);
        setAlertMessage({
          showDialog: true,
          message: error.message,
        });
      } else {
        setLoading(false);
      }
    }

    setLoading(false);
  };

  return (
    <Box component="div">
      <Dialog
        open={open}
        onClose={onModalClose}
        disableEscapeKeyDown={true}
        PaperProps={{
          component: "form",
          onSubmit: onFormSubmit,
        }}
      >
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please specify the details for your todo:
          </DialogContentText>
          {loading && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          )}
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="Todo"
            label="Todo"
            type="text"
            onChange={handleTitleChange}
            value={todoTitle}
            fullWidth
            error={!!formError.todoTitleError}
            helperText={formError.todoTitleError}
            variant="standard"
          />
          {todo.type === TodoType.weekly && (
            <TextField
              margin="dense"
              id="frequency"
              name="frequency"
              label="Frequency (times per week)"
              type="number"
              fullWidth
              variant="standard"
              value={frequency}
              inputProps={{ min: 1, max: 7 }}
              onChange={handleFrequencyChange}
            />
          )}
          {todo.type === TodoType.daily && (
            <FormControl component="fieldset" margin="dense">
              <FormLabel component="legend">Days</FormLabel>
              <div>
                {availableDays.map((day) => (
                  <Chip
                    key={day}
                    label={day}
                    variant={selectedDays.includes(day) ? "filled" : "outlined"}
                    color={selectedDays.includes(day) ? "primary" : "default"}
                    onClick={() => handleDaySelection(day)}
                    style={{ margin: "4px" }}
                  />
                ))}
              </div>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: theme.palette.primary.main }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {alertMessage.showDialog && (
        <CustomAlertDialog
          open={alertMessage.showDialog}
          message={alertMessage.message}
          severity="error"
          onClose={() =>
            setAlertMessage({
              ...alertMessage,
              showDialog: false,
            })
          }
        />
      )}
    </Box>
  );
};

export default EditTodoModal;
