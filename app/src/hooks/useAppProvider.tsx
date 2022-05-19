import React, { useContext, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { web3 } from "@project-serum/anchor";
import idl from "../idl.json";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { MaiusPayment } from "../types/maius_payment";
import { useQuery, UseQueryResult } from "react-query";

const { Keypair } = web3;
export const programID = new PublicKey(idl.metadata.address);

interface AppProviderProps {
  children: React.ReactNode;
}

interface AppContextState {
  program: anchor.Program<MaiusPayment>;
  merchantAccount: PublicKey | undefined;
  currentMerchantData: UseQueryResult<any>;
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

  const currentMerchantData = useQuery("currentMerchant", () =>
    program.account.merchant.fetch(merchantAccount?.toBase58()!)
  );

  const {} = useQuery();
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

  const getServiceAccount = async (index: number) => {
    const [_serviceAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("service"),
        merchantAccount?.toBuffer(),
        new anchor.BN(index)?.toArrayLike(Buffer),
      ],
      programID
    );
    return _serviceAccount;
  };

  const getServiceData = async (index: number) => {
    const _serviceAccount = await getServiceAccount(index);
    return await program.account.service.fetch(_serviceAccount);
  };

  useEffect(() => {
    const _program: anchor.Program<MaiusPayment> = new anchor.Program(
      idl,
      programID,
      provider
    );
    setProgram(_program);
  }, []);

  useEffect(() => {
    if (program?.account) {
      currentMerchantData.refetch();
    }
  }, [program]);

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
    <AppContext.Provider
      value={{
        program,
        merchantAccount,
        currentMerchantData,
        provider,
        getServiceAccount,
        getServiceData,
      }}
    >
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
