import { Avatar, Button, Group, Indicator, Menu, Text } from "@mantine/core";
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
  const { user, isAuthenticated, logout } = useAuth();
  const { data: cart } = useCart();
  const cartCount = cart?.totalQuantity ?? 0;

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

      <Group>
        <ThemeToggler />
        <Indicator
          label={cartCount > 0 ? cartCount : undefined}
          size={16}
          color="red"
          position="middle-start"
          disabled={cartCount === 0}
        >
          <Button
            variant="subtle"
            leftSection={<IconShoppingCart size={18} />}
            onClick={() => navigate("/cart")}
          >
            Cart
          </Button>
        </Indicator>

        {isAuthenticated && user ? (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button
                variant="subtle"
                rightSection={<IconChevronDown size={16} />}
              >
                <Group gap="xs">
                  <Avatar src={user.image} alt={user.username} size="sm" />
                  <Text size="sm">{user.firstName}</Text>
                </Group>
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
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
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <Button variant="filled" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Group>
    </Group>
  );
};
