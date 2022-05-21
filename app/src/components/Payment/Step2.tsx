import { Box, Button, Divider, Heading, Tag, useToast } from "@chakra-ui/react";
import { STEPS } from "../../../pages/payment";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import React from "react";
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
  const { program, merchant, serviceData, merchantID, serviceID, service } =
    useCustomerApp();
  const wallet = useWallet();

  const { sendTransaction } = wallet;
  const { connection } = useConnection();
  const toast = useToast();
  const walletB = wallet.publicKey;

  const {
    data: customerServiceAddress,
    isLoading: isGettingCustomerServiceAddress,
  } = useQuery("customer-service-account-address", async () => {
    const [_customerServiceAddress] =
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("customer_service_account"),
          new PublicKey(serviceID)?.toBuffer(),
          walletB?.toBuffer(),
        ],
        programID
      );
    return _customerServiceAddress;
  });
  const {
    data: existedServiceAccount,
    refetch: refetchServiceAccount,
    isLoading: isFindingExistedServiceAccount,
  } = useQuery(
    "customer-service-account",
    async () => {
      return await program.account.customerServices.fetch(
        customerServiceAddress!
      );
    },
    { retry: false, enabled: !!customerServiceAddress }
  );

  const {
    data: invoiceAccountAddress,
    isLoading: isFindingInvoiceAccountAddress,
  } = useQuery("invoice-account-address", async () => {
    const [_invoiceAddress] = await anchor.web3.PublicKey.findProgramAddress(
      [
        new PublicKey(serviceID)?.toBuffer(),
        Buffer.from("invoice"),
        walletB?.toBuffer(),
        new anchor.BN(existedServiceAccount?.invoiceCount || 0)?.toArrayLike(
          Buffer
        ),
      ],
      programID
    );
    return _invoiceAddress;
  });

  const {
    data: existedInvoice,
    refetch: refetchInvoice,
    isLoading: isGettingExistedInvoice,
  } = useQuery(
    "invoice-account",
    async () => {
      return await program.account.invoice.fetch(invoiceAccountAddress!);
    },
    { retry: false, enabled: !!invoiceAccountAddress }
  );

  const {
    mutateAsync: initializeCustomerServiceAccount,
    isLoading: isCreatingCustomerServiceAccount,
  } = useMutation(
    async (customerServiceAccountAddress: PublicKey) => {
      const tx = await program.methods
        .initializeCustomerServiceAccount()
        .accounts({
          serviceAccount: new PublicKey(serviceID),
          customerServicesAccount: customerServiceAccountAddress,
          authority: walletB!,
        })
        .transaction();
      await sendTransaction(tx, connection);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await refetchServiceAccount();
    },
    {
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
          title: "Create service account success",
          status: "success",
          position: "bottom-left",
        });
      },
    }
  );

  console.log();
  const {
    mutateAsync: initializeInvoiceAccount,
    isLoading: isCreatingInvoiceAccount,
  } = useMutation(
    async () => {
      const [_invoiceAddress] = await anchor.web3.PublicKey.findProgramAddress(
        [
          new PublicKey(serviceID)?.toBuffer(),
          Buffer.from("invoice"),
          walletB?.toBuffer(),
          new anchor.BN(existedServiceAccount?.invoiceCount || 0)?.toArrayLike(
            Buffer
          ),
        ],
        programID
      );
      console.log(_invoiceAddress);
      const tx = await program.methods
        .initializeInvoice()
        .accounts({
          serviceAccount: new PublicKey(serviceID),
          customerServicesAccount: customerServiceAddress,
          invoiceAccount: _invoiceAddress,
          customerAuthority: walletB!,
        })
        .transaction();
      await sendTransaction(tx, connection);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await refetchInvoice();
    },
    {
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
          title: "Create invoice account success",
          status: "success",
          position: "bottom-left",
        });
      },
    }
  );

  const { mutateAsync: transferBToMerchant, isLoading: isPaying } = useMutation(
    async () => {
      const tx = await program.methods
        .transferBToWallet()
        .accounts({
          merchantAccount: new PublicKey(merchantID),
          serviceAccount: new PublicKey(serviceID),
          invoiceAccount: invoiceAccountAddress!,
          walletB: walletB!,
          systemProgram: web3.SystemProgram.programId,
        })
        .transaction();
      await sendTransaction(tx, connection);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await refetchInvoice();
    },
    {
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
          title: "Tranfer B to Merchant Success",
          status: "success",
          position: "bottom-left",
        });
      },
    }
  );

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
    if (!existedInvoice) {
      console.log("create invoice account");
      await initializeInvoiceAccount();
    }
    console.log("transfer b to merchant");
    await transferBToMerchant();
  };
  return (
    <Box display="flex" flexDirection="column">
      {(!existedInvoice || !existedInvoice?.isPaid) && (
        <Button onClick={startPayment} isLoading={isLoading}>
          {STEPS[1].message}
          <ArrowForwardIcon style={{ marginLeft: "8px" }} />
        </Button>
      )}
      {existedInvoice && existedInvoice?.isPaid && (
        <>
          <Heading>Enjoy your day.</Heading>
        </>
      )}
      <Divider my={4} />
      {existedInvoice && (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Text mr={4}>Current Invoice</Text>

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
            next payment: {format(expirationTimestamp, "HH:mm dd-MM-yyyy")}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Step2;
