import { web3 } from "@project-serum/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Button,
  FormLabel,
  FormControl,
  useToast,
  FormErrorMessage,
  Input,
  Box,
  useColorModeValue,
  Stack,
  Container,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import withAuth from "../src/hooks/withAuth";
import { useApp } from "../src/hooks/useAppProvider";
const SettingsPage = () => {
  useEffect(() => {}, []);
  const [currentMerchantData, setCurrentMerchantData] = useState<any>();
  const { program, merchantAccount } = useApp();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const getMerchantData = async () => {
    try {
      const merchantState = await program.account.merchant.fetch(
        merchantAccount?.toBase58()!
      );
      if (merchantState) {
        reset({ title: merchantState.title, logo: merchantState.logo });
      }
      setCurrentMerchantData(merchantState);
    } catch (e) {}
  };

  const initializeMerchant = async () => {
    try {
      const tx = await program.methods
        .initializeMerchant()
        .accounts({
          merchantAccount: merchantAccount,
          systemProgram: web3.SystemProgram.programId,
          user: publicKey?.toBase58(),
        })
        .transaction();
      await sendTransaction(tx, connection);
      await getMerchantData();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message?.toString(),
        status: "error",
        position: "bottom-left",
      });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const tx = await program.methods
        .updateMerchant(data.title, data.logo)
        .accounts({
          merchantAccount: merchantAccount,
        })
        .transaction();
      await sendTransaction(tx, connection);
      toast({
        title: "Update data successful. Please refetch page after a while.",
        status: "success",
        position: "bottom-left",
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message?.toString(),
        status: "error",
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    if (program?.account) {
      getMerchantData();
    }
  }, [program]);

  if (!currentMerchantData) {
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
          <Button
            onClick={initializeMerchant}
            ml={2}
            mt={20}
            size="lg"
            bg="green.500"
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
              <FormErrorMessage>{errors.name}</FormErrorMessage>
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
    <Container
      w="100%"
      minW="100%"
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <SettingsPage />
    </Container>
  );
};

export default withAuth(Page);
