import { web3 } from "@project-serum/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import withAuth from "../src/hooks/withAuth";
import { useApp } from "../src/hooks/useAppProvider";
import Lottie from "lottie-react";
import animation from "../src/components/41375-laptop-rocket.json";
import { useMutation } from "react-query";

const SettingsPage = () => {
  useEffect(() => {}, []);
  const { program, merchantAccount, currentMerchantData } = useApp();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutateAsync: initializeMerchant, isLoading: isInitializing } =
    useMutation(
      async () => {
        const tx = await program.methods
          .initializeMerchant()
          .accounts({
            merchantAccount: merchantAccount,
            systemProgram: web3.SystemProgram.programId,
            user: publicKey?.toBase58(),
          })
          .transaction();
        await sendTransaction(tx, connection, {});
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await currentMerchantData.refetch();
      },
      {
        onSuccess: () => {
          toast({
            title: "Welcome to Maius Gateway!",
            status: "success",
            position: "bottom-left",
          });
        },
        onError: (e) => {
          toast({
            title: "Error",
            description: e?.message?.toString(),
            status: "error",
            position: "bottom-left",
          });
        },
      }
    );

  const { mutateAsync: onSubmit, isLoading: isUpdating } = useMutation(
    async (data: any) => {
      const tx = await program.methods
        .updateMerchant(data.title, data.logo)
        .accounts({
          merchantAccount: merchantAccount,
        })
        .transaction();
      await sendTransaction(tx, connection, {
        preflightCommitment: "processed",
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await currentMerchantData.refetch();
    },
    {
      onSuccess: () => {
        toast({
          title: "Update data successful.",
          status: "success",
          position: "bottom-left",
        });
      },
      onError: (e) => {
        toast({
          title: "Error",
          description: e?.message?.toString(),
          status: "error",
          position: "bottom-left",
        });
      },
    }
  );

  useEffect(() => {
    if (currentMerchantData.data) {
      reset({
        title: currentMerchantData.data.title,
        logo: currentMerchantData.data.logo,
      });
    }
  }, [currentMerchantData.data]);

  if (currentMerchantData.isLoading) {
    return <Spinner />;
  }

  if (!currentMerchantData.data) {
    return (
      <Container maxW={640} pt={12}>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Heading
            color={"gray.800"}
            lineHeight={1.1}
            fontSize={{ base: "3xl" }}
          >
            Your account has not been activated
          </Heading>
          <Lottie animationData={animation} />

          <Button
            onClick={initializeMerchant}
            ml={2}
            mt={20}
            size="lg"
            bg="green.500"
            isLoading={isInitializing}
            color="white"
          >
            Activate your merchant account
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW={640} pt={12}>
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        boxShadow={"lg"}
        p={8}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            <FormControl isInvalid={errors.name}>
              <FormLabel htmlFor="title">Merchant Title</FormLabel>
              <Input
                placeholder="Spotify LLC"
                type="text"
                {...register("title", { required: true })}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.logo}>
              <FormLabel htmlFor="logo">Merchant Logo URL</FormLabel>
              <Input
                placeholder="https://source.unsplash.com/200x200"
                type="text"
                {...register("logo", { required: true })}
              />
              <FormErrorMessage>{errors.logo}</FormErrorMessage>
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                type="submit"
                mt={12}
                isLoading={isUpdating}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

const Page = () => {
  return (
    <Container w="100%" minW="100%" minH="100vh">
      <Heading color={"gray.800"} lineHeight={1.1} fontSize={{ base: "3xl" }}>
        Settings
      </Heading>
      <SettingsPage />
    </Container>
  );
};

export default withAuth(Page);
