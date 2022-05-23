import { useQuery } from "react-query";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { programID, useApp } from "../hooks/useAppProvider";
import { Spinner, Td, Tr } from "@chakra-ui/react";
import React from "react";
import { format } from "date-fns";

const InvoiceRow = ({ invoiceIndex, userPublicKeyAddress, serviceIndex }) => {
  const { getServiceAccount, program } = useApp();

  const invoiceAddressQuery = useQuery(
    ["invoice-account-address", invoiceIndex],
    async () => {
      const serviceID = await getServiceAccount(serviceIndex);
      const [_invoiceAddress] = await anchor.web3.PublicKey.findProgramAddress(
        [
          serviceID?.toBuffer(),
          Buffer.from("invoice"),
          userPublicKeyAddress?.toBuffer(),
          new anchor.BN(invoiceIndex)?.toArrayLike(Buffer),
        ],
        programID
      );
      return _invoiceAddress;
    }
  );

  const invoiceAccountQuery = useQuery(
    ["invoice-account", invoiceAddressQuery?.data],
    async () => {
      return await program.account.invoice.fetch(invoiceAddressQuery?.data!);
    },
    { enabled: invoiceAddressQuery?.data !== null }
  );

  const { data, isLoading } = invoiceAccountQuery;
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Tr>
      <Td>{data?.userWallet?.toBase58()}</Td>
      <Td>
        {format(
          new Date(data?.createdTimestamp?.toNumber() * 1000),
          "HH:mm:ss dd-MM-yyyy"
        )}
      </Td>
      <Td>
        {format(
          new Date(data?.expirationTimestamp?.toNumber() * 1000),
          "HH:mm:ss dd-MM-yyyy"
        )}
      </Td>
    </Tr>
  );
};
const InvoicePerAccount = ({ userPublicKeyAddress, serviceIndex }) => {
  const { getServiceAccount, program } = useApp();
  const customerServiceAddressQuery = useQuery(
    "customer-service-account-address",
    async () => {
      const serviceID = await getServiceAccount(serviceIndex);
      const [_customerServiceAddress] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            Buffer.from("customer_service_account"),
            serviceID?.toBuffer(),
            userPublicKeyAddress?.toBuffer(),
          ],
          programID
        );
      return _customerServiceAddress;
    }
  );

  const customerServiceAccountQuery = useQuery(
    "customer-service-account",
    async () => {
      return await program.account.customerServices.fetch(
        customerServiceAddressQuery.data!
      );
    },
    { enabled: !!customerServiceAddressQuery.data }
  );

  return (
    <>
      {[
        ...Array(customerServiceAccountQuery?.data?.invoiceCount || 0).keys(),
      ].map((invoiceIndex) => {
        return (
          <InvoiceRow
            key={`invoice_${invoiceIndex}`}
            invoiceIndex={invoiceIndex}
            serviceIndex={serviceIndex}
            userPublicKeyAddress={userPublicKeyAddress}
          />
        );
      })}
    </>
  );
};

export default InvoicePerAccount;
