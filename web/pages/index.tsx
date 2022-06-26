import type { NextPage } from "next";
import { Box, Text } from "@chakra-ui/react";
import {
    Layout,
    CallToActionWithIllustration,
    Features,
    Testimonials,
} from "../components";
import {
    FcBullish,
    FcPrivacy,
    FcLock,
    FcLike,
    FcMindMap,
    FcFlashOn,
} from "react-icons/fc";

const features = [
    {
        icon: FcLike,
        title: "No cookies",
        text: "Cookies are for your jar, analytics are for your website.",
    },
    {
        icon: FcMindMap,
        title: "Simple by design",
        text: "Every statistic, one click away.",
    },
    {
        icon: FcBullish,
        title: "Grow your userbase",
        text: "Understand where your users come and that they do and don't like.",
    },
    {
        icon: FcPrivacy,
        title: "Own your data",
        text: "No selling of your businesses precious information",
    },
    {
        icon: FcLock,
        title: "Protect your users",
        text: "Other analytics services will sell your user's data without them or you knowing.",
    },
    {
        icon: FcFlashOn,
        title: "Lightweight & fast",
        text: "Built using the latest technologies to ensure a worry free experience.",
    },
];

const Home: NextPage = () => {
    return (
        <Layout>
            <CallToActionWithIllustration />
            <Features features={features.slice(0, 3) as any} />
            <Features features={features.slice(3, 6) as any} />
            <Testimonials />
        </Layout>
    );
};

export default Home;
