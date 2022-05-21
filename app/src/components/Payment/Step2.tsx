import { Box, Button, Divider, Heading, Tag, useToast } from "@chakra-ui/react";
import { STEPS } from "../../../pages/payment";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import React, { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { useCustomerApp } from "../../hooks/useCustomerProvider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { programID } from "../../hooks/useAppProvider";
import { format } from "date-fns";
import { Text } from "@chakra-ui/react";
import { web3 } from "@project-serum/anchor";

const Step2 = ({ setCurrentStep }) => {
  const {
    program,
    userID,
    merchant,
    serviceData,
    merchantID,
    serviceID,
    service,
    customerServiceAddressQuery,
    customerServiceAccountQuery,
    invoiceAddressQuery,
    invoiceAccountQuery,
    createCustomerServiceAccountQuery,
    createInvoiceAccountQuery,
    transferWalletBToMerchantQuery,
  } = useCustomerApp();
  const wallet = useWallet();

  const { sendTransaction } = wallet;
  const { connection } = useConnection();
  const toast = useToast();
  const walletB = wallet.publicKey;

  const {
    data: customerServiceAddress,
    isLoading: isGettingCustomerServiceAddress,
  } = customerServiceAddressQuery;
  const {
    data: existedServiceAccount,
    isLoading: isFindingExistedServiceAccount,
  } = customerServiceAccountQuery;

  const { isLoading: isFindingInvoiceAccountAddress } = invoiceAddressQuery;

  const { data: existedInvoice, isLoading: isGettingExistedInvoice } =
    invoiceAccountQuery;

  const {
    mutateAsync: initializeCustomerServiceAccount,
    isLoading: isCreatingCustomerServiceAccount,
  } = createCustomerServiceAccountQuery;
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

  const needCreateNewInvoice =
    new Date() > existedInvoice?.expirationTimestamp?.toNumber() * 1000;

  const startPayment = async () => {
    if (!existedServiceAccount && customerServiceAddress) {
      console.log("create customer service account");
      await initializeCustomerServiceAccount(customerServiceAddress);
    }
    if (!existedInvoice || needCreateNewInvoice) {
      console.log("create invoice account");
      await initializeInvoiceAccount();
    }
    console.log("transfer b to merchant");
    await transferBToMerchant();
  };

  const isPaid =
    existedInvoice && existedInvoice?.isPaid && !needCreateNewInvoice;

  useEffect(() => {
    if (wallet.connected && wallet.publicKey?.toBase58() !== userID) {
      wallet.disconnect();
    }
  }, [wallet]);

  return (
    <Box display="flex" flexDirection="column">
      {(!existedInvoice || !isPaid) && wallet.connected && (
        <Button onClick={startPayment} mt={2} isLoading={isLoading}>
          {STEPS[1].message}
          <ArrowForwardIcon style={{ marginLeft: "8px" }} />
        </Button>
      )}
      {!wallet.connected && (
        <Text mt={3}>Please connect to following wallet: {userID}</Text>
      )}
      {isPaid && (
        <>
          <Heading>Everything is ready.</Heading>
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
          <Text
            fontSize="sm"
            fontStyle="italic"
            mt={2}
            variant="solid"
            colorScheme="red"
          >
            next payment: {format(expirationTimestamp, "HH:mm:ss dd-MM-yyyy")}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Step2;
