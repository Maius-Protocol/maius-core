import { Button, Text } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";

const Step3 = () => {
  const router = useRouter();
  const { userID } = router.query;
  const wallet = useWallet();
  const sameWallet = wallet.publicKey?.toBase58() === userID;

  return (
    <>
      {sameWallet && (
        <>
          <Button mb={4} w={360} size="lg">
            Follow the notice below to continue
          </Button>

          <Text fontWeight="bold" color="red.600" textAlign="center" mb={6}>
            You're using the same wallet that logged in {merchantData?.title}.
            <br /> Please using different wallet that having sufficient amount
            to protect your privacy
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
    </>
  );
};

export default Step3;
