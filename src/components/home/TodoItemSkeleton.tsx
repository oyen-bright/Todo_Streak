import React from "react";
import { Skeleton, useTheme } from "@mui/material";

import { Card, CardContent } from "@mui/material";

const TodoItemSkeleton: React.FC = () => {
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
  return (
    <Card sx={useStyles.card} elevation={3}>
      <CardContent sx={useStyles.content}>
        <div>
          <Skeleton variant="text" width={200} />
          <Skeleton variant="text" width={150} />
          <Skeleton variant="text" width={150} />
        </div>
        <div>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItemSkeleton;
