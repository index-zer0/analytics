import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
    sm: "40em",
    md: "52em",
    lg: "64em",
    xl: "100em",
});

const theme = extendTheme({
    initialColorMode: "light",
    useSystemColorMode: false,
    colors: {
        black: "#090C02",
        blackAlpha: {
            50: "#f1f1f9",
            100: "#d4d4de",
            200: "#b7b7c6",
            300: "#9a9aae",
            400: "#7e7d97",
            500: "#64637f",
            600: "#4e4d63",
            700: "#373747",
            800: "#21212b",
            900: "#090C02",
        },
        brand: {
            50: "#d8feff",
            100: "#acf5ff",
            200: "#7dedff",
            300: "#4de6ff",
            400: "#27dffe",
            500: "#16c5e5",
            600: "#0099b3",
            700: "#006e81",
            800: "#00434f",
            900: "#00181e",
        },
    },
});

export default theme;
