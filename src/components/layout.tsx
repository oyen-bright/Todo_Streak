import { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDate } from "../contexts/DateContext";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
  const { appDate: currentDate, setAppDate: setCurrentDate } = useDate();
  const [selectedDate, selectedDateState] = useState<Date>(currentDate);
  const path: string = useLocation().pathname;

  const handleDateChange = (date: Date | null) => {
    if (date !== null) {
      selectedDateState(date);
      setCurrentDate(date);
    }
  };
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
                    {currentDate?.toLocaleDateString("en-US", {
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
                  <div className="date-picker-wrapper">
                    <DatePicker
                      value={dayjs(selectedDate)}
                      onChange={(newValue) =>
                        handleDateChange(newValue?.toDate() ?? null)
                      }
                    />
                  </div>
                </Grid>
              )}

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

const containerStyles = {
  backgroundImage: "url(https://i.imgur.com/YgSfSQI.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  paddingBottom: "10px",
  minWidth: "100vW",
  backgroundAttachment: "fixed",
  minHeight: "100vh",
};

export default Layout;
