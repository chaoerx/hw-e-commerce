import {
  Avatar,
  Button,
  Group,
  Indicator,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconShoppingCart,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/context/AuthContext";
import { useCart } from "../cart/hooks/useCartQueries";

import { SearchBar } from "./SearchBar";
import { ThemeToggler } from "./ThemeToggler";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { data: cart } = useCart();
  const cartCount = cart?.totalQuantity ?? 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Group
      justify="space-between"
      p="md"
      style={{ borderBottom: "1px solid #e9ecef" }}
    >
      <Text
        size="xl"
        fw={700}
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        E-Commerce Store
      </Text>

      <SearchBar />

      <Group gap="sm">
        <ThemeToggler />

        <Indicator
          inline
          label={cartCount > 99 ? "99+" : cartCount}
          size={18}
          color="red"
          disabled={cartCount === 0}
          processing={cartCount > 0}
        >
          <Button
            variant="subtle"
            leftSection={<IconShoppingCart size={18} />}
            onClick={() => navigate("/cart")}
            aria-label={`Cart, ${cartCount} items`}
          >
            Cart
          </Button>
        </Indicator>

        {!isLoading && isAuthenticated && user ? (
          <Menu shadow="md" width={240} position="bottom-end">
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} />}
                aria-label="Account menu"
              >
                <Group gap="xs" wrap="nowrap">
                  <Avatar
                    src={user.image}
                    alt={user.username}
                    size="sm"
                    radius="xl"
                  />
                  <Stack gap={0} visibleFrom="sm">
                    <Text size="sm" fw={600} lineClamp={1}>
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      @{user.username}
                    </Text>
                  </Stack>
                </Group>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <Group gap="sm">
                  <Avatar src={user.image} alt="" size="md" radius="xl" />
                  <div>
                    <Text size="sm" fw={600}>
                      {user.firstName} {user.lastName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {user.email}
                    </Text>
                  </div>
                </Group>
              </Menu.Label>

              <Menu.Divider />

              <Menu.Item
                leftSection={<IconSettings size={16} />}
                onClick={() => navigate("/settings")}
              >
                Settings
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                leftSection={<IconLogout size={16} />}
                color="red"
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : !isLoading ? (
          <Button variant="filled" onClick={() => navigate("/login")}>
            Login
          </Button>
        ) : null}
      </Group>
    </Group>
  );
};
