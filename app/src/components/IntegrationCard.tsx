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
import { useQuery } from "react-query";
import { useApp } from "../hooks/useAppProvider";
import React, { useEffect } from "react";
import { BN } from "@project-serum/anchor";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useForm } from "react-hook-form";

const IntegrationCard = ({ index }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { program, getServiceData, merchantAccount } = useApp();
  const { data, isLoading } = useQuery(["service", index], () =>
    getServiceData(index)
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {}, [data?.data]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Center py={6} mr={12} mb={12}>
        <Box
          w={"320px"}
          bg={useColorModeValue("white", "gray.900")}
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
              SERVICE #{index}
            </Text>
            <Heading
              color={useColorModeValue("gray.700", "white")}
              fontSize={"2xl"}
              fontFamily={"body"}
            >
              {data.title}
            </Heading>
            <Text color={"gray.500"}>
              Expected amount:{" "}
              {parseInt(data.expectedAmount?.toString()) / LAMPORTS_PER_SOL} SOL
            </Text>
          </Stack>
          <Button w="100%" mt={10} onClick={onOpen}>
            Create Payment URL
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
                  <div>http://localhost:3000/payment</div>
                </FormControl>
                <FormControl>
                  <FormLabel>Service PDA Address</FormLabel>
                  <div>http://localhost:3000/payment</div>
                </FormControl>
              </Box>
              <Divider mt={8} />
              <FormControl mt={4}>
                <FormLabel>Your payment URL template</FormLabel>
                <Input
                  value={`http://localhost:3000/payment?userID=USER_ID&merchantID=${merchantAccount?.toBase58()}&serviceID=`}
                />

                <Alert bg="yellow.400" mt={3}>
                  Please replace <b style={{ margin: "0 6px" }}>USER_ID</b> with
                  your customer wallet{" "}
                  <b style={{ margin: "0 6px" }}>Public Key</b>
                </Alert>
              </FormControl>
              <Divider mt={8} />

              <FormControl mt={4}>
                <FormLabel>Demo</FormLabel>
                <FormControl mt={4}>
                  <FormLabel>Enter an example wallet</FormLabel>
                </FormControl>
              </FormControl>
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
