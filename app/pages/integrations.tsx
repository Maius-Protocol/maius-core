import { useRouter } from "next/router";
import { Box, Container, Heading } from "@chakra-ui/react";
import Lottie from "lottie-react";
import animation from "../src/components/41375-laptop-rocket.json";
import React from "react";
import CreateNewIntegration from "../src/components/CreateNewIntegration";
import withAuth from "../src/hooks/withAuth";

const encodeUrl = require("encodeurl");

const Integrations = () => {
  const router = useRouter();
  const prefixUrl = `http://localhost:8000/payment?redirect_url=${encodeUrl(
    "https://google.com?payme"
  )}`;
  return (
    <Container
      w="100%"
      minW="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Box
        w="100%"
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading color={"gray.800"} lineHeight={1.1} fontSize={{ base: "3xl" }}>
          Your Integrations
        </Heading>
        <CreateNewIntegration />
      </Box>
      <Lottie animationData={animation} />
    </Container>
  );

  return <div>Your URL Payment: {prefixUrl}</div>;
};

export default withAuth(Integrations);
