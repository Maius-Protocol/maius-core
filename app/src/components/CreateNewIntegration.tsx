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
  const { program, merchantAccount, getServiceAccount, currentMerchantData } =
    useApp();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { mutateAsync: createService, isLoading } = useMutation(
    async ({ title, expected_amount, expiration_period }: any) => {
      const serviceAccount = await getServiceAccount(
        currentMerchantData?.data?.serviceCount || 0
      );
      const tx = await program.methods
        .createService(
          title,
          new anchor.BN(expected_amount),
          new anchor.BN(expiration_period)
        )
        .accounts({
          merchantAccount: merchantAccount,
          serviceAccount: serviceAccount,
          authority: publicKey?.toBase58(),
          systemProgram: web3.SystemProgram.programId,
        })
        .transaction();
      await sendTransaction(tx, connection);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      await currentMerchantData.refetch();
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
          title: "Create service successful.",
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
      expiration_period: Math.round(data.expiration_period * 24 * 60 * 60),
    });
  };

  return (
    <>
      <div>
        <Button onClick={onOpen} ml={2} size="lg" bg="green.500" color="white">
          Create New Plan
        </Button>

        <Button
          onClick={() => {
            currentMerchantData.refetch();
          }}
          ml={2}
          size="lg"
          isLoading={currentMerchantData.isRefetching}
        >
          Refetch
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Create a plan</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl isInvalid={errors.name}>
                  <FormLabel htmlFor="title">Plan Title</FormLabel>
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
                <FormControl isInvalid={errors.expiration_period}>
                  <FormLabel htmlFor="expiration_period">
                    Expiration Period (days)
                  </FormLabel>
                  <Input
                    placeholder="14"
                    type="text"
                    {...register("expiration_period", { required: true })}
                  />
                  <FormErrorMessage>
                    {errors.expiration_period}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={isLoading}
                colorScheme="blue"
                mr={3}
                type="submit"
              >
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
