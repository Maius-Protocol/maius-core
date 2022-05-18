import {
  Box,
  Flex,
  Icon,
  IconButton,
  Link,
  Popover,
  PopoverTrigger,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import LinkNext from "next/link";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React from "react";
import { FiDollarSign, FiHome, FiPlusCircle } from "react-icons/fi";

const Navigation = () => {
  const { isOpen, onToggle } = useDisclosure();
  const wallet = useWallet();

  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Box w="100%">
      <Flex
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        alignItems="center"
        justifyContent="center"
        backgroundColor="rgba(255, 255, 255, 0.4)"
        backdropFilter="saturate(180%) blur(5px)"
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          alignItems="center"
          justifyContent="flex-start"
        >
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            fontWeight="bold"
            color={useColorModeValue("gray.800", "white")}
          >
            Maius Payment Gateway
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <Stack direction={"row"} spacing={4}>
              {wallet.connected &&
                NAV_ITEMS.map((navItem) => (
                  <Box key={navItem.label}>
                    <Popover trigger={"hover"} placement={"bottom-start"}>
                      <PopoverTrigger>
                        <LinkNext href={navItem.href as any}>
                          <Link
                            p={2}
                            href={navItem.href ?? "#"}
                            fontSize={"sm"}
                            fontWeight={500}
                            color={linkColor}
                            _hover={{
                              textDecoration: "none",
                              color: linkHoverColor,
                            }}
                            display="flex"
                            alignItems="center"
                          >
                            <Icon
                              mr="4"
                              fontSize="16"
                              _groupHover={{
                                color: "white",
                              }}
                              as={navItem.icon}
                            />
                            {navItem.label}
                          </Link>
                        </LinkNext>
                      </PopoverTrigger>
                    </Popover>
                  </Box>
                ))}
            </Stack>
          </Flex>
        </Flex>

        {wallet.connected && <WalletMultiButton />}
      </Flex>
    </Box>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  icon: any;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Dashboard",
    href: "/",
    icon: FiHome,
  },
  {
    label: "Integrations",
    href: "/integrations",
    icon: FiPlusCircle,
  },
  {
    label: "Transactions",
    href: "/transactions",
    icon: FiDollarSign,
  },
];
export default Navigation;
