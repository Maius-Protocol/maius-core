import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React from "react";
import {
  Box,
  Center,
  useColorModeValue,
  Heading,
  Text,
  Stack,
  Image,
  Button,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const IMAGE =
  "https://images.unsplash.com/photo-1518051870910-a46e30d9db16?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80";

const PaymentPage = () => {
  return (
    <div>
      <Center py={12} display="flex" flexDirection="column">
        <Box
          role={"group"}
          p={6}
          maxW={"330px"}
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"2xl"}
          rounded={"lg"}
          pos={"relative"}
          zIndex={1}
        >
          <Box
            rounded={"lg"}
            mt={-12}
            pos={"relative"}
            height={"230px"}
            _after={{
              transition: "all .3s ease",
              content: '""',
              w: "full",
              h: "full",
              pos: "absolute",
              top: 5,
              left: 0,
              backgroundImage: `url(${IMAGE})`,
              filter: "blur(15px)",
              zIndex: -1,
            }}
            _groupHover={{
              _after: {
                filter: "blur(20px)",
              },
            }}
          >
            <Image
              rounded={"lg"}
              height={230}
              width={282}
              objectFit={"cover"}
              src={IMAGE}
            />
          </Box>
          <Stack pt={10} align={"center"}>
            <Text
              color={"gray.500"}
              fontSize={"sm"}
              textTransform={"uppercase"}
            >
              Merchant: SPOTIFY
            </Text>
            <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
              1_MONTH_SUBSCRIPTION
            </Heading>
            <Stack direction={"row"} align={"center"}>
              <Text fontWeight={800} fontSize={"xl"}>
                0.2 SOL ~ 19$
              </Text>
            </Stack>
          </Stack>
        </Box>
        <Box
          mt="32"
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <WalletMultiButton />

          <Button
            colorScheme="red"
            variant="ghost"
            rightIcon={<ArrowForwardIcon />}
            mt={8}
          >
            Cancel payment
          </Button>
        </Box>
      </Center>
    </div>
  );
};

export default PaymentPage;
