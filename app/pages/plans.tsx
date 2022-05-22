import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  Heading,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import Lottie from "lottie-react";
import animation from "../src/components/41375-laptop-rocket.json";
import React from "react";
import CreateNewIntegration from "../src/components/CreateNewIntegration";
import withAuth from "../src/hooks/withAuth";
import { useApp } from "../src/hooks/useAppProvider";
import IntegrationCard from "../src/components/IntegrationCard";

const encodeUrl = require("encodeurl");

const Plans = () => {
  const { currentMerchantData } = useApp();
  const router = useRouter();
  const prefixUrl = `http://localhost:8000/payment?redirect_url=${encodeUrl(
    "https://google.com?payme"
  )}`;

  if (currentMerchantData.isLoading) {
    return <Spinner />;
  }

  if (!currentMerchantData.data) {
    return (
      <Container maxW="100%" pt={12}>
        <Heading color={"gray.800"} lineHeight={1.1} fontSize={{ base: "3xl" }}>
          Please go to settings to activate your account.
        </Heading>
      </Container>
    );
  }
  console.log("Current Merchant Data", currentMerchantData?.data);

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
          Your Plans
        </Heading>

        <CreateNewIntegration />
      </Box>
      {currentMerchantData?.data?.serviceAccount === 0 && (
        <>
          <Lottie animationData={animation} />
        </>
      )}
      {currentMerchantData?.data?.serviceAccount !== 0 && (
        <Container
          minW="100%"
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-start"
          flexWrap="wrap"
        >
          {[...Array(currentMerchantData?.data?.serviceCount).keys()].map(
            (i) => {
              return <IntegrationCard key={`integration_${i}`} index={i} />;
            }
          )}
        </Container>
      )}
    </Container>
  );

  return <div>Your URL Payment: {prefixUrl}</div>;
};

export default withAuth(Plans);
