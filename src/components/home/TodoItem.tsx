import React, { useState } from "react";
import { useTheme } from "@mui/material";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CustomAlertDialog from "../alert";
import { Todo, TodoType } from "../../types/Todo";
import { MdSettings } from "react-icons/md";
import { useDate } from "../../contexts/DateContext";
import { convertDate, convertNumberToDay } from "../../utils/dateUtils";
import EditTodoModal from "./EditTodoModal";
import { DateTime } from "../../types/DateTimes";
import HabitService from "../../services/HabitService";

type TodoItemProps = {
  todo: Todo;
};

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const theme = useTheme();
  const useStyles = {
    card: {
      marginBottom: theme.spacing(2),
      borderRadius: theme.spacing(1),
      borderLeft: `5px solid ${theme.palette.primary.main}`,
    },
    content: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontWeight: "bold",

      marginBottom: theme.spacing(1),
    },
  };
  const { appDate } = useDate();
  const [loading, setLoading] = useState<boolean>(false);
  const [openEditTodoModal, setOpenEditTodoModal] = useState(false);
  const [error, setError] = useState<{
    showDialog: boolean;
    message: string;
  }>({
    showDialog: false,
    message: "",
  });
  const currentDay: number = appDate.getDay();
  const isCompleted: DateTime | null = HabitService.getCompletedDateTime(
    todo,
    appDate
  );
  const dayLabel: string[] = todo.days?.map((e) => convertNumberToDay(e)) ?? [];
  const { currentStreak, longestStreak } =
    todo.type === TodoType.daily
      ? HabitService.getDailyStreak(todo, currentDay)
      : HabitService.getWeeklyStreak(todo);
  const { completed, frequency } = HabitService.getWeekStreak(todo, appDate);

  const handleEditModalClose = () => {
    setOpenEditTodoModal(false);
  };

  const onCheck = async (todo: Todo) => {
    try {
      setLoading(true);
      await HabitService.updateHabit(todo, appDate);
    } catch (error) {
      if (error instanceof Error) {
        setError({
          showDialog: true,
          message: error.message || "Failed to update todo",
        });
      } else {
        setError({ showDialog: true, message: "An unknown error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };

  const onEdit = () => {
    setOpenEditTodoModal(true);
  };

  return (
    <Box component="div">
      <Card sx={useStyles.card} elevation={3}>
        <CardContent sx={useStyles.content}>
          <div>
            <Box
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Typography variant="h5" sx={useStyles.title}>
                📋 {todo.title.toUpperCase()}
              </Typography>
              <Typography variant="body1" component="div">
                {convertDate(new Date(todo.createdDate)).date}
              </Typography>
            </Box>
            {todo.type === TodoType.daily ? (
              <Box
                component="div"
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1">🔄 Every:</Typography>
                {dayLabel.map((label, index) => (
                  <Chip key={index} label={label} />
                ))}
              </Box>
            ) : (
              <Typography variant="body1">🔄 Repetition: Weekly</Typography>
            )}

            <Typography variant="body1">
              🔥 Current Streak: {currentStreak}
            </Typography>
            <Typography variant="body1">
              🏆 Longest Streak: {longestStreak}
            </Typography>
            {todo.type == TodoType.weekly && frequency !== 0 && (
              <Typography variant="body1">
                ☑️ Week Streak: {completed} / {frequency}
              </Typography>
            )}
          </div>

          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCompleted !== null}
                  disabled={isCompleted !== null}
                  onChange={() => onCheck(todo)}
                />
              }
              label={
                loading
                  ? "...."
                  : isCompleted
                  ? `Completed ${isCompleted.time}`
                  : "Mark as Completed"
              }
              labelPlacement="start"
              sx={{ "& .MuiSvgIcon-root": { fontSize: 33 } }}
            />

            <IconButton onClick={() => onEdit()}>
              <MdSettings />
            </IconButton>
          </div>
        </CardContent>
      </Card>

      {error.showDialog && (
        <CustomAlertDialog
          open={error.showDialog}
          message={error.message}
          severity="error"
          onClose={() =>
            setError({
              ...error,
              showDialog: false,
            })
          }
        />
      )}
      {openEditTodoModal && (
        <EditTodoModal
          open={openEditTodoModal}
          todo={todo}
          handleClose={handleEditModalClose}
        />
      )}
    </Box>
  );
};

export default TodoItem;
