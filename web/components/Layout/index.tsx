import React from "react";
import { Box } from "@chakra-ui/react";
import Wrapper, { WrapperProps } from "./Wrapper";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Login from "./Login";
// import UserContext from "./UserProvider";

interface LayoutProps extends WrapperProps {
    children: React.ReactNode;
    variant?: "small" | "full" | "default";
}

const Layout: React.FC<LayoutProps> = ({
    children,
    variant = "default",
}: LayoutProps) => {
    return (
        // <UserContext>
        <Box minH="100vh" bg="#f2f0f090">
            <Box minH="80vh">
                <NavBar />
                <Login />
                <Wrapper variant={variant}>{children}</Wrapper>
            </Box>

            <Box position="relative" bottom={["4rem", 0]} left={0} width="100%">
                <Footer />
            </Box>
        </Box>
        // </UserContext>
    );
};

export default Layout;
