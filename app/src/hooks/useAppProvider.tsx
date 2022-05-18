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

const { Keypair } = web3;
const programID = new PublicKey(idl.metadata.address);

interface AppProviderProps {
  children: React.ReactNode;
}

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

  const [program, setProgram] = useState<
    anchor.Program<MaiusPayment> | undefined
  >();
  const router = useRouter();
  const wallet = useWallet();
  const connection = useConnection();

  const provider = new anchor.AnchorProvider(
    connection.connection,
    wallet.wallet,
    anchor.AnchorProvider.defaultOptions()
  );

  const initData = async () => {
    if (!wallet.publicKey) {
      return;
    }
    const [_merchantAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("merchant"), wallet.publicKey.toBuffer()],
      programID
    );
    setMerchantAccount(_merchantAccount);
  };
  console.log(programID.toBase58());

  useEffect(() => {
    const _program: anchor.Program<MaiusPayment> = new anchor.Program(
      idl,
      programID,
      provider
    );
    setProgram(_program);
  }, []);

  useEffect(() => {
    if (
      !wallet.connected &&
      router.pathname !== "/" &&
      router.pathname !== "/payment"
    ) {
      // router.push("/");
    }

    initData();
  }, [router.pathname]);

  return (
    <AppContext.Provider value={{ program, merchantAccount, provider }}>
      {children}
    </AppContext.Provider>
  );
};

const AppProvider: React.FunctionComponent<AppProviderProps> = ({
  children,
}: AppProviderProps) => {
  const wallet = useWallet();

  if (!wallet.connected) {
    return children;
  }

  return <ChildProvider>{children}</ChildProvider>;
};

export function useApp(): AppContextState {
  const context = useContext<any>(AppContext);

  if (!context) {
  }
  return context;
}

export default AppProvider;
