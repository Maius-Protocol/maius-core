import { Box, Container, Heading } from "@chakra-ui/react";
import CreateNewIntegration from "../src/components/CreateNewIntegration";
import React from "react";
import { useRouter } from "next/router";

const Transactions = () => {
  const router = useRouter();
  const { serviceID } = router.query;

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
          Transactions History of Service #{serviceID}
        </Heading>
      </Box>
    </Container>
  );
};

export default Transactions;
