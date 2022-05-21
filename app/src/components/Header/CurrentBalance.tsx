import { Button, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "react-query";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const CurrentBalance = () => {
  const wallet = useWallet();
  const connection = useConnection();
  const { isLoading, error, data } = useQuery("currentBalance", () =>
    connection.connection.getBalance(wallet.publicKey!)
  );

  return (
    <Button variant="ghost">
      <>
        Your current balance: {isLoading && <Spinner ml={2} />}
        {!isLoading && (
          <Text ml={2}>
            {((data || 0) / LAMPORTS_PER_SOL)?.toPrecision(4)} SOL
          </Text>
        )}
        {error && <Text ml={2}>Cannot fetch</Text>}
      </>
    </Button>
  );
};

export default CurrentBalance;
