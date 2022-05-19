import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { programID, useApp } from "../src/hooks/useAppProvider";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import LandingPage from "../src/components/LandingPage";
import * as anchor from "@project-serum/anchor";
import { MaiusPayment } from "../src/types/maius_payment";
import idl from "../src/idl.json";

const IMAGE =
  "https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80";

const PaymentPage = () => {
  const [program, setProgram] = useState<
    anchor.Program<MaiusPayment> | undefined
  >();
  const wallet = useWallet();
  const router = useRouter();
  const connection = useConnection();
  const provider = new anchor.AnchorProvider(
    connection.connection,
    wallet.wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const { merchantID, serviceID } = router.query;

  const { data: merchantData, isRefetching: isLoadingMerchantData } = useQuery(
    ["merchant", merchantID],
    () => program.account.merchant.fetch(merchantID!),
    {
      enabled: program !== undefined,
    }
  );
  const { data: serviceData, isRefetching: isLoadingService } = useQuery(
    ["service", serviceID],
    () => program.account.service.fetch(serviceID!),
    {
      enabled: program !== undefined,
    }
  );

  const isLoading = isLoadingMerchantData || isLoadingService;

  useEffect(() => {
    const _program: anchor.Program<MaiusPayment> = new anchor.Program(
      idl,
      programID,
      provider
    );
    setProgram(_program);
  }, []);

  if (isLoading) {
    return (
      <Center flexDirection="column">
        <Spinner size="lg" />
        <Heading mt={4}>please wait...</Heading>
      </Center>
    );
  }

  return (
    <div>
      <Center py={12} display="flex" flexDirection="column">
        <Box
          role={"group"}
          p={6}
          maxW={"330px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"lg"}
          pos={"relative"}
          zIndex={1}
        >
          <Box
            rounded={"lg"}
            mt={-12}
            pos={"relative"}
            height={"230px"}
            _after={{
              transition: "all .3s ease",
              content: '""',
              w: "full",
              h: "full",
              pos: "absolute",
              top: 5,
              left: 0,
              backgroundImage: `url(${merchantData?.logo})`,
              filter: "blur(15px)",
              zIndex: -1,
            }}
            _groupHover={{
              _after: {
                filter: "blur(20px)",
              },
            }}
          >
            <Image
              rounded={"lg"}
              height={230}
              width={282}
              objectFit={"cover"}
              src={merchantData?.logo}
            />
          </Box>
          <Stack pt={10} align={"center"}>
            <Text
              color={"gray.500"}
              fontSize={"sm"}
              textTransform={"uppercase"}
            >
              Merchant: {merchantData?.title}
            </Text>
            <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
              {serviceData?.title}
            </Heading>
            <Stack direction={"row"} align={"center"}>
              <Text fontWeight={800} fontSize={"xl"}>
                {(serviceData?.expectedAmount || 0) / LAMPORTS_PER_SOL} SOL
              </Text>
            </Stack>
          </Stack>
        </Box>
        <Box
          mt="32"
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Text align="center" mb={4}>
            You are paying with Maius Gateway.
            <br />
            Please using different wallet with the ones logged in to protect
            your privacy
          </Text>

          <Button mb={6} w={200} size="lg">
            Confirm Payment <ArrowForwardIcon />
          </Button>

          <div style={{ opacity: wallet.connected ? 0.5 : 1.0 }}>
            <WalletMultiButton />
          </div>

          <Button
            colorScheme="red"
            variant="ghost"
            rightIcon={<ArrowForwardIcon />}
            mt={8}
          >
            Cancel payment
          </Button>
        </Box>
      </Center>
    </div>
  );
};

export default PaymentPage;
