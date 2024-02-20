import React from "react";
import { useNavigate } from "react-router-dom";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
} from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useFirestore } from "../services/firebase/useFirestore";

const Settings: React.FC = () => {
  const { resetDatabase } = useFirestore();
  const navigate = useNavigate();

  const handleResetDatabase = async () => {
    await resetDatabase();
    navigate("/");
  };

  return (
    <Container sx={{ bgcolor: "background.paper" }}>
      <List>
        <Divider sx={{ marginY: "10px" }} />
        <ListItem disablePadding>
          <ListItemButton onClick={handleResetDatabase}>
            <ListItemIcon>
              <DeleteForeverIcon />
            </ListItemIcon>
            <ListItemText primary="ResetDataBase" />
          </ListItemButton>
        </ListItem>
        <Divider sx={{ marginY: "10px" }} />
      </List>
    </Container>
  );
};

export default Settings;
