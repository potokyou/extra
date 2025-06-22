import {
  Box,
  chakra,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  ChartPieIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  DocumentMinusIcon,
  LinkIcon,
  MoonIcon,
  SquaresPlusIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useDashboard } from "contexts/DashboardContext";
import differenceInDays from "date-fns/differenceInDays";
import isValid from "date-fns/isValid";
import { FC, ReactNode, useState } from "react";
import GitHubButton from "react-github-btn";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { updateThemeColor } from "utils/themeColor";
import { Language } from "./Language";
import useGetUser from "hooks/useGetUser";

type HeaderProps = {
  actions?: ReactNode;
};
const iconProps = {
  baseStyle: {
    w: 4,
    h: 4,
  },
};

const DarkIcon = chakra(MoonIcon, iconProps);
const LightIcon = chakra(SunIcon, iconProps);
const CoreSettingsIcon = chakra(Cog6ToothIcon, iconProps);
const SettingsIcon = chakra(Bars3Icon, iconProps);
const LogoutIcon = chakra(ArrowLeftOnRectangleIcon, iconProps);
const HostsIcon = chakra(LinkIcon, iconProps);
const NodesIcon = chakra(SquaresPlusIcon, iconProps);
const NodesUsageIcon = chakra(ChartPieIcon, iconProps);
const ResetUsageIcon = chakra(DocumentMinusIcon, iconProps);
const NotificationCircle = chakra(Box, {
  baseStyle: {
    bg: "yellow.500",
    w: "2",
    h: "2",
    rounded: "full",
    position: "absolute",
  },
});

const NOTIFICATION_KEY = "marzban-menu-notification";

export const Header: FC<HeaderProps> = ({ actions }) => {
  const { userData, getUserIsSuccess, getUserIsPending } = useGetUser();

  const isSudo = () => {
    if (!getUserIsPending && getUserIsSuccess) {
      return userData.is_sudo;
    }
    return false;
  };

  const {
    onEditingHosts,
    onResetAllUsage,
    onEditingNodes,
    onShowingNodesUsage,
  } = useDashboard();
  const { t } = useTranslation();
  const { colorMode, toggleColorMode } = useColorMode();
  const gBtnColor = colorMode === "dark" ? "dark_dimmed" : colorMode;

  const handleOnClose = () => {
    localStorage.setItem(NOTIFICATION_KEY, new Date().getTime().toString());
  };

  return (
    <HStack
      gap={2}
      justifyContent="space-between"
      __css={{
        "& .menuList": {
          direction: "ltr",
        },
      }}
      position="relative"
    >
      <Text as="h1" fontWeight="semibold" fontSize="2xl">
        {t("users")}
      </Text>
      <Box overflow="auto" css={{ direction: "rtl" }}>
        <HStack alignItems="center">
          <Menu>
            <MenuButton
              as={IconButton}
              size="sm"
              variant="outline"
              icon={
                <>
                  <SettingsIcon />
                </>
              }
              position="relative"
            ></MenuButton>
            <MenuList minW="170px" zIndex={99999} className="menuList">
              {isSudo() && (
                <>
                  <MenuItem
                    maxW="170px"
                    fontSize="sm"
                    icon={<HostsIcon />}
                    onClick={onEditingHosts.bind(null, true)}
                  >
                    {t("header.hostSettings")}
                  </MenuItem>
                  <MenuItem
                    maxW="170px"
                    fontSize="sm"
                    icon={<NodesIcon />}
                    onClick={onEditingNodes.bind(null, true)}
                  >
                    {t("header.nodeSettings")}
                  </MenuItem>
                  <MenuItem
                    maxW="170px"
                    fontSize="sm"
                    icon={<NodesUsageIcon />}
                    onClick={onShowingNodesUsage.bind(null, true)}
                  >
                    {t("header.nodesUsage")}
                  </MenuItem>
                  <MenuItem
                    maxW="170px"
                    fontSize="sm"
                    icon={<ResetUsageIcon />}
                    onClick={onResetAllUsage.bind(null, true)}
                  >
                    {t("resetAllUsage")}
                  </MenuItem>
                </>
              )}
              <Link to="/login">
                <MenuItem maxW="170px" fontSize="sm" icon={<LogoutIcon />}>
                  {t("header.logout")}
                </MenuItem>
              </Link>
            </MenuList>
          </Menu>

          {isSudo() && (
            <IconButton
              size="sm"
              variant="outline"
              aria-label="core settings"
              onClick={() => {
                useDashboard.setState({ isEditingCore: true });
              }}
            >
              <CoreSettingsIcon />
            </IconButton>
          )}

          <Language />

          <IconButton
            size="sm"
            variant="outline"
            aria-label="switch theme"
            onClick={() => {
              updateThemeColor(colorMode == "dark" ? "light" : "dark");
              toggleColorMode();
            }}
          >
            {colorMode === "light" ? <DarkIcon /> : <LightIcon />}
          </IconButton>
        </HStack>
      </Box>
    </HStack>
  );
};
