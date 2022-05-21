import { Button, useToast } from "@chakra-ui/react";
import { STEPS } from "../../../pages/payment";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useCustomerApp } from "../../hooks/useCustomerProvider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { programID } from "../../hooks/useAppProvider";

const Step2 = ({ setCurrentStep }) => {
  const { program, merchant, merchantID, serviceID, service } =
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
    refetch: getInvoiceAccountAddress,
    isLoading: isFindingInvoiceAccountAddress,
  } = useQuery("invoice-account-address", async () => {
    const [_invoiceAddress] = await anchor.web3.PublicKey.findProgramAddress(
      [
        new PublicKey(serviceID)?.toBuffer(),
        Buffer.from("invoice"),
        walletB?.toBuffer(),
        new anchor.BN(existedServiceAccount?.invoiceCount || 0)?.toArrayLike(),
      ],
      programID
    );
    return _invoiceAddress;
  });

  const {
    mutateAsync: initializeCustomerServiceAccount,
    isLoading: isCreatingCustomerServiceAccount,
  } = useMutation(async (customerServiceAccountAddress: PublicKey) => {
    const tx = await program.methods
      .initializeCustomerServiceAccount()
      .accounts({
        serviceAccount: new PublicKey(serviceID),
        customerServicesAccount: customerServiceAccountAddress,
        authority: walletB!,
      })
      .transaction();
    await sendTransaction(tx, connection);
  });

  const { mutateAsync: pay, isLoading: isPaying } = useMutation(async () => {
    const tx = await program.methods
      .transferBToWallet()
      .accounts({
        merchantAccount: new PublicKey(merchantID),
        serviceAccount: new PublicKey(serviceID),
        walletB: walletB!,
      })
      .transaction();
    await sendTransaction(tx, connection);
  });

  const isLoading =
    isFindingExistedServiceAccount ||
    isGettingCustomerServiceAddress ||
    isCreatingCustomerServiceAccount ||
    isPaying;

  console.log(invoiceAccountAddress);

  const startPayment = async () => {
    if (!existedServiceAccount && customerServiceAddress) {
      await initializeCustomerServiceAccount(customerServiceAddress);
    }
  };
  return (
    <Button onClick={startPayment} isLoading={isLoading}>
      {STEPS[1].message}
      <ArrowForwardIcon style={{ marginLeft: "8px" }} />
    </Button>
  );
};

export default Step2;
