import { Button, Container, Text, useToast } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import React from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useCustomerApp } from "../../hooks/useCustomerProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { STEPS } from "../../../pages/payment";
import { PublicKey } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";
import { useMutation } from "react-query";

const Step1 = ({ setCurrentStep }) => {
  const router = useRouter();
  const { merchant, service, program } = useCustomerApp();
  const { data: merchantData } = merchant;
  const { data: serviceData } = service;
  const { userID } = router.query;
  const wallet = useWallet();
  const { sendTransaction, disconnect } = wallet;
  const { connection } = useConnection();
  const sameWallet = wallet.publicKey?.toBase58() === userID;
  const toast = useToast();
  const walletA = wallet.publicKey;
  const walletB = new PublicKey(userID);
  const { mutateAsync: transfer, isLoading } = useMutation(
    async () => {
      const tx = await program.methods
        .tranferAToB(serviceData?.expectedAmount)
        .accounts({
          walletA: walletA!,
          walletB: walletB,
        })
        .transaction();
      await sendTransaction(tx, connection);
      await new Promise((resolve) => setTimeout(resolve, 3000));
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
          title: `Transfer Success. Now switch to your ${merchantData?.title} account.`,
          status: "success",
          position: "bottom-left",
        });
        disconnect();
        setCurrentStep("step_2");
      },
    }
  );

  return (
    <Container mt={4}>
      {sameWallet && (
        <Container
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontWeight="bold" color="red.600" textAlign="left" mb={6}>
            You're using the same wallet that logged in {merchantData?.title}.
            <br /> Please using different wallet that having sufficient amount
            to protect your privacy
          </Text>
          <WalletMultiButton style={{ width: "320px" }} />
        </Container>
      )}
      {!sameWallet && (
        <Button onClick={transfer} isLoading={isLoading}>
          {STEPS[0].message}
          <ArrowForwardIcon style={{ marginLeft: "8px" }} />
        </Button>
      )}
    </Container>
  );
};

export default Step1;
