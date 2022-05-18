import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@solana/wallet-adapter-react-ui/styles.css";
import AppProvider from "../src/hooks/useAppProvider";
import Head from "next/head";
import { ChakraProvider, Container, Flex } from "@chakra-ui/react";
import Navigation from "../src/components/Header";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AppProvider>
          <Head>
            <title>Maius Payment Gateway</title>
          </Head>
          <>
            <Flex top={0} as="header" position="fixed" w="100%">
              <Navigation />
            </Flex>
            <Container as="main" mt="20" w="100%" maxW="100%">
              <Component {...pageProps} />
            </Container>
          </>
        </AppProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
