import {
  Box,
  Button,
  Divider,
  Heading,
  Progress,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { STEPS } from "../../../pages/payment";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useCustomerApp } from "../../hooks/useCustomerProvider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { format } from "date-fns";
import { Text } from "@chakra-ui/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useRouter } from "next/router";

const Step2 = ({ setCurrentStep }) => {
  const [additionalFee, setAdditionalFee] = useState(0);
  const router = useRouter();
  const {
    userID,
    customerServiceAddressQuery,
    customerServiceAccountQuery,
    invoiceAddressQuery,
    invoiceAccountQuery,
    createCustomerServiceAccountQuery,
    createInvoiceAccountQuery,
    transferWalletBToMerchantQuery,
  } = useCustomerApp();
  const connection = useConnection();
  const wallet = useWallet();

  const { isLoading: isGettingCustomerServiceAddress } =
    customerServiceAddressQuery;
  const { isLoading: isFindingExistedServiceAccount } =
    customerServiceAccountQuery;

  const { isLoading: isFindingInvoiceAccountAddress } = invoiceAddressQuery;

  const { data: existedInvoice, isLoading: isGettingExistedInvoice } =
    invoiceAccountQuery;

  const { isLoading: isCreatingCustomerServiceAccount } =
    createCustomerServiceAccountQuery;
  const {
    mutateAsync: initializeInvoiceAccount,
    isLoading: isCreatingInvoiceAccount,
  } = createInvoiceAccountQuery;

  const { mutateAsync: transferBToMerchant, isLoading: isPaying } =
    transferWalletBToMerchantQuery;

  const isLoading =
    isFindingExistedServiceAccount ||
    isGettingCustomerServiceAddress ||
    isCreatingCustomerServiceAccount ||
    isFindingInvoiceAccountAddress ||
    isCreatingInvoiceAccount ||
    isGettingExistedInvoice ||
    isPaying;

  const expirationTimestamp = new Date(
    existedInvoice?.expirationTimestamp?.toNumber() * 1000
  );

  const createdTimestamp = new Date(
    existedInvoice?.createdTimestamp?.toNumber() * 1000
  );

  const needCreateNewInvoice =
    new Date() > existedInvoice?.expirationTimestamp?.toNumber() * 1000;

  const startPayment = async () => {
    // if (!existedServiceAccount && customerServiceAddress) {
    //   console.log("create customer service account");
    //   await initializeCustomerServiceAccount(customerServiceAddress);
    // }
    if (!existedInvoice || needCreateNewInvoice) {
      console.log("create invoice account");
      await initializeInvoiceAccount();
    }
    console.log("transfer b to merchant");
    await transferBToMerchant();
  };

  const isPaid =
    existedInvoice && existedInvoice?.isPaid && !needCreateNewInvoice;
  const correctWallet =
    wallet.connected && wallet.publicKey?.toBase58() !== userID;

  const range = expirationTimestamp - createdTimestamp;

  const diff = Math.max(0, expirationTimestamp - new Date());

  useEffect(() => {
    if (wallet.connected && wallet.publicKey?.toBase58() !== userID) {
      wallet.disconnect();
    }
    connection.connection.getMinimumBalanceForRentExemption(1500).then((r) => {
      setAdditionalFee(r / LAMPORTS_PER_SOL);
    });
  }, [wallet]);

  return (
    <Box display="flex" mt={3} flexDirection="column">
      {(!existedInvoice || !isPaid) && wallet.connected && (
        <Box display="flex" flexDirection="column">
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            mb={6}
          >
            <Text>Store data fee</Text>
            <Text>{additionalFee} SOL</Text>
          </Box>
          <Button onClick={startPayment} mt={2} isLoading={isLoading}>
            {STEPS[1].message}
            <ArrowForwardIcon style={{ marginLeft: "8px" }} />
          </Button>
        </Box>
      )}
      {!wallet.connected && (
        <Text mt={3}>
          Please connect to following wallet: <b>{userID}</b>
        </Text>
      )}
      {!correctWallet && !wallet.connected && (
        <Box mt={4}>
          <WalletMultiButton />
        </Box>
      )}
      {isPaid && (
        <>
          <Progress hasStripe value={(100 - (100 * diff) / range) * 100} />
          <Text
            fontSize="sm"
            fontStyle="italic"
            mt={2}
            mb={8}
            variant="solid"
            colorScheme="red"
          >
            next payment: {format(expirationTimestamp, "HH:mm:ss dd-MM-yyyy")}
          </Text>
          <Button
            onClick={() => {
              router.push("https://google.com");
            }}
          >
            Use Service
            <ArrowForwardIcon style={{ marginLeft: "8px" }} />
          </Button>
        </>
      )}
      <Divider my={4} />
      {existedInvoice && !needCreateNewInvoice && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Tag
              size="lg"
              variant="solid"
              colorScheme={existedInvoice?.isPaid ? "green" : "red"}
            >
              {existedInvoice?.isPaid ? "PAID" : "UNPAID"}
            </Tag>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Step2;
