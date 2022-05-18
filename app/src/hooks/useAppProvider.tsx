import React, { useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";
import idl from "../idl.json";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";

const wallets = [new PhantomWalletAdapter()];

const { Keypair } = web3;
const programID = new PublicKey(idl.metadata.address);

interface AppProviderProps {
  children: React.ReactNode;
}

const ChildProvider: React.FunctionComponent<AppProviderProps> = ({
  children,
}: AppProviderProps) => {
  const router = useRouter();
  const wallet = useWallet();

  useEffect(() => {
    if (
      !wallet.connected &&
      router.pathname !== "/" &&
      router.pathname !== "/payment"
    ) {
      // router.push("/");
    }
  }, [wallet.connected, router.pathname]);

  return <>{children}</>;
};

const AppProvider: React.FunctionComponent<AppProviderProps> = ({
  children,
}: AppProviderProps) => {
  return (
    <ConnectionProvider endpoint="http://127.0.0.1:8899">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ChildProvider>{children}</ChildProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default AppProvider;