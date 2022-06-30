import { ReactNode } from "react";
import {
    Box,
    Stack,
    HStack,
    Heading,
    Text,
    VStack,
    useColorModeValue,
    List,
    ListItem,
    ListIcon,
    Button,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";

function PriceWrapper({ children }: { children: ReactNode }) {
    return (
        <Box
            mb={4}
            shadow="base"
            borderWidth="1px"
            alignSelf={{ base: "center", lg: "flex-start" }}
            borderColor={useColorModeValue("gray.200", "gray.500")}
            borderRadius={"xl"}
        >
            {children}
        </Box>
    );
}

const Pricing = () => {
    return (
        <Box py={12}>
            <VStack spacing={2} textAlign="center">
                <Heading as="h1" fontSize="4xl">
                    Plans that fit your need
                </Heading>
                <Text fontSize="lg" color={"gray.500"}>
                    Start with 14-day free trial. Cancel at anytime.
                </Text>
            </VStack>
            <Stack
                direction={{ base: "column", md: "row" }}
                textAlign="center"
                justify="center"
                spacing={{ base: 4, lg: 10 }}
                py={10}
            >
                <PriceWrapper>
                    <Box py={4} px={12}>
                        <Text fontWeight="500" fontSize="2xl">
                            Start
                        </Text>
                        <HStack justifyContent="center">
                            <Text fontSize="3xl" fontWeight="600">
                                €
                            </Text>
                            <Text fontSize="5xl" fontWeight="900">
                                5.99
                            </Text>
                            <Text fontSize="3xl" color="gray.500">
                                /month
                            </Text>
                        </HStack>
                    </Box>
                    <VStack
                        bg={useColorModeValue("gray.50", "gray.700")}
                        py={4}
                        borderBottomRadius={"xl"}
                    >
                        <List spacing={3} textAlign="start" px={12}>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                1 Website
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                Unlimited Pageviews
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                5 Conversion Goals
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                Monthly Email recap
                            </ListItem>
                        </List>
                        <Box w="80%" pt={7}>
                            <Button
                                w="full"
                                colorScheme="brand"
                                variant="outline"
                            >
                                Start trial
                            </Button>
                        </Box>
                    </VStack>
                </PriceWrapper>

                <PriceWrapper>
                    <Box position="relative">
                        <Box
                            position="absolute"
                            top="-16px"
                            left="50%"
                            style={{ transform: "translate(-50%)" }}
                        >
                            <Text
                                textTransform="uppercase"
                                bg={useColorModeValue("brand.300", "brand.700")}
                                px={3}
                                py={1}
                                color={useColorModeValue(
                                    "gray.900",
                                    "gray.300"
                                )}
                                fontSize="sm"
                                fontWeight="600"
                                rounded="xl"
                            >
                                Most Popular
                            </Text>
                        </Box>
                        <Box py={4} px={12}>
                            <Text fontWeight="500" fontSize="2xl">
                                Grow
                            </Text>
                            <HStack justifyContent="center">
                                <Text fontSize="3xl" fontWeight="600">
                                    €
                                </Text>
                                <Text fontSize="5xl" fontWeight="900">
                                    9.99
                                </Text>
                                <Text fontSize="3xl" color="gray.500">
                                    /month
                                </Text>
                            </HStack>
                        </Box>
                        <VStack
                            bg={useColorModeValue("gray.50", "gray.700")}
                            py={4}
                            borderBottomRadius={"xl"}
                        >
                            <List spacing={3} textAlign="start" px={12}>
                                <ListItem>
                                    <ListIcon
                                        as={FaCheckCircle}
                                        color="green.500"
                                    />
                                    3 Websites
                                </ListItem>
                                <ListItem>
                                    <ListIcon
                                        as={FaCheckCircle}
                                        color="green.500"
                                    />
                                    Unlimited Pageviews
                                </ListItem>
                                <ListItem>
                                    <ListIcon
                                        as={FaCheckCircle}
                                        color="green.500"
                                    />
                                    10 Conversion Goals
                                </ListItem>
                                <ListItem>
                                    <ListIcon
                                        as={FaCheckCircle}
                                        color="green.500"
                                    />
                                    Monthly Email recap
                                </ListItem>
                            </List>
                            <Box w="80%" pt={7}>
                                <Button w="full" colorScheme="brand">
                                    Start trial
                                </Button>
                            </Box>
                        </VStack>
                    </Box>
                </PriceWrapper>
                <PriceWrapper>
                    <Box py={4} px={12}>
                        <Text fontWeight="500" fontSize="2xl">
                            Scale
                        </Text>
                        <HStack justifyContent="center">
                            <Text fontSize="3xl" fontWeight="600">
                                €
                            </Text>
                            <Text fontSize="5xl" fontWeight="900">
                                19.99
                            </Text>
                            <Text fontSize="3xl" color="gray.500">
                                /month
                            </Text>
                        </HStack>
                    </Box>
                    <VStack
                        bg={useColorModeValue("gray.50", "gray.700")}
                        py={4}
                        borderBottomRadius={"xl"}
                    >
                        <List spacing={3} textAlign="start" px={12}>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                Unlimited Websites
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                Unlimited Pageviews
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                Unlimited Conversion Goals
                            </ListItem>
                            <ListItem>
                                <ListIcon
                                    as={FaCheckCircle}
                                    color="green.500"
                                />
                                Scheduled Email recaps
                            </ListItem>
                        </List>
                        <Box w="80%" pt={7}>
                            <Button
                                w="full"
                                colorScheme="brand"
                                variant="outline"
                            >
                                Start trial
                            </Button>
                        </Box>
                    </VStack>
                </PriceWrapper>
            </Stack>
        </Box>
    );
};

export default Pricing;
