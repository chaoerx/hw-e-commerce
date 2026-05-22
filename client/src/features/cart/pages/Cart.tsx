import {
  Button,
  Card,
  Container,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { Spinner } from "../../../components/ui/Spinner";
import { useAuth } from "../../auth/context/AuthContext";
import {
  useCart,
  useClearCart,
  useRemoveCartItem,
} from "../hooks/useCartQueries";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: cart, isLoading, isError, error } = useCart();
  const removeCartItem = useRemoveCartItem();
  const clearCart = useClearCart();

  if (authLoading || isLoading) {
    return (
      <Container size="lg" py="xl">
        <Spinner />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container size="lg" py="xl">
        <Title order={1} mb="md">
          Shopping Cart
        </Title>
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="md">
            <Text>Please log in to view your cart.</Text>
            <Button component={Link} to="/login" w="fit-content">
              Go to Login
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }

  const isEmpty = !cart || cart.products.length === 0;

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Shopping Cart</Title>
        {!isEmpty && (
          <Button
            variant="outline"
            color="red"
            leftSection={<IconTrash size={16} />}
            loading={clearCart.isPending}
            onClick={() => clearCart.mutate()}
          >
            Clear Cart
          </Button>
        )}
      </Group>

      {isError && (
        <ErrorMessage
          message={
            axios.isAxiosError(error)
              ? ((error.response?.data as { message?: string })?.message ??
                error.message)
              : "Failed to load cart"
          }
        />
      )}

      {isEmpty && !isError && (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="md">
            <Text size="lg">Your cart is empty</Text>
            <Button component={Link} to="/products" w="fit-content">
              Browse Products
            </Button>
          </Stack>
        </Card>
      )}

      {!isEmpty && cart && (
        <Stack gap="md">
          {cart.products.map((item) => (
            <Card key={item.id} shadow="sm" padding="md" radius="md" withBorder>
              <Group align="flex-start" wrap="nowrap">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  width={100}
                  height={100}
                  radius="md"
                  fit="cover"
                />

                <Stack gap="xs" style={{ flex: 1 }}>
                  <Text
                    fw={600}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    {item.title}
                  </Text>
                  <Text size="sm" c="dimmed">
                    ${item.price.toFixed(2)} each
                  </Text>
                  <Text size="sm">Quantity: {item.quantity}</Text>
                  <Text fw={700} c="blue">
                    ${item.discountedTotal.toFixed(2)}
                  </Text>
                </Stack>

                <Button
                  variant="light"
                  color="red"
                  loading={removeCartItem.isPending}
                  onClick={() => removeCartItem.mutate(item.id)}
                >
                  Remove
                </Button>
              </Group>
            </Card>
          ))}

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <Stack gap={4}>
                <Text size="lg" fw={600}>
                  Order Total
                </Text>
                <Text size="sm" c="dimmed">
                  {cart.totalQuantity} items • {cart.totalProducts} products
                </Text>
              </Stack>
              <Stack gap={4} align="flex-end">
                {cart.total !== cart.discountedTotal && (
                  <Text size="sm" c="dimmed" td="line-through">
                    ${cart.total.toFixed(2)}
                  </Text>
                )}
                <Text size="xl" fw={700} c="blue">
                  ${cart.discountedTotal.toFixed(2)}
                </Text>
              </Stack>
            </Group>
          </Card>
        </Stack>
      )}
    </Container>
  );
};

export default Cart;
