import Sidebar from "../Sidebar/Sidebar";
import { Button, Container, Flex, useToast } from "@chakra-ui/react";
import { useApp } from "../../hooks/useAppProvider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const Dashboard = () => {
  const { program, provider, merchantAccount } = useApp();
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const toast = useToast();

  const testInitialize = async () => {
    let tx = await program.methods.initialize().transaction();
    await sendTransaction(tx, connection);
    toast({
      title: "Initialized Program Successful",
      status: "success",
      position: "bottom-left",
    });
  };
  return (
    <Container w="100%" maxW="100%">
      <h2>dfnksnfk</h2>
      <Button onClick={testInitialize}>Test Initialize</Button>
    </Container>
  );
};

export default Dashboard;
