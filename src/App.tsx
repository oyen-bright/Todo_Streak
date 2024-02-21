import { RouterProvider } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateProvider } from "./contexts/DateContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateProvider>
          <RouterProvider router={AppRouter} />
        </DateProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
