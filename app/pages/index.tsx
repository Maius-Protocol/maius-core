import type { NextPage } from "next";
import Hero from "../src/components/Hero/Hero";
import { useWallet } from "@solana/wallet-adapter-react";
import Dashboard from "../src/components/Dashboard";

const Home: NextPage = () => {
  const wallet = useWallet();

  if (wallet.connected) {
    return <Dashboard />;
  }

  return (
    <>
      <Hero />
    </>
  );
};

export default Home;
