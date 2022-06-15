import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Link,
  Popover,
  PopoverTrigger,
  Stack,
  Image,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import LinkNext from "next/link";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React from "react";
import { FiHome, FiPlusCircle, FiSettings } from "react-icons/fi";
import CurrentBalance from "./Header/CurrentBalance";
import { useRouter } from "next/router";

const Navigation = () => {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();
  const wallet = useWallet();
  const bg = useColorModeValue("gray.600", "white");
  const border = useColorModeValue("gray.200", "gray.900");
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  if (router.pathname === "/payment") {
    return <></>;
  }

  return (
    <Box w="100%" minW="100%">
      <Flex
        color={bg}
        minH={"60px"}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={border}
        alignItems="center"
        justifyContent="center"
        backgroundColor="rgba(255, 255, 255, 0.4)"
        backdropFilter="saturate(180%) blur(5px)"
        w="100%"
        minW="100%"
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
          w="100%"
          minW="100%"
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
          <Box p={1} display="flex" flexDirection="row" alignItems="center">
            <img
              alt="MaiusPay"
              src="/logo.svg"
              style={{ maxWidth: "64px", maxHeight: "32px" }}
            />
          </Box>
          <Flex display={{ base: "none", md: "flex" }} ml={4}>
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

        {wallet.connected && (
          <>
            <CurrentBalance />-
            <WalletMultiButton />
          </>
        )}
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
    label: "Plans",
    href: "/plans",
    icon: FiPlusCircle,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: FiSettings,
  },
];
export default Navigation;
