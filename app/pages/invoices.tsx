import {
  TableCaption,
  Box,
  Container,
  Heading,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useApp } from "../src/hooks/useAppProvider";
import withAuth from "../src/hooks/withAuth";
import InvoicePerAccount from "../src/components/InvoiceRow";

const Invoices = () => {
  const router = useRouter();
  const { getServiceData } = useApp();
  const { serviceIndex } = router.query;
  const { data, isLoading } = useQuery(["service", serviceIndex], () =>
    getServiceData(serviceIndex)
  );
  const subscriptionAccounts = data?.subscriptionAccounts;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container
      w="100%"
      minW="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Box
        w="100%"
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Heading color={"gray.800"} lineHeight={1.1} fontSize={{ base: "3xl" }}>
          Invoice History of Plan #{serviceIndex}
        </Heading>
      </Box>
      <Box
        w="100%"
        minW="100%"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="flex-start"
        mt={6}
      >
        <TableContainer w="100%" minW="100%">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>user_wallet</Th>
                <Th>created_timestamp</Th>
                <Th>expiration_timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {subscriptionAccounts?.map((key) => {
                return (
                  <InvoicePerAccount
                    key={`invoice_account_${key}`}
                    userPublicKeyAddress={key}
                    serviceIndex={serviceIndex}
                  />
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default withAuth(Invoices);
