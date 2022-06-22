import React from "react";
import { Box } from "@chakra-ui/react";

export interface WrapperProps {
    children: React.ReactNode;
    variant?: "small" | "full" | "default";
}

const Wrapper: React.FC<WrapperProps> = ({
    children,
    variant = "default",
}: WrapperProps) => {
    const width =
        variant === "default" ? "1080px" : variant === "full" ? "" : "800px";
    const top = variant === "full" ? 0 : 8;
    return (
        <>
            <Box
                mt={top}
                mb="5rem"
                mx="auto"
                maxW={width}
                w={variant === "full" ? "100%" : "95%"}
            >
                {children}
            </Box>
        </>
    );
};

export default Wrapper;
