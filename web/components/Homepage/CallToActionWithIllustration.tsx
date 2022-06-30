import React from "react";
import {
    Flex,
    Container,
    Heading,
    Stack,
    Text,
    Button,
    Link,
    Image,
} from "@chakra-ui/react";

const CallToActionWithIllustration = () => {
    return (
        <Container maxW={"5xl"}>
            <Stack
                textAlign={"center"}
                align={"center"}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 20, md: 28 }}
            >
                <Heading
                    fontWeight={600}
                    fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
                    lineHeight={"110%"}
                >
                    Grow your website and your business{" "}
                    <Text as={"span"} color={"brand.500"}>
                        with ____
                    </Text>
                </Heading>
                <Text color={"gray.500"} maxW={"3xl"}>
                    A lightweight, fast, easy-to-use web analytics tool that
                    doesn{"'"}t track personal data. GDPR, CCPA and PECR
                    compliant.
                </Text>
                <Stack spacing={6} direction={"row"}>
                    <Button
                        rounded={"full"}
                        px={6}
                        colorScheme={"brand"}
                        bg={"brand.500"}
                        _hover={{ bg: "brand.400" }}
                    >
                        Get started
                    </Button>
                    <Button
                        rounded={"full"}
                        px={6}
                        as={Link}
                        href="/homepage.com"
                    >
                        View demo
                    </Button>
                </Stack>
                <Flex w={"full"}>
                    <Image
                        mx="auto"
                        height={{ sm: "24rem", lg: "40rem" }}
                        mt={{ base: 12, sm: 16 }}
                        src="/assets/Connection_Lost_-_Dark_.png"
                        alt="https://www.charco.design/poke"
                    />
                </Flex>
            </Stack>
        </Container>
    );
};
export default CallToActionWithIllustration;
