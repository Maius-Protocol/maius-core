import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import CustomerProvider, {
  useCustomerApp,
} from "../src/hooks/useCustomerProvider";
import { useWallet } from "@solana/wallet-adapter-react";

const Payment = () => {
  const [currentStep, setCurrentStep] = useState("step_2");
  const wallet = useWallet();
  const { program, initializeInvoice } = useCustomerApp();
  const router = useRouter();
  const { userID, merchantID, serviceID } = router.query;

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

  const startPayment = async () => {
    initializeInvoice();
  };

  const sameWallet = wallet.publicKey?.toBase58() === userID;

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
          maxW={"420px"}
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
            width={"240px"}
            height={"240px"}
            _after={{
              transition: "all .6s ease",
              content: '""',
              w: "full",
              h: "full",
              pos: "absolute",
              top: 5,
              left: "25%",
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
              height={240}
              width={240}
              objectFit={"cover"}
              src={merchantData?.logo}
              style={{ position: "absolute", left: "25%" }}
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
            <Stack direction={"column"} align={"center"}>
              <Text fontWeight={800} fontSize={"xl"}>
                {(serviceData?.expectedAmount || 0) / LAMPORTS_PER_SOL} SOL
              </Text>
              <Text>Billed monthly, on 28th of current month</Text>
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
          </Text>

          {sameWallet && (
            <>
              <Button mb={4} w={360} size="lg">
                Follow the notice below to continue
              </Button>

              <Text fontWeight="bold" color="red.600" textAlign="center" mb={6}>
                You're using the same wallet that logged in{" "}
                {merchantData?.title}.<br /> Please using different wallet that
                having sufficient amount to protect your privacy
              </Text>
            </>
          )}

          {!sameWallet && currentStep === "step_1" && wallet.connected && (
            <>
              <Button mb={6} w={360} size="lg">
                Transfer securely to {merchantData?.title} account{"  "}
                <ArrowForwardIcon />
              </Button>
            </>
          )}
          {currentStep === "step_2" && wallet.connected && (
            <>
              <Button mb={6} w={360} size="lg" onClick={startPayment}>
                Make payment{"  "}
                <ArrowForwardIcon />
              </Button>
            </>
          )}

          <div style={{ opacity: wallet.connected ? 0.5 : 1.0 }}>
            <WalletMultiButton />
          </div>

          <Button
            colorScheme="red"
            variant="ghost"
            rightIcon={<ArrowForwardIcon />}
            mt={8}
            onClick={() => {
              wallet.disconnect();
              router.push("/");
            }}
          >
            Cancel payment
          </Button>
        </Box>
      </Center>
    </div>
  );
};

const PaymentPage = () => {
  const router = useRouter();
  const params = router.query;

  if (Object.keys(params).length === 0) {
    return <Spinner />;
  }

  return (
    <CustomerProvider>
      <Payment />
    </CustomerProvider>
  );
};

export default PaymentPage;
