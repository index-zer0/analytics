import React from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
    Box,
    Text,
    Heading,
    Image,
    Stack,
    HTMLChakraProps,
    TabPanels,
    TabPanel,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Layout, Map, Table } from "../components";
import { isoToName } from "../utils";

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
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}/site/${webpage}`)
                .then((response) => response.json())
                .then((data) => setStatistics(data))
                .catch((err) => console.error(err));
        }
    }, [webpage]);

    if (statistics === null) {
        return null;
    }
    const top_countries: Record<string, number> = {};
    Object.keys(statistics?.top_countries).forEach(
        (key) =>
            (top_countries[isoToName(key)] = statistics?.top_countries[key])
    );

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
                    maxH={450}
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
                            transformer={(text: string) => (
                                <Box display="flex" alignItems="center">
                                    <Image
                                        src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${text}&size=16`}
                                        alt="favicon"
                                        w="16px"
                                        h="16px"
                                        mr="0.5rem"
                                    />
                                    <Text>{text}</Text>
                                </Box>
                            )}
                        />
                    </Table>

                    <Box w="1rem" h="1rem" />
                    <Table
                        title="World Map"
                        width={["100%", "calc(50% - 0.5rem)"]}
                        tabs={["Map", "Countries", "Cities"]}
                        height={450}
                    >
                        <TabPanels>
                            <TabPanel>
                                <Map
                                    data={statistics?.top_countries}
                                    total={
                                        statistics?.unique_visitors -
                                        statistics?.top_countries["none"]
                                    }
                                    width={700}
                                    height={450}
                                />
                            </TabPanel>
                            <TabPanel>
                                <Barchart
                                    left="Country"
                                    right="Visitors"
                                    data={top_countries}
                                    total={statistics?.unique_visitors}
                                />
                            </TabPanel>
                            <TabPanel>
                                <Barchart
                                    left="City"
                                    right="Visitors"
                                    data={statistics?.top_cities}
                                    total={statistics?.unique_visitors}
                                />
                            </TabPanel>
                        </TabPanels>
                    </Table>
                </Box>
                <Box w="100%" display={["block", "flex"]} mt="1rem">
                    <Table title="Top pages" width="100%">
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
                        width={["100%", "calc(33% - 0.5rem)"]}
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
                        width={["100%", "calc(33% - 0.5rem)"]}
                    >
                        <Barchart
                            left="Operating system"
                            right="Visitors"
                            data={statistics?.top_oss}
                            total={statistics?.unique_visitors}
                        />
                    </Table>
                    <Box w="1rem" h="1rem" />
                    <Table
                        title="Screen size"
                        width={["100%", "calc(33% - 0.5rem)"]}
                    >
                        <Barchart
                            left="Type"
                            right="Visitors"
                            data={statistics?.sizes}
                            total={statistics?.unique_visitors}
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
            border="1px solid #f2f0f0"
            backgroundImage={background}
            backgroundPosition="-40% 50%"
            backgroundRepeat="no-repeat"
            backgroundSize="60% 200%"
            {...props}
        >
            <Box>
                <Heading
                    fontWeight="semibold"
                    textTransform="uppercase"
                    // color="darkgray"
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

const Barchart = ({
    left,
    right,
    data,
    total,
    transformer = (s) => <>{s}</>,
}: {
    left: string;
    right: string;
    data: Record<string, number>;
    total: number;
    transformer?: (arg0: string) => JSX.Element;
}): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const visible = 5;
    const content = (limit: number) => (
        <>
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
                    .slice(0, limit)
                    ?.map(([key, value]) => (
                        <Bar
                            key={key}
                            name={key}
                            value={value}
                            total={total}
                            transformer={transformer}
                        />
                    ))}
            </Stack>
        </>
    );
    return (
        <>
            <Box mt="0.5rem">
                {content(visible)}
                {Object.entries(data).length > visible && (
                    <Box w="100%" display="flex">
                        <Button
                            mt="1rem"
                            variant="link"
                            mx="auto"
                            onClick={onOpen}
                        >
                            <Heading size="sm" color="gray">
                                Show more
                            </Heading>
                        </Button>
                    </Box>
                )}
            </Box>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay
                    bg="none"
                    backdropFilter="auto"
                    backdropInvert="80%"
                    backdropBlur="2px"
                />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody py="3rem">
                        {content(Object.entries(data).length)}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

interface BarProps {
    name: string;
    value: number;
    total: number;
    transformer: (arg0: string) => JSX.Element;
}

const Bar = ({
    name,
    value,
    total,
    transformer = (x) => <>{x}</>,
}: BarProps): JSX.Element => {
    return (
        <Box
            width="100%"
            bg="aliceblue"
            border="1px solid #f2f0f0"
            rounded="0.5rem"
            position="relative"
        >
            <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${(value * 100) / total}%` }}
                transition={{ duration: 2 }}
                style={{
                    backgroundColor: "#27dffe",
                    height: "1.5rem",
                    borderRadius: "0.5rem",
                    position: "absolute",
                    zIndex: 2,
                }}
            />
            <Box display="flex" px="0.5rem" h="1.5rem" zIndex={3}>
                <Text mr="auto" zIndex={3}>
                    {transformer(name)}
                </Text>
                <Text ml="auto" zIndex={3}>
                    {value}
                </Text>
            </Box>
        </Box>
    );
};
