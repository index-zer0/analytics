import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
    Box,
    Text,
    Heading,
    Image,
    Stack,
    Progress,
    HTMLChakraProps,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Layout, Map } from "../components";

interface StatisticsType {
    unique_visitors: number;
    page_views: number;
    bounce_rate: number;
    entry_pages: Record<string, number>;
    exit_pages: Record<string, number>;
    top_sources: Record<string, number>;
    top_pages: Record<string, number>;
    top_browsers: Record<string, number>;
    top_oss: Record<string, number>;
    top_countries: Record<string, number>;
    top_regions: Record<string, number>;
    top_cities: Record<string, number>;
    sizes: {
        desktop: number;
        laptop: number;
        tablet: number;
        mobile: number;
    };
}

const Analytics: NextPage = () => {
    const router = useRouter();
    const [statistics, setStatistics] = React.useState<StatisticsType | null>(
        null
    );
    const { webpage } = router.query;
    React.useEffect(() => {
        if (webpage !== undefined) {
            fetch(`http://localhost:8080/site/${webpage}`)
                .then((response) => response.json())
                .then((data) => setStatistics(data))
                .catch((err) => console.error(err));
        }
    }, [webpage]);

    if (statistics === null) {
        return null;
    }

    return (
        <Layout>
            <Box>
                <Box pt="1rem" />
                <Box w="100%" display={["block", "flex"]} maxH={200}>
                    <Card
                        title="Unique Visitors"
                        value={statistics?.unique_visitors}
                        width={["100%", "calc((100% - 2rem) / 3)"]}
                        background="url('/assets/blobanimation.svg')"
                    />
                    <Box w="1rem" h="1rem" />

                    <Card
                        title="Total Page Views"
                        value={statistics?.page_views}
                        width={["100%", "calc((100% - 2rem) / 3)"]}
                        background="url('/assets/blobanimation1.svg')"
                    />
                    <Box w="1rem" h="1rem" />

                    <Card
                        title="Bounce Rate"
                        value={(statistics?.bounce_rate * 100).toFixed(2) + "%"}
                        width={["100%", "calc((100% - 2rem) / 3)"]}
                        background="url('/assets/blobanimation2.svg')"
                    />
                </Box>
                <Box
                    w="100%"
                    display={["block", "flex"]}
                    maxH={400}
                    mt={["6rem", "2rem"]}
                >
                    <Table
                        title="Referrer"
                        width={["100%", "calc(50% - 0.5rem)"]}
                    >
                        <Barchart
                            left="Webpage"
                            right="Visitors"
                            data={statistics?.top_sources}
                            total={statistics?.unique_visitors}
                        />
                    </Table>
                    <Box w="1rem" h="1rem" />
                    <Table
                        title="Top pages"
                        width={["100%", "calc(50% - 0.5rem)"]}
                    >
                        <Barchart
                            left="Page"
                            right="Visitors"
                            data={statistics?.top_pages}
                            total={statistics?.page_views}
                        />
                    </Table>
                </Box>
                <Box w="100%" display={["block", "flex"]} maxH={400} mt="1rem">
                    <Table
                        title="Top Browser"
                        width={["100%", "calc(50% - 0.5rem)"]}
                    >
                        <Barchart
                            left="Browser"
                            right="Visitors"
                            data={statistics?.top_browsers}
                            total={statistics?.unique_visitors}
                        />
                    </Table>
                    <Box w="1rem" h="1rem" />
                    <Table
                        title="Top OS"
                        width={["100%", "calc(50% - 0.5rem)"]}
                    >
                        <Barchart
                            left="Operating system"
                            right="Visitors"
                            data={statistics?.top_oss}
                            total={statistics?.unique_visitors}
                        />
                    </Table>
                </Box>
                <Box w="100%" display={["block", "flex"]} maxH={400} mt="1rem">
                    <Table
                        title="Screen size"
                        width={["100%", "calc(50% - 0.5rem)"]}
                    >
                        <Barchart
                            left="Type"
                            right="Visitors"
                            data={statistics?.sizes}
                            total={statistics?.unique_visitors}
                        />
                    </Table>
                    <Box width="1rem" />
                </Box>

                <Box w="100%" display={["block", "flex"]} mt="1rem">
                    <Table
                        title="World Map"
                        width={["100%", "calc(50% - 0.5rem)"]}
                    >
                        <Map
                            data={statistics?.top_countries}
                            total={statistics?.unique_visitors}
                            width={700}
                            height={500}
                        />
                    </Table>
                </Box>
            </Box>
        </Layout>
    );
};

export default Analytics;

interface CardProps extends HTMLChakraProps<"div"> {
    title: string;
    value: number | string;
    background: string;
}

const Card = ({
    title,
    value,
    background,
    ...props
}: CardProps): JSX.Element => {
    return (
        <Box
            bg="white"
            borderRadius="1rem"
            p="1rem"
            d="flex"
            backgroundImage={background}
            backgroundPosition="130% 50%"
            backgroundRepeat="no-repeat"
            backgroundSize="50% 130%"
            {...props}
        >
            <Box>
                <Heading
                    fontWeight="semibold"
                    textTransform="uppercase"
                    color="darkgray"
                    size="md"
                >
                    {title}
                </Heading>
                <Heading
                    fontWeight="hairline"
                    textTransform="uppercase"
                    size="md"
                >
                    {value}
                </Heading>
            </Box>
        </Box>
    );
};

interface TableProps extends HTMLChakraProps<"div"> {
    title: string;
    children: JSX.Element[] | JSX.Element;
}

const Table = ({ title, children, ...props }: TableProps): JSX.Element => {
    return (
        <Box bg="white" borderRadius="1rem" p="1rem" {...props}>
            <Box display="flex">
                <Heading mr="auto" size="sm" fontWeight="semibold">
                    {title}
                </Heading>
            </Box>
            {children}
        </Box>
    );
};

const Barchart = ({
    left,
    right,
    data,
    total,
}: {
    left: string;
    right: string;
    data: Record<string, number>;
    total: number;
}): JSX.Element => {
    return (
        <Box mt="0.5rem">
            <Box display="flex">
                <Heading mr="auto" size="sm" fontWeight="normal">
                    {left}
                </Heading>
                <Heading ml="auto" size="sm" fontWeight="normal">
                    {right}
                </Heading>
            </Box>
            <Stack>
                {Object.entries(data)
                    .sort((a, b) => b[1] - a[1])
                    ?.map(([key, value]) => (
                        <Bar key={key} name={key} value={value} total={total} />
                    ))}
            </Stack>
        </Box>
    );
};

interface BarProps {
    name: string;
    value: number;
    total: number;
}

const Bar = ({ name, value, total }: BarProps): JSX.Element => {
    return (
        <Box width="100%" bg="aliceblue" rounded="0.5rem" position="relative">
            <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${(value * 100) / total}%` }}
                transition={{ duration: 2 }}
                style={{
                    backgroundColor: "#FFE70A",
                    height: "1.5rem",
                    borderRadius: "0.5rem",
                    position: "absolute",
                    zIndex: 2,
                }}
            />
            <Box display="flex" px="0.5rem" h="1.5rem" zIndex={3}>
                <Text mr="auto" zIndex={3}>
                    {name}
                </Text>
                <Text ml="auto" zIndex={3}>
                    {value}
                </Text>
            </Box>
        </Box>
    );
};
