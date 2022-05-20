import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useEffect } from "react";
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
  const wallet = useWallet();
  const { program, initializeInvoice } = useCustomerApp();
  const router = useRouter();
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

  const startPayment = async () => {
    initializeInvoice();
  };

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
              width={390}
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
            <br />
            Please using different wallet with the ones logged in to protect
            your privacy
          </Text>

          {wallet.connected && (
            <>
              <Button mb={6} w={360} size="lg" onClick={startPayment}>
                Confirm Payment with Wallet B <ArrowForwardIcon />
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
