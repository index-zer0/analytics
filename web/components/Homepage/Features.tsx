import { ReactElement } from "react";
import { Box, SimpleGrid, Icon, Text, Stack, Flex } from "@chakra-ui/react";

interface FeatureProps {
    title: string;
    text: string;
    icon: ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
    return (
        <Stack>
            <Flex
                w={16}
                h={16}
                align={"center"}
                justify={"center"}
                color={"white"}
                rounded={"full"}
                bg={"gray.100"}
                mb={1}
            >
                {icon}
            </Flex>
            <Text fontWeight={600}>{title}</Text>
            <Text color={"gray.600"}>{text}</Text>
        </Stack>
    );
};

const Features = ({ features }: { features: FeatureProps[] }) => {
    return (
        <Box p={4}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                {features.map((feature, index) => {
                    return (
                        <Feature
                            key={index}
                            icon={
                                <Icon as={feature.icon as any} w={10} h={10} />
                            }
                            title={feature.title}
                            text={feature.text}
                        />
                    );
                })}
            </SimpleGrid>
        </Box>
    );
};

export default Features;
