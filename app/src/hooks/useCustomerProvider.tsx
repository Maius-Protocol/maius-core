import React, { useContext, useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { MaiusPayment } from "../types/maius_payment";
import { PublicKey } from "@solana/web3.js";
import { useMutation, useQuery, UseQueryResult } from "react-query";
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
  const { connection } = useConnection();
  const provider = new anchor.AnchorProvider(
    connection,
    wallet.wallet,
    anchor.AnchorProvider.defaultOptions()
  );

  const merchant = useQuery(
    ["merchant", merchantID],
    () => program.account.merchant.fetch(merchantID!),
    {
      enabled: program !== undefined && merchantID !== null,
    }
  );
  const service = useQuery(
    ["service", serviceID],
    () => program.account.service.fetch(serviceID!),
    {
      enabled: program !== undefined && serviceID !== null,
    }
  );

  const customerServiceAddressQuery = useQuery(
    "customer-service-account-address",
    async () => {
      const [_customerServiceAddress] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("customer_service_account"),
            new PublicKey(serviceID || "")?.toBuffer(),
            wallet?.publicKey?.toBuffer(),
          ],
          programID
        );
      return _customerServiceAddress;
    },
    {
      enabled: wallet.connected,
    }
  );

  const customerServiceAccountQuery = useQuery(
    "customer-service-account",
    async () => {
      return await program.account.customerServices.fetch(
        customerServiceAddressQuery.data!
      );
    },
    { retry: false, enabled: !!customerServiceAddressQuery.data }
  );

  const invoiceAddressQuery = useQuery(
    [
      "invoice-account-address",
      customerServiceAccountQuery?.data?.invoiceCount - 1,
    ],
    async () => {
      const [_invoiceAddress] = await anchor.web3.PublicKey.findProgramAddress(
        [
          new PublicKey(serviceID)?.toBuffer(),
          Buffer.from("invoice"),
          wallet?.publicKey?.toBuffer(),
          new anchor.BN(
            customerServiceAccountQuery?.data?.invoiceCount - 1
          )?.toArrayLike(Buffer),
        ],
        programID
      );
      return _invoiceAddress;
    },
    {
      enabled:
        wallet.connected &&
        customerServiceAccountQuery?.data?.invoiceCount !== null,
    }
  );

  const invoiceAccountQuery = useQuery(
    ["invoice-account", invoiceAddressQuery?.data],
    async () => {
      return await program.account.invoice.fetch(invoiceAddressQuery?.data!);
    },
    { enabled: invoiceAddressQuery?.data !== null }
  );
  // console.log(invoiceAccountQuery.data, invoiceAddressQuery.data);

  const createCustomerServiceAccountQuery = useMutation(
    async (customerServiceAccountAddress: PublicKey) => {
      const tx = await program.methods
        .initializeCustomerServiceAccount()
        .accounts({
          serviceAccount: new PublicKey(serviceID),
          customerServicesAccount: customerServiceAccountAddress,
          authority: wallet.publicKey!,
        })
        .transaction();
      await sendTransaction(tx, connection);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await customerServiceAddressQuery.refetch();
      await customerServiceAccountQuery.refetch();
    },
    {
      onError: (e) => {
        toast({
          title: "Error",
          description: e?.message?.toString(),
          status: "error",
          position: "bottom-left",
        });
      },
      onSuccess: () => {
        toast({
          title: "Create service account success",
          status: "success",
          position: "bottom-left",
        });
      },
    }
  );

  const createInvoiceAccountQuery = useMutation(
    async () => {
      await customerServiceAddressQuery.refetch();
      await customerServiceAccountQuery.refetch();
      const tx = await program.methods
        .initializeInvoice()
        .accounts({
          serviceAccount: new PublicKey(serviceID!),
          customerServicesAccount: customerServiceAddressQuery?.data,
          invoiceAccount: invoiceAddressQuery?.data,
          customerAuthority: wallet.publicKey!,
        })
        .transaction();
      await sendTransaction(tx, connection);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    },

    {
      onError: (e) => {
        toast({
          title: "Error",
          description: e?.message?.toString(),
          status: "error",
          position: "bottom-left",
        });
      },
      onSuccess: () => {
        toast({
          title: "Create invoice account success",
          status: "success",
          position: "bottom-left",
        });
      },
    }
  );

  const transferWalletBToMerchantQuery = useMutation(
    async () => {
      const tx = await program.methods
        .transferBToWallet()
        .accounts({
          merchantAccount: new PublicKey(merchantID!),
          serviceAccount: new PublicKey(serviceID!),
          invoiceAccount: invoiceAddressQuery.data!,
          walletB: wallet.publicKey!,
          systemProgram: web3.SystemProgram.programId,
        })
        .transaction();
      await sendTransaction(tx, connection);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // await customerServiceAddressQuery.refetch();
      // await customerServiceAccountQuery.refetch();
      // await invoiceAddressQuery.refetch();
      // await invoiceAccountQuery.refetch();
      window.location.reload();
    },
    {
      onError: (e) => {
        toast({
          title: "Error",
          description: e?.message?.toString(),
          status: "error",
          position: "bottom-left",
        });
      },
      onSuccess: () => {
        toast({
          title: "Tranfer B to Merchant Success",
          status: "success",
          position: "bottom-left",
        });
      },
    }
  );

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
      value={{
        program,
        merchant,
        service,
        customerServiceAddressQuery,
        customerServiceAccountQuery,
        invoiceAddressQuery,
        invoiceAccountQuery,
        createCustomerServiceAccountQuery,
        createInvoiceAccountQuery,
        transferWalletBToMerchantQuery,
        userID,
        merchantID,
        serviceID,
      }}
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
