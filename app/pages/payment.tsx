import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";
import {
  Alert,
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
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import CustomerProvider, {
  useCustomerApp,
} from "../src/hooks/useCustomerProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import Step1 from "../src/components/Payment/Step1";
import Step2 from "../src/components/Payment/Step2";
import * as anchor from "@project-serum/anchor";
import { programID } from "../src/hooks/useAppProvider";

// Step 1: Chuyen tu vi A -> B (connect vi A)
// Step 2: Initialize Invoice (connect vi B)
// Step 3: Chuyen tu vi B -> Merchant (connect vi B)

export const STEPS = [
  { code: "step_1", message: "Transfer from your wallet to service account" },
  { code: "step_2", message: "Pay invoice with service account" },
];

const Payment = () => {
  const [currentStep, setCurrentStep] = useState("step_2");
  const wallet = useWallet();
  const {
    merchant,
    service,
    customerServiceAccountQuery,
    invoiceAccountQuery,
  } = useCustomerApp();
  const { data: merchantData, isLoading: isLoadingMerchantData } = merchant;
  const { data: serviceData, isLoading: isLoadingService } = service;
  const router = useRouter();
  const { userID, merchantID, serviceID } = router.query;

  const { data: existedInvoice, isLoading: isGettingExistedInvoice } =
    invoiceAccountQuery;

  const isLoading =
    isLoadingMerchantData || isLoadingService || isGettingExistedInvoice;

  const needCreateNewInvoice =
    new Date() > existedInvoice?.expirationTimestamp?.toNumber() * 1000;

  const isPaid =
    existedInvoice && existedInvoice?.isPaid && !needCreateNewInvoice;

  useEffect(() => {
    if (isPaid) {
      setCurrentStep("step_2");
    }
  }, [isPaid]);
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
      <Text align="center">You are paying with Maius Gateway.</Text>
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
              <Text>Billed monthly</Text>
            </Stack>
          </Stack>
        </Box>
        <Box
          mt="12"
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          {!wallet.connected && <WalletMultiButton />}
          {currentStep === "need_repayment" && (
            <Button
              onClick={() => {
                setCurrentStep("step_1");
              }}
            >
              Subscription ended. Start again?
            </Button>
          )}
          {currentStep === "step_1" && (
            <Step1 setCurrentStep={setCurrentStep} />
          )}

          {currentStep === "step_2" && (
            <Step2 setCurrentStep={setCurrentStep} />
          )}

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
            Back to merchant
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
