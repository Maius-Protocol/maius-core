import React, { useContext, useEffect, useState } from "react";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import { web3 } from "@project-serum/anchor";
import idl from "../idl.json";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  useConnection,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";
import * as anchor from "@project-serum/anchor";
import { MaiusPayment } from "../types/maius_payment";

const wallets = [new PhantomWalletAdapter()];

const { Keypair } = web3;
const programID = new PublicKey(idl.metadata.address);

interface AppProviderProps {
  children: React.ReactNode;
}

const ENDPOINT = "http://127.0.0.1:8899";

interface AppContextState {
  program: anchor.Program<MaiusPayment>;
  merchantAccount: PublicKey | undefined;
}

const AppContext = React.createContext<AppContextState | undefined>(undefined);

const ChildProvider: React.FunctionComponent<AppProviderProps> = ({
  children,
}: AppProviderProps) => {
  const [merchantAccount, setMerchantAccount] = useState<
    PublicKey | undefined
  >();
  const router = useRouter();
  const wallet = useWallet();
  const connection = useConnection();

  const program: anchor.Program<MaiusPayment> = new anchor.Program(
    idl,
    programID,
    {
      connection: connection.connection,
    }
  );

  const initData = async () => {
    if (!wallet.publicKey) {
      return;
    }
    const [_merchantAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("merchant"), wallet.publicKey.toBuffer()],
      program.programId
    );
    setMerchantAccount(_merchantAccount);
  };

  useEffect(() => {
    if (
      !wallet.connected &&
      router.pathname !== "/" &&
      router.pathname !== "/payment"
    ) {
      // router.push("/");
    }

    if (wallet.connected) {
      initData();
    }
  }, [wallet.connected, router.pathname]);

  return (
    <AppContext.Provider value={{ program, merchantAccount }}>
      {children}
    </AppContext.Provider>
  );
};

const AppProvider: React.FunctionComponent<AppProviderProps> = ({
  children,
}: AppProviderProps) => {
  return (
    <ConnectionProvider endpoint={ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ChildProvider>{children}</ChildProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export function useApp(): AppContextState {
  const context = useContext<any>(AppContext);

  if (!context) {
  }
  return context;
}

export default AppProvider;
