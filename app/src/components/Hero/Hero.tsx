import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";
import Lottie from "lottie-react";
import animation from "./23730-3d-mobile-payment.json";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const Hero = () => {
  const wallet = useWallet();

  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 8, md: 28 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Private Payment{" "}
          <Text as={"span"} color={"#499AD7"}>
            made easy
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          A payment gateway to help merchants simplify Subscription Payment. It
          similar to Stripe or PayPal, but using Solana and focusing on
          subscriptions flow & truly privacy thanks to Light Protocol
        </Text>
        <Stack spacing={6} direction={"row"}>
          <WalletMultiButton />
        </Stack>
        <Flex w={"full"}>
          <Lottie animationData={animation} />
        </Flex>
      </Stack>
    </Container>
  );
};

export default Hero;
