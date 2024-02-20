import  { useState } from "react";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DateContext from "./contexts/DateContext";


function App() {
  const [appDate, setAppDate] = useState(new Date());

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateContext.Provider value={{ appDate: appDate, setAppDate: setAppDate }}>
          <RouterProvider router={AppRouter} />
        </DateContext.Provider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
