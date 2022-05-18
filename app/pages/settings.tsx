import { useApp } from "../src/hooks/useAppProvider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { web3 } from "@project-serum/anchor";
import { useEffect } from "react";
import { Button, useToast } from "@chakra-ui/react";
import withAuth from "../src/hooks/withAuth";

const SettingsPage = () => {
  const { program, provider, merchantAccount } = useApp();
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const toast = useToast();

  console.log(program);
  const fetchData = async () => {
    // await connection.confirmTransaction(
    // );

    const tx = await program.methods
      .initializeMerchant()
      .accounts({
        merchantAccount: merchantAccount,
        systemProgram: web3.SystemProgram.programId,
        user: publicKey?.toBase58(),
      })
      .transaction();

    await sendTransaction(tx, connection);

    console.log(merchantAccount?.toBase58());
    try {
      const merchantState = await program.account.merchant.fetch(
        merchantAccount?.toBase58()!
      );
    } catch (e) {
      toast({
        title: "Error",
        description: e?.toString(),
        status: "error",
        position: "bottom-left",
      });
    }
    // console.log("merchantState", merchantState);
  };

  useEffect(() => {
    // fetchData();
  }, []);

  return (
    <div>
      <Button onClick={fetchData}>test</Button>
    </div>
  );
};

export default withAuth(SettingsPage);
