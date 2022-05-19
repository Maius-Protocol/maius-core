import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@solana/wallet-adapter-react-ui/styles.css";
import AppProvider from "../src/hooks/useAppProvider";
import Head from "next/head";
import {
  ChakraProvider,
  Container,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import Navigation from "../src/components/Header";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import React from "react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ReactQueryDevtools } from "react-query/devtools";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const wallets = [new PhantomWalletAdapter()];
const ENDPOINT = "http://127.0.0.1:8899";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>Maius Payment Gateway</title>
      </Head>
      <ChakraProvider>
        <ConnectionProvider endpoint={ENDPOINT}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <AppProvider>
                <>
                  <Flex top={0} as="header" position="fixed" w="100%">
                    <Navigation />
                  </Flex>
                  <Container
                    as="main"
                    mt="20"
                    w="100%"
                    minH="100vh"
                    maxW="100%"
                  >
                    <Component {...pageProps} />
                  </Container>
                </>
                <ReactQueryDevtools initialIsOpen={false} />
              </AppProvider>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
