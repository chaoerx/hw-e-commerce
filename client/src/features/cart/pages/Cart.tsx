import { Card, Container, Text, Title } from "@mantine/core";

const Cart = () => {
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">
        Shopping Cart
      </Title>
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Text size="lg">Your cart is empty</Text>
      </Card>
    </Container>
  );
};

export default Cart;
