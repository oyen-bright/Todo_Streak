import { useTheme } from "@mui/material";

import React, { ReactEventHandler, useState } from "react";
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
} from "@mui/material";
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

  const [trackingType, setTrackingType] = useState<string>("daily");
  const [todoTitle, setTodoTile] = useState<string>(title);
  const [frequency, setFrequency] = useState<number>(1);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<{
    frequencyError: string | null;
    todoTitleError: string | null;
  }>({
    frequencyError: null,
    todoTitleError: null,
  });

  const onModalClose = (_: object, reason: string) => {
    if (reason === "backdropClick" && loading) return;
    handleClose();
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrackingType(event.target.value);
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

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onModalClose}
        disableEscapeKeyDown={true}
        PaperProps={{
          component: "form",

          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            setError({ frequencyError: null, todoTitleError: null });
            setLoading(true);
            event.preventDefault();
            //TODO:prpoper validation
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const todo = formJson.Todo;
            console.log(todo as string);

            if (
              trackingType === "weekly" &&
              selectedDays.length !== frequency
            ) {
              setError({
                ...error,
                frequencyError:
                  "Please select the correct number of days according to the frequency.",
              });
              return;
            }

            if (!(todo as string).trim()) {
              setError({
                ...error,
                todoTitleError: "Todo Cannot be empty",
              });
              return;
            }

            setTimeout(() => {
              setLoading(false);
              handleClose();
            }, 1000); //
          },
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
            error={!!error.todoTitleError}
            helperText={error.todoTitleError}
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
                value="daily"
                control={<Radio />}
                label="Daily"
              />
              <FormControlLabel
                value="weekly"
                control={<Radio />}
                label="Weekly"
              />
            </RadioGroup>
          </FormControl>

          {trackingType === "weekly" && (
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
          {trackingType === "weekly" && (
            <FormControl component="fieldset" margin="dense">
              <FormLabel component="legend">Days</FormLabel>
              <div>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <Chip
                    key={day}
                    label={day}
                    variant={selectedDays.includes(day) ? "filled" : "outlined"}
                    color={selectedDays.includes(day) ? "primary" : "default"}
                    onClick={() => handleDaySelection(day)}
                    style={{ margin: "4px" }}
                  />
                ))}
                {error.frequencyError && (
                  <Typography color="error">{error.frequencyError}</Typography>
                )}
              </div>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AddTodoModel;
