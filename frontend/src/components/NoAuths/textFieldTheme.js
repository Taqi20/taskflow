import { createTheme } from "@mui/material/styles";

const textFieldTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffffff',
        },
        secondary: {
            main: '#f50057',
        },
        text: {
            primary: '#ffffff',
        },
        background: {
            default: '#1c1a1a',
        },
    },
});

export default textFieldTheme;