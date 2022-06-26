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
            50: "#fffeda",
            100: "#fff9ad",
            200: "#fff57d",
            300: "#fff14b",
            400: "#ffed1a",
            500: "#FFE70A",
            600: "#F5e000",
            700: "#E0CE00",
            800: "#877B00",
            900: "#1c1700",
        },
    },
});

export default theme;
