import { Button, Container, useToast } from "@chakra-ui/react";
import { useApp } from "../../hooks/useAppProvider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const Dashboard = () => {
  const { program } = useApp();
  const { connection } = useConnection();
  const { sendTransaction } = useWallet();
  const toast = useToast();
  return <Container w="100%" maxW="100%"></Container>;
};

export default Dashboard;
