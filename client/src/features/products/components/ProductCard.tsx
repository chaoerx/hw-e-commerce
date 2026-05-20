import { Badge, Button, Card, Group, Text } from '@mantine/core';

import { ProductImage } from './ProductImage';

export const ProductCard = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <ProductImage src="" alt="Product" height={160} />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} lineClamp={1} style={{ flex: 1 }}>
          Product Title
        </Text>
        <Badge color="pink">$99.99</Badge>
      </Group>

      <Text size="sm" c="dimmed" lineClamp={2}>
        Product description goes here
      </Text>

      <Group>
        <Text size="sm" mt="xs">
          Stock: 10
        </Text>
        <Text size="sm" mt="xs">
          Rating: 4.5
        </Text>
      </Group>

      <Button
        color="blue"
        fullWidth
        mt="md"
        radius="md"
      >
        View Details
      </Button>
    </Card>
  );
};
