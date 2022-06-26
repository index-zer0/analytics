import React from "react";
import {
    Box,
    Heading,
    HTMLChakraProps,
    Tabs,
    Tab,
    TabList,
} from "@chakra-ui/react";

interface TableProps extends HTMLChakraProps<"div"> {
    title: string;
    tabs?: string[];
    children: JSX.Element[] | JSX.Element;
}

const Table = ({
    title,
    tabs = [],
    children,
    ...props
}: TableProps): JSX.Element => {
    let tablist: JSX.Element = <></>;
    if (tabs.length > 0) {
        tablist = (
            <TabList>
                {tabs.map((tab: string, index: number) => (
                    <Tab key={index} py="0">
                        {tab}
                    </Tab>
                ))}
            </TabList>
        );
    }
    return (
        <Box
            bg="white"
            border="1px solid #f2f0f0"
            borderRadius="1rem"
            p="1rem"
            {...props}
        >
            <Tabs isLazy={true} variant="soft-rounded" colorScheme="brand">
                <Box display="flex" alignItems="center">
                    <Heading mr="auto" size="sm" fontWeight="semibold">
                        {title}
                    </Heading>
                    {tablist}
                </Box>
                {children}
            </Tabs>
        </Box>
    );
};

export default Table;
