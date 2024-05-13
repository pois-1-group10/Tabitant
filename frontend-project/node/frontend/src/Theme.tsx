import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            light: "#ffc786",
            main: "#FF981F",
            dark: "#ca7617",
            contrastText: "#FFF2C1",
        },
        secondary: {
            light: "#cccccc",
            main: "#8e8e8e",
            dark: "#606060",
        },
        background: {
            paper: "#fffaf5",
        },
        text: {
            primary: "white",
        }
    }
});

export default theme;
