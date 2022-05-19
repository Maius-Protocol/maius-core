import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { programID, useApp } from "../hooks/useAppProvider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";
const anchor = require("@project-serum/anchor");

const CreateNewIntegration = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { program, merchantAccount } = useApp();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const toast = useToast();
  const getServiceAccount = async () => {
    const [_serviceAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("service"),
        merchantAccount?.toBuffer(),
        new anchor.BN(0)?.toArrayLike(Buffer),
      ],
      programID
    );
    return _serviceAccount;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutateAsync: createService } = useMutation(
    async ({ title, expected_amount }: any) => {
      const serviceAccount = await getServiceAccount();
      const tx = await program.methods
        .createService(title, new anchor.BN(expected_amount))
        .accounts({
          merchantAccount: merchantAccount,
          serviceAccount: serviceAccount,
          authority: publicKey?.toBase58(),
          systemProgram: web3.SystemProgram.programId,
        })
        .transaction();
      console.log(tx);
      return await sendTransaction(tx, connection);
    },
    {
      retry: false,
      onError: (e) => {
        toast({
          title: "Error",
          description: e?.message?.toString(),
          status: "error",
          position: "bottom-left",
        });
      },
      onSuccess: () => {
        toast({
          title:
            "Create service successful. Please refetch page after a while.",
          status: "success",
          position: "bottom-left",
        });
        onClose();
      },
    }
  );

  const onSubmit = async (data: any) => {
    await createService({
      title: data.title,
      expected_amount: data.expected_amount * LAMPORTS_PER_SOL,
    });
  };

  return (
    <>
      <Button onClick={onOpen} ml={2} size="lg" bg="green.500" color="white">
        Create New Service
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Create a service</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl isInvalid={errors.name}>
                  <FormLabel htmlFor="title">Service Title</FormLabel>
                  <Input
                    placeholder="1_MONTH_SUBSCRIPTION"
                    type="text"
                    {...register("title", { required: true })}
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.logo}>
                  <FormLabel htmlFor="expected_amount">
                    Expected Amount (SOL)
                  </FormLabel>
                  <Input
                    placeholder="0.2"
                    type="text"
                    {...register("expected_amount", { required: true })}
                  />
                  <FormErrorMessage>{errors.expected_amount}</FormErrorMessage>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Save
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateNewIntegration;
