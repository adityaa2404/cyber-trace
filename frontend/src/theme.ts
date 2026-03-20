import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00bcd4" },
    secondary: { main: "#ff5722" },
    background: { default: "#0a1929", paper: "#132f4c" },
    error: { main: "#f44336" },
    warning: { main: "#ff9800" },
    success: { main: "#4caf50" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },
});

export default theme;
