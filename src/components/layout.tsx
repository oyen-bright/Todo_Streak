import { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { MdSettings, MdArrowBack } from "react-icons/md";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
} from "@mui/material";

const Layout = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const containerStyles = {
    backgroundImage: "url(https://i.imgur.com/YgSfSQI.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minWidth: "100vW",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
  };

  const path: string = useLocation().pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  return (
    <Container sx={containerStyles}>
      <Container>
        <AppBar
          position="static"
          sx={{ width: "100%", paddingTop: "40px", paddingBottom: "20px" }}
        >
          <Toolbar>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                {path === "/settings" && (
                  <IconButton component={Link} to="/" color="inherit">
                    <MdArrowBack />
                  </IconButton>
                )}
                <Typography variant="h6" component="div">
                  {path === "/settings" ? "Settings" : "Todo Streak"}
                </Typography>
                {path !== "/settings" && (
                  <Typography variant="subtitle1" component="div">
                    {selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Typography>
                )}
              </Grid>
              <Grid item xs />
              {path !== "/settings" && (
                <Grid item>
                  <IconButton component={Link} to="/settings" color="inherit">
                    <MdSettings />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </Toolbar>
        </AppBar>
        <Outlet />
      </Container>
    </Container>
  );
};

export default Layout;
