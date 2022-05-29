import {
  Avatar,
  Box,
  Center,
  Heading,
  Spinner,
  Stack,
  Text,
  Image,
  useColorModeValue,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  ModalFooter,
  Modal,
  useDisclosure,
  Divider,
  Alert,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "react-query";
import { useApp } from "../hooks/useAppProvider";
import React, { useEffect, useState } from "react";
import { BN } from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useForm } from "react-hook-form";
import { FiDollarSign } from "react-icons/fi";
import { useRouter } from "next/router";

const IntegrationCard = ({ index }) => {
  const [inputUserAddress, setInputUserAddress] = useState("");
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { getServiceData, merchantAccount } = useApp();
  const { data, isLoading } = useQuery(["service", index], () =>
    getServiceData(index)
  );
  const bg = useColorModeValue("white", "gray.900");
  const bg2 = useColorModeValue("gray.700", "white");
  const serviceAccountAddress = queryClient.getQueryData([
    "service-account-address",
    index,
  ]);
  const paymentURL = (USER_ID: string) =>
    `https://maius-pay.vercel.app/payment?userID=${USER_ID}&merchantID=${merchantAccount?.toBase58()}&serviceID=${serviceAccountAddress}`;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Center py={6} mr={12} mb={12}>
        <Box
          w={"320px"}
          bg={bg}
          boxShadow={"2xl"}
          rounded={"md"}
          p={6}
          overflow={"hidden"}
        >
          <Stack>
            <Text
              color={"green.500"}
              textTransform={"uppercase"}
              fontWeight={800}
              fontSize={"sm"}
              letterSpacing={1.1}
            >
              PLAN #{index}
            </Text>
            <Heading color={bg2} fontSize={"2xl"} fontFamily={"body"}>
              {data.title}
            </Heading>
            <Text color={"gray.500"}>
              Expected amount:{" "}
              {parseInt(data.expectedAmount?.toString()) / LAMPORTS_PER_SOL} SOL
            </Text>
            <Text color={"gray.500"}>
              Expiration Period:{" "}
              {(data?.expirationPeriod?.toNumber() || 0) / (24 * 60 * 60)} days
            </Text>
            <Text color={"gray.500"}>
              Subscribers: {data?.subscriptionAccounts?.length} subs
            </Text>
          </Stack>
          <Button w="100%" mt={10} bg="blue.300" onClick={onOpen}>
            Create Payment URL
          </Button>
          <Button
            w="100%"
            mt={2}
            onClick={() => {
              router.push({
                pathname: "/invoices",
                query: {
                  serviceIndex: index,
                },
              });
            }}
          >
            Invoices History
          </Button>
        </Box>
      </Center>
      <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form>
            <ModalHeader>
              Guidelines to create payment URL for your service
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box display="flex" flexDirection="row">
                <FormControl>
                  <FormLabel>Gateway Base URL</FormLabel>
                  <div>https://maius-pay.vercel.app/payment</div>
                </FormControl>
              </Box>
              <Divider mt={8} />
              <FormControl mt={4}>
                <FormLabel>Your payment URL template</FormLabel>

                <Alert bg="yellow.400" mt={3}>
                  Please replace <b style={{ margin: "0 6px" }}>USER_ID</b> with
                  your customer wallet{" "}
                  <b style={{ margin: "0 6px" }}>Public Key</b>
                </Alert>
                <FormControl mt={4}>
                  <FormLabel>Enter customer register wallet address</FormLabel>
                  <Input
                    onChange={(e) => setInputUserAddress(e.currentTarget.value)}
                    value={inputUserAddress}
                  />
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Customer Payment URL</FormLabel>
                  <Input value={paymentURL(inputUserAddress)} />
                </FormControl>
              </FormControl>
              <Divider mt={8} />
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default IntegrationCard;
