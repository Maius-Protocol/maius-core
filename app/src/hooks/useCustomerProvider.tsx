import React, { useContext, useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { MaiusPayment } from "../types/maius_payment";
import { PublicKey } from "@solana/web3.js";
import { UseQueryResult } from "react-query";
import idl from "../idl.json";
import { programID } from "./useAppProvider";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { getTime, setDate } from "date-fns";
import { BN, web3 } from "@project-serum/anchor";
import { base58_to_binary } from "base58-js";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";

interface CustomerProviderProps {
  children: React.ReactNode;
}

interface CustomerContextState {
  program: anchor.Program<MaiusPayment>;
}

const CustomerContext = React.createContext<CustomerContextState | undefined>(
  undefined
);

const CustomerProvider = ({ children }) => {
  const router = useRouter();
  const { userID, merchantID, serviceID } = router.query;
  const [program, setProgram] = useState<
    anchor.Program<MaiusPayment> | undefined
  >();
  const wallet = useWallet();
  const { sendTransaction } = wallet;
  const toast = useToast();
  const connection = useConnection();
  const provider = new anchor.AnchorProvider(
    connection.connection,
    wallet.wallet,
    anchor.AnchorProvider.defaultOptions()
  );

  const get28DateOfMonth = () => {
    return Math.trunc(getTime(setDate(new Date(), 28)) / 1000);
  };

  const getInvoiceAccountAddress = async () => {
    const [_invoiceAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(base58_to_binary(serviceID)),
        Buffer.from("invoice"),
        Buffer.from(base58_to_binary(userID)),
        // new anchor.BN(5)?.toArrayLike(Buffer),
        // new anchor.BN(2022)?.toArrayLike(Buffer),
      ],
      programID
    );
    return _invoiceAccount;
  };

  const initializeInvoice = async () => {
    const invoiceAccount = await getInvoiceAccountAddress();
    try {
      const tx = await program.methods
        .initializeInvoice()
        .accounts({
          serviceAccount: new PublicKey(serviceID),
          invoiceAccount: invoiceAccount,
          customerAuthority: wallet.publicKey!,
          systemProgram: web3.SystemProgram.programId,
        })
        .transaction();
      console.log(tx);
      await sendTransaction(tx, connection.connection);
      // await currentMerchantData.refetch();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message?.toString(),
        status: "error",
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    const _program: anchor.Program<MaiusPayment> = new anchor.Program(
      idl,
      programID,
      provider
    );
    setProgram(_program);
  }, []);

  return (
    <CustomerContext.Provider
      value={{ program, getInvoiceAccountAddress, initializeInvoice }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
export function useCustomerApp(): CustomerContextState {
  const context = useContext<any>(CustomerContext);

  if (!context) {
  }
  return context;
}

export default CustomerProvider;
