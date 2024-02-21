import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface CustomAlertDialogProps {
  open: boolean;
  severity: "error" | "warning" | "info" | "success";
  message: string;
  onClose: () => void;
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  open,
  severity,
  message,
  onClose,
}) => {
  return (
    <React.Fragment>
      <Dialog
        sx={{ minWidth: "40%" }}
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default CustomAlertDialog;
