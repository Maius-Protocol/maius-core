import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import CustomerProvider, {
  useCustomerApp,
} from "../src/hooks/useCustomerProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import Step1 from "../src/components/Payment/Step1";
import Step2 from "../src/components/Payment/Step2";
import { Step, Steps, useSteps } from "chakra-ui-steps";

// Step 1: Chuyen tu vi A -> B (connect vi A)
// Step 2: Initialize Invoice (connect vi B)
// Step 3: Chuyen tu vi B -> Merchant (connect vi B)

export const STEPS = [
  { code: "step_1", message: "Transfer from your wallet to service account" },
  { code: "step_2", message: "Pay invoice" },
];

const Payment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const wallet = useWallet();
  const { merchant, service, invoiceAccountQuery } = useCustomerApp();
  const { data: merchantData, isLoading: isLoadingMerchantData } = merchant;
  const { data: serviceData, isLoading: isLoadingService } = service;
  const router = useRouter();
  const bg = useColorModeValue("white", "gray.800");

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
      setCurrentStep(1);
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
      <Box
        display="flex"
        flexDirection="row"
        alignItems="flex-start"
        justifyContent="center"
      >
        <Box w={480}>
          <Text align="center">You are paying with Maius Gateway.</Text>

          <Center py={12} display="flex" flexDirection="column">
            <Box
              role={"group"}
              p={6}
              maxW={"420px"}
              w={"full"}
              bg={bg}
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
          </Center>
        </Box>
        <Box
          mt="12"
          alignItems="flex-start"
          justifyContent="flex-start"
          display="flex"
          flexDirection="column"
          w={480}
        >
          <Box mb={5} ml={3}>
            <WalletDisconnectButton />
          </Box>
          <Tabs
            variant="soft-rounded"
            ml={2}
            isManual
            isLazy
            index={currentStep}
            onChange={(step) => {
              if (isPaid && step === 0) {
                return;
              }
              setCurrentStep(step);
            }}
            colorScheme="green"
          >
            <TabList>
              <Tab style={{ opacity: isPaid ? 0.4 : 1.0 }}>
                Step 1: Privacy Transfer
              </Tab>
              <Tab>Step 2: Subscribe</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Text>
                  We will securely transfer from your <b>Funding Wallet</b> to
                  your
                  <b>Register Wallet</b>. Powered by Light Protocol.
                </Text>
                <Step1 setCurrentStep={setCurrentStep} />
              </TabPanel>
              <TabPanel>
                <Step2 setCurrentStep={setCurrentStep} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
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
