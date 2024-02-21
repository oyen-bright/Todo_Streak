import React from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  ListItemIcon,
  Divider,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import TodoService from "../services/TodoService";
import HabitService from "../services/HabitService";

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const handleResetDatabase = async () => {
    await Promise.all([TodoService.clearData(), HabitService.clearData()]);
    navigate("/");
  };

  return (
    <div>
      <Container sx={{ bgcolor: "background.paper" }}>
        <List>
          <Divider sx={{ marginY: "10px" }} />
          <ListItem disablePadding>
            <ListItemButton onClick={handleResetDatabase}>
              <ListItemIcon>
                <DeleteForeverIcon />
              </ListItemIcon>
              <ListItemText primary="Reset Database" />
            </ListItemButton>
          </ListItem>
          <Divider sx={{ marginY: "10px" }} />
        </List>
      </Container>
    </div>
  );
};

export default Settings;
