import "../styles/globals.css";
import type { AppProps } from "next/app";
import "@solana/wallet-adapter-react-ui/styles.css";
import AppProvider from "../src/hooks/useAppProvider";
import Head from "next/head";
import { ChakraProvider, Container, Flex } from "@chakra-ui/react";
import Navigation from "../src/components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
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
  );
}

export default MyApp;
