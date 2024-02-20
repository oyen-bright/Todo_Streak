import { useTheme } from "@mui/material";
import { Todo, TodoType } from "../../types/Todo";
import { convertDayToNumber } from "../../utils/dateUtils";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Chip,
  Radio,
  Typography,
  CircularProgress,
  RadioGroup,
  TextField,
  Box,
} from "@mui/material";
import { useFirestore } from "../../services/firebase/useFirestore";
import CustomAlertDialog from "../alert";
import { useDate } from "../../contexts/DateContext";

interface AddTodoModelProps {
  open: boolean;
  handleClose: () => void;
  title: string;
}

const AddTodoModel: React.FC<AddTodoModelProps> = ({
  open,
  handleClose,
  title,
}) => {
  const theme = useTheme();
  const { addTodo } = useFirestore();
  const { appDate } = useDate();

  const [trackingType, setTrackingType] = useState<TodoType>(TodoType.daily);
  const [todoTitle, setTodoTile] = useState<string>(title);
  const [frequency, setFrequency] = useState<number>(1);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<{
    showDialog: boolean;
    message: string;
  }>({
    showDialog: false,
    message: "",
  });
  const [formError, setError] = useState<{
    frequencyError: string | null;
    todoTitleError: string | null;
  }>({
    frequencyError: null,
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

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingType(event.target.value as TodoType);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTile(event.target.value);
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
    setError({ frequencyError: null, todoTitleError: null });

    event.preventDefault();

    if (trackingType === TodoType.daily && selectedDays.length === 0) {
      setError({
        ...formError,
        frequencyError:
          "Please select at least one day to track your daily habit.",
      });
      return;
    }

    if (!(todoTitle as string).trim()) {
      setError({
        ...formError,
        todoTitleError: "Todo Cannot be empty",
      });
      return;
    }
    const newTodo: Todo = {
      id: "",
      createdDate: appDate.toISOString(),
      updatedDate: appDate.toISOString(),
      title: todoTitle as string,

      type: trackingType,
      frequency: trackingType === TodoType.weekly ? frequency : null,
      days:
        trackingType === TodoType.daily
          ? selectedDays.map((e: string) => convertDayToNumber(e))
          : null,

      tracking: null,
    };

    try {
      setLoading(true);
      await addTodo(newTodo);
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
        <DialogTitle>Add Todo</DialogTitle>
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
          <FormControl component="fieldset" margin="dense">
            <FormLabel component="legend">Tracking Type</FormLabel>
            <RadioGroup
              aria-label="tracking-type"
              name="trackingType"
              value={trackingType}
              onChange={handleTypeChange}
            >
              <FormControlLabel
                value={TodoType.daily}
                control={<Radio />}
                label={
                  TodoType.daily.charAt(0).toUpperCase() +
                  TodoType.daily.slice(1)
                }
              />
              <FormControlLabel
                value={TodoType.weekly}
                control={<Radio />}
                label={
                  TodoType.weekly.charAt(0).toUpperCase() +
                  TodoType.weekly.slice(1)
                }
              />
            </RadioGroup>
          </FormControl>

          {trackingType === TodoType.weekly && (
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
          {trackingType === TodoType.daily && (
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
                {formError.frequencyError && (
                  <Typography color="error">
                    {formError.frequencyError}
                  </Typography>
                )}
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
            Continue
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

export default AddTodoModel;
