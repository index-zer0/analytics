import "@fontsource/sriracha";

import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../components";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider theme={theme} resetCSS>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}

export default MyApp;
