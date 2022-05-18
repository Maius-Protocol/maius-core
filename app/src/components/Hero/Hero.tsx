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
          <Text as={"span"} color={"orange.400"}>
            made easy
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Never miss a meeting. Never be late for one too. Keep track of your
          meetings and receive smart reminders in appropriate times. Read your
          smart “Daily Agenda” every morning.
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
